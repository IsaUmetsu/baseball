import { createConnection } from 'typeorm';
import { executeUpdatePlusOutCount } from './db_util';

// Execute
(async () => {
  await createConnection('default');
  await executeUpdatePlusOutCount();
})();
