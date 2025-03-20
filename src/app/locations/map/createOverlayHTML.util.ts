export const createOverlayHTML = (title: string, subtitle?: string) => {
  return `
    <div style="
      background: white; 
      padding: 8px 12px;
      border-radius: 8px; 
      box-shadow: 0 2px 6px rgba(0,0,0,0.2);
      font-size: 13px;
      font-weight: bold;
      text-align: center;
      position: relative;
      bottom: 95px;
      white-space: nowrap;
    ">${title}${subtitle ? `<br/>(${subtitle})` : ''}</div>
  `;
};
