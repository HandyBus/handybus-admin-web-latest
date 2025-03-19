import { z } from 'zod';
import {
  FutureRouteSchema,
  FutureRouteSchemaType,
} from '@/types/kakaomoblity.type';
import { silentParse } from '@/utils/parse.util';

const REST_API_KEY = process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY;
const BASE_URL = 'https://apis-navi.kakaomobility.com/v1/future/directions';

// api docs : https://developers.kakaomobility.com/docs/navi-api/future/

interface Props {
  departureTime: string; // YYYYMMDDHHMM 형식,
  origin: string; // x,y or x,y,name or x,y,angle
  waypoints?: string; // max 5, under 1,500km, each waypoint has x,y,name or x,y with | or %7C
  destination: string; // x,y,name or x,y
  priority?: string; // RECOMMEND, TIME, DISTANCE, (default: RECOMMEND)
  roadevent?: number; // 교통사고 등 도로 통제 정보 반영 옵션 (default: 0 모두반영)
  road_details?: boolean; // 도로 상세 정보 제공여부 (default: false)
  car_type?: number; // 차종 (default: 1)
  summary?: boolean; // 경로 요약 정보 제공여부 (default: true)
  avoid?: string; // ferries, toll, motorway, schoolzone, uturn , default: none
  alternatives?: boolean; // 대안경로 제공여부 (default: false)
  car_fuel?: string; // 연료종류 (default: GASOLINE)
  car_hipass?: boolean; // 하이패스 여부 (default: false)
}

export const getEstimatedRoute = async ({
  departureTime,
  origin,
  waypoints,
  destination,
  priority = 'RECOMMEND',
  roadevent,
  road_details,
  car_type = 3, // 고속버스 이므로 대형
  summary = true,
}: Props): Promise<FutureRouteSchemaType> => {
  const url = new URL(BASE_URL);
  url.searchParams.append('origin', origin);
  url.searchParams.append('destination', destination);
  url.searchParams.append('departure_time', departureTime);

  if (waypoints) url.searchParams.append('waypoints', waypoints);
  if (priority) url.searchParams.append('priority', priority);
  if (roadevent !== undefined)
    url.searchParams.append('roadevent', roadevent.toString());
  if (road_details !== undefined)
    url.searchParams.append('road_details', road_details.toString());
  if (car_type !== undefined)
    url.searchParams.append('car_type', car_type.toString());
  if (summary !== undefined)
    url.searchParams.append('summary', summary.toString());

  const { trans_id, routes } = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      Authorization: `KakaoAK ${REST_API_KEY}`,
      'Content-Type': 'application/json',
    },
  }).then((res) => res.json());

  const ApiResponseOkSchema = <T extends z.ZodRawShape>(rawShape: T) =>
    z
      .object({ ok: z.literal(true), statusCode: z.number() })
      .merge(z.object(rawShape))
      .strict();

  const schema = ApiResponseOkSchema(FutureRouteSchema.shape);

  return silentParse(
    schema,
    {
      ok: true,
      statusCode: routes.result_code,
      errorMsg: routes.result_msg,
      trans_id: trans_id,
      routes: routes,
    },
    {
      useToast: false,
    },
  );
};
