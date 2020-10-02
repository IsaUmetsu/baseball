import { createConnection } from 'typeorm';
import { executeUpdatePlusOutCount } from './util/db';

// Execute
(async () => {
  await createConnection('default');
  await executeUpdatePlusOutCount();
})();
