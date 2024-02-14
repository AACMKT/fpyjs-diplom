/**
 * Класс Yandex
 * Используется для управления облаком.
 * Имеет свойство HOST
 * */
class Yandex {
  static HOST = 'https://cloud-api.yandex.net/v1/disk';
  static auth = `OAuth ${localStorage.getItem('yandexToken')}`;

  /**
   * Метод формирования и сохранения токена для Yandex API
   */

  /**
   * Метод загрузки файла из облака
   */
  static uploadFile(path, url, callback){
    const options = {
      url: String(this.HOST + '/resources/upload'),
      method: 'POST',
      auth: this.auth,
      data: {
        path: path,
        url: url,
      },
      callback: callback,
    };
    createRequest(options);
  }

  /**
   * Метод удаления файла из облака
   */
  static removeFile(path, callback){
    const options = {
      url: String(this.HOST + '/resources'),
      method: 'DELETE',
      auth: this.auth,
      data: {
        path: path,
      },
      callback: callback,
    };
    createRequest(options);
  }

  /**
   * Метод получения всех загруженных файлов в облаке
   */
  static getUploadedFiles(callback){
    const options = {
      url: String(this.HOST + '/resources/files'),
      method: 'GET',
      auth: this.auth,
      data: {
        media_type: "image",
        //preview_size: "200x150",
        limit: 50,
      },
      callback: callback,
    };
    createRequest(options);
    
  }

  /**
   * Метод скачивания файлов
   */
  static downloadFileByUrl(url){
    const link = document.createElement('a');
    link.href = url;
    link.click()
  };

  static checkAuth(callback){
    const options = {
      url: this.HOST,
      method: 'GET',
      auth: this.auth,
      callback: callback,
    };
    
    createRequest(options);
  }
}
