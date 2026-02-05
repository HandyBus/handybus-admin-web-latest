import { getReservations } from '@/services/reservation.service';
import { getShuttleRoutesOfDailyEvent } from '@/services/shuttleRoute.service';
import { ReservationViewEntity } from '@/types/reservation.type';
import { AdminShuttleRoutesViewEntity } from '@/types/shuttleRoute.type';
import dayjs from 'dayjs';
import ExcelJS from 'exceljs';

interface Props {
  eventId: string;
  dailyEventId: string;
}

const useExportHandyPartyPassengerList = ({ eventId, dailyEventId }: Props) => {
  const getAllShuttleRoutes = async () => {
    const shuttleRoutes = await getShuttleRoutesOfDailyEvent(
      eventId,
      dailyEventId,
    );
    const handyPartyShuttleRoutes = shuttleRoutes.filter(
      (shuttleRoute) => shuttleRoute.isHandyParty,
    );
    return handyPartyShuttleRoutes;
  };

  const getAllReservations = async () => {
    const res = await getReservations({
      eventId,
      dailyEventId,
      reservationStatus: 'COMPLETE_PAYMENT',
    });
    return res.reservations;
  };

  const getShuttleRoutesWithReservations = async () => {
    const shuttleRoutes = await getAllShuttleRoutes();
    const reservations = await getAllReservations();
    const shuttleRoutesWithReservations = shuttleRoutes.map((shuttleRoute) => ({
      shuttleRoute,
      reservations: reservations.filter(
        (reservation) =>
          reservation.shuttleRouteId === shuttleRoute.shuttleRouteId,
      ),
    }));

    return shuttleRoutesWithReservations;
  };

  const convertToExcelFormat = async (
    shuttleRoutesWithReservations: {
      shuttleRoute: AdminShuttleRoutesViewEntity;
      reservations: ReservationViewEntity[];
    }[],
  ) => {
    const result = [];

    for (const shuttleRouteWithReservation of shuttleRoutesWithReservations) {
      const { shuttleRoute, reservations } = shuttleRouteWithReservation;
      // 행사장행
      if (shuttleRoute.toDestinationShuttleRouteHubs !== null) {
        const toDestinationShuttleRouteHubs =
          shuttleRoute.toDestinationShuttleRouteHubs
            .filter((hub) => hub.role === 'HUB')
            .sort((a, b) => a.sequence - b.sequence);

        // NOTE: 행사장행 예약 내역은 정류장을 우선으로 묶고, 이름 가나다 순으로 정렬
        const targetReservations = reservations
          .filter(
            (reservation) =>
              reservation.type === 'TO_DESTINATION' ||
              reservation.type === 'ROUND_TRIP',
          )
          .sort((a, b) => {
            const aDesiredHubAddress = a.metadata?.desiredHubAddress || '';
            const bDesiredHubAddress = b.metadata?.desiredHubAddress || '';
            const aName = a.userName || a.userNickname;
            const bName = b.userName || b.userNickname;
            return (
              aName.localeCompare(bName) ||
              aDesiredHubAddress.localeCompare(bDesiredHubAddress) ||
              a.createdAt.localeCompare(b.createdAt)
            );
          });

        if (targetReservations.length > 0) {
          const shuttleRouteHubsCount = toDestinationShuttleRouteHubs.map(
            (hub) =>
              targetReservations
                .filter(
                  (reservation) =>
                    reservation.toDestinationShuttleRouteHubId ===
                    hub.shuttleRouteHubId,
                )
                .reduce(
                  (acc, reservation) => acc + reservation.passengerCount,
                  0,
                ),
          );

          const shuttleRouteHubsWithCount = toDestinationShuttleRouteHubs.map(
            (hub, index) => ({
              shuttleRouteHub: hub,
              count: shuttleRouteHubsCount[index],
            }),
          );

          const totalCount = targetReservations.reduce(
            (acc, reservation) => acc + reservation.passengerCount,
            0,
          );

          result.push({
            type: 'TO_DESTINATION' as const,
            shuttleRouteName: `[행사장행] ${shuttleRoute.name}`,
            shuttleRoute,
            reservations: targetReservations,
            shuttleRouteHubsWithCount,
            totalCount,
          });
        }
      }

      // 귀가행
      if (shuttleRoute.fromDestinationShuttleRouteHubs !== null) {
        const fromDestinationShuttleRouteHubs =
          shuttleRoute.fromDestinationShuttleRouteHubs
            .filter((hub) => hub.role === 'HUB')
            .sort((a, b) => a.sequence - b.sequence);

        // NOTE: 귀가행 예약 내역은 이름 가나다 순으로 정렬
        const targetReservations = reservations
          .filter(
            (reservation) =>
              reservation.type === 'FROM_DESTINATION' ||
              reservation.type === 'ROUND_TRIP',
          )
          .sort((a, b) => {
            const aDesiredHubAddress = a.metadata?.desiredHubAddress || '';
            const bDesiredHubAddress = b.metadata?.desiredHubAddress || '';
            const aName = a.userName || a.userNickname;
            const bName = b.userName || b.userNickname;
            return (
              aName.localeCompare(bName) ||
              aDesiredHubAddress.localeCompare(bDesiredHubAddress) ||
              a.createdAt.localeCompare(b.createdAt)
            );
          });

        if (targetReservations.length > 0) {
          const shuttleRouteHubsCount = fromDestinationShuttleRouteHubs.map(
            (hub) =>
              targetReservations
                .filter(
                  (reservation) =>
                    reservation.fromDestinationShuttleRouteHubId ===
                    hub.shuttleRouteHubId,
                )
                .reduce(
                  (acc, reservation) => acc + reservation.passengerCount,
                  0,
                ),
          );

          const shuttleRouteHubsWithCount = fromDestinationShuttleRouteHubs.map(
            (hub, index) => ({
              shuttleRouteHub: hub,
              count: shuttleRouteHubsCount[index],
            }),
          );

          const totalCount = targetReservations.reduce(
            (acc, reservation) => acc + reservation.passengerCount,
            0,
          );

          result.push({
            type: 'FROM_DESTINATION' as const,
            shuttleRouteName: `[귀가행] ${shuttleRoute.name}`,
            shuttleRoute,
            reservations: targetReservations,
            shuttleRouteHubsWithCount,
            totalCount,
          });
        }
      }
    }

    return result;
  };

  const exportExcel = async () => {
    const shuttleRoutesWithReservations =
      await getShuttleRoutesWithReservations();
    const excelData = await convertToExcelFormat(shuttleRoutesWithReservations);

    const dailyEventDate = dayjs(
      shuttleRoutesWithReservations?.[0]?.shuttleRoute.event.dailyEvents.find(
        (dailyEvent) => dailyEvent.dailyEventId === dailyEventId,
      )?.dailyEventDate,
    )
      .tz('Asia/Seoul')
      .format('MM/DD');

    const workbook = new ExcelJS.Workbook();

    // 첫 번째/두 번째 탭: 전체 탑승객 명단 (행사장행 / 귀가행)
    const buildAllPassengers = (
      tripType: 'TO_DESTINATION' | 'FROM_DESTINATION' | 'ALL',
    ) =>
      excelData
        .filter((routeData) => {
          if (tripType === 'ALL') {
            return true;
          }
          return routeData.type === tripType;
        })
        .flatMap((routeData) =>
          routeData.reservations.map((reservation) => {
            const typeLabel =
              routeData.type === 'TO_DESTINATION' ? '행사장행' : '귀가행';

            return {
              userName: reservation.userName || reservation.userNickname || '',
              userPhoneNumber: reservation.userPhoneNumber,
              passengerCount: reservation.passengerCount,
              routeName: routeData.shuttleRoute.name,
              typeLabel,
              hubName: reservation.metadata?.desiredHubAddress || '',
              createdAt: reservation.createdAt,
            };
          }),
        )
        .sort(
          (a, b) =>
            a.routeName.localeCompare(b.routeName) ||
            a.typeLabel.localeCompare(b.typeLabel) ||
            a.userName.localeCompare(b.userName) ||
            a.createdAt.localeCompare(b.createdAt),
        );

    const createAllPassengersWorksheet = (
      tripType: 'TO_DESTINATION' | 'FROM_DESTINATION' | 'ALL',
    ) => {
      const label =
        tripType === 'ALL'
          ? '전체'
          : tripType === 'TO_DESTINATION'
            ? '행사장행'
            : '귀가행';
      const passengers = buildAllPassengers(tripType);
      const worksheet = workbook.addWorksheet(
        tripType === 'ALL' ? '전체' : `전체 (${label})`,
      );

      // 안내 문구 (첫 번째 행)
      const noticeCell = worksheet.getCell('A1');
      noticeCell.value = '명단과 함께 탑승권을 반드시 확인해주세요.';
      noticeCell.font = {
        color: { argb: 'FFDC2626' },
        bold: true,
        size: 11,
      };
      noticeCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFFFFF' },
      };
      noticeCell.alignment = { horizontal: 'center', vertical: 'middle' };
      noticeCell.border = {
        top: { style: 'medium', color: { argb: 'FFB91C1C' } },
        left: { style: 'medium', color: { argb: 'FFB91C1C' } },
        bottom: { style: 'medium', color: { argb: 'FFB91C1C' } },
        right: { style: 'medium', color: { argb: 'FFB91C1C' } },
      };
      worksheet.mergeCells('A1:G1');

      // 제목 (둘째 행)
      const titleCell = worksheet.getCell('A2');
      titleCell.value = `[${dailyEventDate}] 전체 탑승객 명단 (${label})`;
      titleCell.font = {
        color: { argb: 'FFFFFFFF' },
        bold: true,
        size: 13,
      };
      titleCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF1E3A8A' },
      };
      titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
      titleCell.border = {
        top: { style: 'thick', color: { argb: 'FF1E40A3' } },
        left: { style: 'thick', color: { argb: 'FF1E40A3' } },
        bottom: { style: 'thick', color: { argb: 'FF1E40A3' } },
        right: { style: 'thick', color: { argb: 'FF1E40A3' } },
      };
      worksheet.mergeCells('A2:G2');

      // 헤더 (셋째 행)
      const headers = [
        '확인',
        '이름',
        '전화번호',
        '인원 수',
        '노선명',
        '방향',
        label === '행사장행' ? '희망 탑승지' : '희망 하차지',
      ];
      headers.forEach((header, headerIndex) => {
        const cell = worksheet.getCell(3, headerIndex + 1);
        cell.value = header;
        cell.font = { color: { argb: 'FFFFFFFF' }, bold: true, size: 12 };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF374151' },
        };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.border = {
          top: { style: 'thin', color: { argb: 'FF6B7280' } },
          left: { style: 'thin', color: { argb: 'FF6B7280' } },
          bottom: { style: 'thin', color: { argb: 'FF6B7280' } },
          right: { style: 'thin', color: { argb: 'FF6B7280' } },
        };
      });

      // 데이터 행
      passengers.forEach((p, index) => {
        const rowIndex = index + 4;

        const checkboxCell = worksheet.getCell(rowIndex, 1);
        checkboxCell.value = '☐';
        checkboxCell.alignment = { horizontal: 'center', vertical: 'middle' };
        checkboxCell.font = { size: 14 };
        checkboxCell.border = {
          top: { style: 'thin', color: { argb: 'FFE5E7EB' } },
          left: { style: 'thin', color: { argb: 'FFE5E7EB' } },
          bottom: { style: 'thin', color: { argb: 'FFE5E7EB' } },
          right: { style: 'thin', color: { argb: 'FFE5E7EB' } },
        };

        const nameCell = worksheet.getCell(rowIndex, 2);
        nameCell.value = p.userName;
        nameCell.border = {
          top: { style: 'thin', color: { argb: 'FFE5E7EB' } },
          left: { style: 'thin', color: { argb: 'FFE5E7EB' } },
          bottom: { style: 'thin', color: { argb: 'FFE5E7EB' } },
          right: { style: 'thin', color: { argb: 'FFE5E7EB' } },
        };

        const phoneCell = worksheet.getCell(rowIndex, 3);
        phoneCell.value =
          '010-' +
          p.userPhoneNumber.slice(5, 9) +
          '-' +
          p.userPhoneNumber.slice(9);
        phoneCell.border = {
          top: { style: 'thin', color: { argb: 'FFE5E7EB' } },
          left: { style: 'thin', color: { argb: 'FFE5E7EB' } },
          bottom: { style: 'thin', color: { argb: 'FFE5E7EB' } },
          right: { style: 'thin', color: { argb: 'FFE5E7EB' } },
        };

        const countCell = worksheet.getCell(rowIndex, 4);
        countCell.value = p.passengerCount;
        countCell.alignment = { horizontal: 'center' };
        countCell.border = {
          top: { style: 'thin', color: { argb: 'FFE5E7EB' } },
          left: { style: 'thin', color: { argb: 'FFE5E7EB' } },
          bottom: { style: 'thin', color: { argb: 'FFE5E7EB' } },
          right: { style: 'thin', color: { argb: 'FFE5E7EB' } },
        };

        const routeNameCell = worksheet.getCell(rowIndex, 5);
        routeNameCell.value = p.routeName;
        routeNameCell.border = {
          top: { style: 'thin', color: { argb: 'FFE5E7EB' } },
          left: { style: 'thin', color: { argb: 'FFE5E7EB' } },
          bottom: { style: 'thin', color: { argb: 'FFE5E7EB' } },
          right: { style: 'thin', color: { argb: 'FFE5E7EB' } },
        };

        const typeCell = worksheet.getCell(rowIndex, 6);
        typeCell.value = p.typeLabel;
        typeCell.alignment = { horizontal: 'center' };
        typeCell.border = {
          top: { style: 'thin', color: { argb: 'FFE5E7EB' } },
          left: { style: 'thin', color: { argb: 'FFE5E7EB' } },
          bottom: { style: 'thin', color: { argb: 'FFE5E7EB' } },
          right: { style: 'thin', color: { argb: 'FFE5E7EB' } },
        };

        const hubCell = worksheet.getCell(rowIndex, 7);
        hubCell.value = p.hubName;
        hubCell.alignment = {
          horizontal: 'left',
          vertical: 'top',
          wrapText: true,
        };
        hubCell.border = {
          top: { style: 'thin', color: { argb: 'FFE5E7EB' } },
          left: { style: 'thin', color: { argb: 'FFE5E7EB' } },
          bottom: { style: 'thin', color: { argb: 'FFE5E7EB' } },
          right: { style: 'thin', color: { argb: 'FFE5E7EB' } },
        };
      });

      // 총 인원 표시
      const totalCell = worksheet.getCell(passengers.length + 4, 7);
      const totalCount = passengers.reduce(
        (acc, cur) => acc + (cur.passengerCount || 0),
        0,
      );
      totalCell.value = `총 인원: ${totalCount}명`;
      totalCell.alignment = {
        horizontal: 'left',
        vertical: 'top',
        wrapText: true,
        indent: 1,
      };
      totalCell.font = {
        name: '맑은 고딕',
        size: 11,
        bold: true,
      };
      totalCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFF8F9FA' },
      };
      totalCell.border = {
        top: { style: 'thin', color: { argb: '12121212' } },
        left: { style: 'thin', color: { argb: '12121212' } },
        bottom: { style: 'thin', color: { argb: '12121212' } },
        right: { style: 'thin', color: { argb: '12121212' } },
      };

      worksheet.columns = [
        { width: 8 },
        { width: 15 },
        { width: 20 },
        { width: 8 },
        { width: 30 },
        { width: 10 },
        { width: 40 },
      ];
    };

    // 첫 두 시트로 생성
    createAllPassengersWorksheet('ALL');
    createAllPassengersWorksheet('TO_DESTINATION');
    createAllPassengersWorksheet('FROM_DESTINATION');

    // 각 노선별로 별도의 worksheet 생성
    excelData.forEach((routeData) => {
      const worksheetName = routeData.shuttleRouteName.replace(/[\[\]]/g, '');
      const worksheet = workbook.addWorksheet(`${worksheetName}`);

      // 안내 문구 (첫 번째 행)
      const noticeCell = worksheet.getCell('A1');
      noticeCell.value = '명단과 함께 탑승권을 반드시 확인해주세요.';
      noticeCell.font = {
        color: { argb: 'FFDC2626' },
        bold: true,
        size: 11,
      };
      noticeCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFFFFF' },
      };
      noticeCell.alignment = { horizontal: 'center', vertical: 'middle' };
      noticeCell.border = {
        top: { style: 'medium', color: { argb: 'FFB91C1C' } },
        left: { style: 'medium', color: { argb: 'FFB91C1C' } },
        bottom: { style: 'medium', color: { argb: 'FFB91C1C' } },
        right: { style: 'medium', color: { argb: 'FFB91C1C' } },
      };
      worksheet.mergeCells('A1:E1');

      // 노선 이름 헤더 (진한 파란색 배경, 흰색 글자)
      const routeNameCell = worksheet.getCell('A2');
      routeNameCell.value = `[${dailyEventDate}] ${routeData.shuttleRouteName}`;
      routeNameCell.font = {
        color: { argb: 'FFFFFFFF' },
        bold: true,
        size: 13,
      };
      routeNameCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF1E3A8A' },
      };
      routeNameCell.alignment = { horizontal: 'center', vertical: 'middle' };
      routeNameCell.border = {
        top: { style: 'thick', color: { argb: 'FF1E40A3' } },
        left: { style: 'thick', color: { argb: 'FF1E40A3' } },
        bottom: { style: 'thick', color: { argb: 'FF1E40A3' } },
        right: { style: 'thick', color: { argb: 'FF1E40A3' } },
      };
      worksheet.mergeCells('A2:E2');

      // 열 헤더 (진한 회색 배경, 흰색 글자, 테두리)
      const headers = [
        '확인',
        '이름',
        '전화번호',
        '인원 수',
        routeData.type === 'TO_DESTINATION' ? '탑승지' : '하차지',
      ];
      headers.forEach((header, headerIndex) => {
        const cell = worksheet.getCell(3, headerIndex + 1);
        cell.value = header;
        cell.font = { color: { argb: 'FFFFFFFF' }, bold: true, size: 12 };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF374151' },
        };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.border = {
          top: { style: 'thin', color: { argb: 'FF6B7280' } },
          left: { style: 'thin', color: { argb: 'FF6B7280' } },
          bottom: { style: 'thin', color: { argb: 'FF6B7280' } },
          right: { style: 'thin', color: { argb: 'FF6B7280' } },
        };
      });

      // 예약 내역 데이터 추가
      routeData.reservations.forEach((reservation, reservationIndex) => {
        const rowIndex = reservationIndex + 4; // 헤더 다음 행부터 시작

        // 체크박스 (첫 번째 열)
        const checkboxCell = worksheet.getCell(rowIndex, 1);
        checkboxCell.value = '☐'; // 빈 체크박스 문자
        checkboxCell.alignment = { horizontal: 'center', vertical: 'middle' };
        checkboxCell.font = { size: 14 };
        checkboxCell.border = {
          top: { style: 'thin', color: { argb: 'FFE5E7EB' } },
          left: { style: 'thin', color: { argb: 'FFE5E7EB' } },
          bottom: { style: 'thin', color: { argb: 'FFE5E7EB' } },
          right: { style: 'thin', color: { argb: 'FFE5E7EB' } },
        };

        // 이름
        const nameCell = worksheet.getCell(rowIndex, 2);
        nameCell.value = reservation.userName || reservation.userNickname || '';
        nameCell.border = {
          top: { style: 'thin', color: { argb: 'FFE5E7EB' } },
          left: { style: 'thin', color: { argb: 'FFE5E7EB' } },
          bottom: { style: 'thin', color: { argb: 'FFE5E7EB' } },
          right: { style: 'thin', color: { argb: 'FFE5E7EB' } },
        };

        // 전화번호
        const phoneCell = worksheet.getCell(rowIndex, 3);
        phoneCell.value =
          '010-' +
            reservation.userPhoneNumber.slice(5, 9) +
            '-' +
            reservation.userPhoneNumber.slice(9) || '';
        phoneCell.border = {
          top: { style: 'thin', color: { argb: 'FFE5E7EB' } },
          left: { style: 'thin', color: { argb: 'FFE5E7EB' } },
          bottom: { style: 'thin', color: { argb: 'FFE5E7EB' } },
          right: { style: 'thin', color: { argb: 'FFE5E7EB' } },
        };

        // 인원 수
        const countCell = worksheet.getCell(rowIndex, 4);
        countCell.value = reservation.passengerCount;
        countCell.alignment = { horizontal: 'center' };
        countCell.border = {
          top: { style: 'thin', color: { argb: 'FFE5E7EB' } },
          left: { style: 'thin', color: { argb: 'FFE5E7EB' } },
          bottom: { style: 'thin', color: { argb: 'FFE5E7EB' } },
          right: { style: 'thin', color: { argb: 'FFE5E7EB' } },
        };

        // 탑승지/하차지 + 정류장별 현황
        const hubCell = worksheet.getCell(rowIndex, 5);
        hubCell.value = reservation.metadata?.desiredHubAddress || '';
        hubCell.alignment = {
          horizontal: 'left',
          vertical: 'top',
          wrapText: true,
        };
        hubCell.border = {
          top: { style: 'thin', color: { argb: 'FFE5E7EB' } },
          left: { style: 'thin', color: { argb: 'FFE5E7EB' } },
          bottom: { style: 'thin', color: { argb: 'FFE5E7EB' } },
          right: { style: 'thin', color: { argb: 'FFE5E7EB' } },
        };
      });

      // 마지막 열에 총 인원 수와 정류장별 현황 추가
      const lastCell = worksheet.getCell(routeData.reservations.length + 4, 5);
      const totalCountText = `총 인원: ${routeData.totalCount}명`;
      lastCell.value = totalCountText;
      lastCell.alignment = {
        horizontal: 'left',
        vertical: 'top',
        wrapText: true,
        indent: 1,
      };
      lastCell.font = {
        name: '맑은 고딕',
        size: 11,
        bold: true,
      };
      lastCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFF8F9FA' },
      };
      lastCell.border = {
        top: { style: 'thin', color: { argb: '12121212' } },
        left: { style: 'thin', color: { argb: '12121212' } },
        bottom: { style: 'thin', color: { argb: '12121212' } },
        right: { style: 'thin', color: { argb: '12121212' } },
      };

      worksheet.columns = [
        { width: 8 }, // 체크박스
        { width: 15 }, // 이름
        { width: 20 }, // 전화번호
        { width: 8 }, // 인원 수
        { width: 50 }, // 희망 탑승지/하차지
      ];
    });

    // 브라우저에서 Excel 파일 다운로드
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const eventName =
      shuttleRoutesWithReservations?.[0].shuttleRoute.event.eventName || '';
    const formattedDailyEventDate = dailyEventDate.replace('/', '_');
    link.download = `${eventName}_${formattedDailyEventDate}_핸디팟_명단.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    return excelData;
  };

  return {
    exportExcel,
  };
};

export default useExportHandyPartyPassengerList;
