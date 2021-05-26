import debug from 'debug';
import { app, server } from './app';

const debugLog: debug.IDebugger = debug('app');
const port = process.env.PORT || 3000;

server.listen(port, () => {
  debugLog(`Server running at http://localhost:${port}`);
});


