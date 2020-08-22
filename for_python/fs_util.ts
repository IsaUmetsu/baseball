import * as fs from "fs";

export const checkDir = async(
    prevPath: string, date_string: string, game_no: string
  ): Promise<string> => {
    const path_date = `${prevPath}/${date_string}`;
    const path_file = `${prevPath}/${date_string}/${game_no}`;
  
    let path = "";
    // 日付ディレクトリ、ゲーム番号ディレクトリを確認
    if (fs.existsSync(path_date) && fs.existsSync(path_file)) {
      path = `${prevPath}/${date_string}/${game_no}`;
    }
    
    return path;
  }

export const getJson = (filePath: string): string => {
    return fs.readFileSync(filePath, 'utf8')
}

export const countFiles = async (dir: string): Promise<number> => {
    const fileCnt = await fs.promises.readdir(dir);

    return fileCnt.length;
}