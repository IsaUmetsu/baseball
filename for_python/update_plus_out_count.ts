import { AppDataSource } from './util/datasource';
import { executeUpdatePlusOutCount } from './util/db';

// Execute
(async () => {
  await AppDataSource.initialize();
  await executeUpdatePlusOutCount();
})();
