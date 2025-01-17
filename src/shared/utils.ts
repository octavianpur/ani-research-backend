import { Response } from 'express';


/**
 * @param {Number} value
 * @param {Number} width
 * @return {String}
 */
export function padValue(value: number, width: number): string {
  const val = Math.abs(value);
  const zeros = Math.max(0, width - Math.floor(val).toString().length);
  const zeroString = Math.pow(10, zeros).toString().substr(1);
  return zeroString + value;
}

export const renderView = (res: Response, viewPath: string, viewData: any): Promise<string> => {
  return new Promise((resolve, reject) => {
    res.render(viewPath, viewData, (error, html) => {
      if (error) {
        reject(error);
      } else {
        resolve(html);
      }
    });
  });
};

const notHttpError = (error: any, key: string): boolean => {
  return key !== 'request' && key !== 'response' && key !== 'options' && key !== 'timings';
};

export const hasKey = <O>(obj: O, key: keyof any): key is keyof O => {
  return key in obj;
};

export const parseError = (error: any): any => {
  if (error instanceof Error) {
    return Object.getOwnPropertyNames(error).reduce((all: any, valKey: string) => {
      return {
        ...all,
        [valKey]: (notHttpError(error, valKey) && hasKey(error, valKey)) ? error[valKey] : null
      };
    }, {});
  } else {
    return error;
  }
};

// A helper method used to read a Node.js readable stream into a Buffer
export const streamToBuffer = async (readableStream: NodeJS.ReadableStream): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    readableStream.on('data', (data: Buffer | string) => {
      chunks.push(data instanceof Buffer ? data : Buffer.from(data));
    });
    readableStream.on('end', () => {
      resolve(Buffer.concat(chunks));
    });
    readableStream.on('error', reject);
  });
};
