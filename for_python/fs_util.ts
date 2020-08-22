import * as fs from "fs";

/**
 * 
 */
export const checkGameDir = async(
  basePath: string, date_string: string, game_no: string
): Promise<boolean> => {
  const existDateDir = await checkDateDir(basePath, date_string);
  const path_file = `${basePath}/${date_string}/${game_no}`;
  
  return existDateDir && fs.existsSync(path_file);
}

/**
 * 
 */
export const checkDateDir = async(
  basePath: string, date_string: string
): Promise<boolean> => {
  const path_date = `${basePath}/${date_string}`;
  return fs.existsSync(path_date);
}

/**
 * 
 */
export const getJson = (filePath: string): string => {
    return fs.readFileSync(filePath, 'utf8')
}

/**
 * 
 */
export const countFiles = async (dir: string): Promise<number> => {
    const fileCnt = await fs.promises.readdir(dir);

    return fileCnt.length;
}