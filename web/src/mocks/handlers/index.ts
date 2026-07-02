import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/api/v2/health', () => {
    return HttpResponse.json({ status: 'ok' });
  }),
];
