export interface AreaPolygonStyle {
  color: string;
  dashArray?: string;
}

const ACTIVE_COLOR = '#22c55e';
const INACTIVE_COLOR = '#9ca3af';
const INACTIVE_DASH_ARRAY = '6 4';

export function areaPolygonStyle(active: boolean): AreaPolygonStyle {
  return active ? { color: ACTIVE_COLOR } : { color: INACTIVE_COLOR, dashArray: INACTIVE_DASH_ARRAY };
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const INACTIVE_BADGE_HTML =
  '<span style="display:inline-block;margin-left:4px;padding:1px 5px;border-radius:9999px;background:#e5e7eb;color:#374151;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.02em;">Inativo</span>';

export function areaLabelHtml(name: string, active: boolean): string {
  const safeName = escapeHtml(name);
  const badge = active ? '' : INACTIVE_BADGE_HTML;
  return `<span style="display:inline-flex;align-items:center;padding:2px 6px;border-radius:4px;background:rgba(255,255,255,0.9);color:#111827;font-size:11px;font-weight:600;white-space:nowrap;box-shadow:0 1px 3px rgba(0,0,0,0.3);">${safeName}${badge}</span>`;
}
