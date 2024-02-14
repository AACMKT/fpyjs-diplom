/**
 * Класс VK
 * Управляет изображениями из VK. С помощью VK API.
 * С помощью этого класса будет выполняться загрузка изображений из vk.
 * Имеет свойства ACCESS_TOKEN и lastCallback
 * */

const photoSizes = {'s': 0, 'm': 1, 'x': 2, 'o': 3, 'p': 4, 'q': 5, 'r': 6, 'y': 7, 'z': 8, 'w': 9};

class VK {
  static ACCESS_TOKEN = localStorage.getItem('VkToken');
  static id;
  
  /**
   * Получает изображения
   * */
  static get(id = '', callback){
    this.lastCallback = callback;
    let script = document.createElement('script');
    let apiRequest = "https://api.vk.com/method/photos.get?v=5.199";
    let ownerId = `&owner_id=${id}`;
    let apiCallback = '&callback=VK.processData';
    let token = `&access_token=${this.ACCESS_TOKEN}`;
    let albumId = "&album_id=profile";
    script.type = "text/javascript";
    script.id = 'script';
    script.src = String(apiRequest + token + ownerId + albumId + apiCallback);
    document.getElementsByTagName("head")[0].appendChild(script);
  }

  /**
   * Передаётся в запрос VK API для обработки ответа.
   * Является обработчиком ответа от сервера.
   */
  static processData(result){
    document.getElementById('script').remove();
    let imagesArr = [];
    if (result.error){
      if (result.error.error_code == '5' || result.error.error_code == '1116') {
        alert("Некорректный токен!");
        localStorage.removeItem('VkToken');
        App.getToken('VkToken');
      }
      else {
        alert(result.error.error_msg);
      }
      
    }

    else if (result.response.items.length == 0) {
      alert('No photos found')
    }

    else{
      result.response.items.forEach(item => {item.sizes.sort((a, b) => (photoSizes[a.type] - photoSizes[b.type])); 
      if (item.sizes.at(-1).url){
        imagesArr.push(item.sizes.at(-1).url)
        this.id = result.response.items[0].owner_id
      }});
      this.lastCallback(imagesArr);
      this.lastCallback = () => {};
    };
  };
}
