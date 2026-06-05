import server from '../dist/server/index.js';

export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  // Pass the request to the built SSR fetch handler
  return server.fetch(request, process.env, {
    waitUntil: () => {},
    passThroughOnException: () => {}
  });
}
