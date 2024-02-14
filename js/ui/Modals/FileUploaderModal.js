/**
 * Класс FileUploaderModal
 * Используется как всплывающее окно для загрузки изображений
 */
class FileUploaderModal extends BaseModal {
  constructor( element ) {
    super (element);
    this.modal = this.elementDOM;
    this.registerEvents();
  }

  /**
   * Добавляет следующие обработчики событий:
   * 1. Клик по крестику на всплывающем окне, закрывает его
   * 2. Клик по кнопке "Закрыть" на всплывающем окне, закрывает его
   * 3. Клик по кнопке "Отправить все файлы" на всплывающем окне, вызывает метод sendAllImages
   * 4. Клик по кнопке загрузке по контроллерам изображения: 
   * убирает ошибку, если клик был по полю вода
   * отправляет одно изображение, если клик был по кнопке отправки
   */
  registerEvents(){
    this.modal.querySelector('.header .icon').onclick = () => this.close();
    this.modal.querySelector('.actions .close.button').onclick = () => this.close();
    this.modal.querySelector('.actions .send-all.button').onclick = () => this.sendAllImages();
    this.modal.querySelector('.content').addEventListener('click', (e) => {
      if (e.target.parentElement.classList.contains('input') && e.target.tagName.toLowerCase() === 'input') {
        e.target.parentElement.classList.remove('error');
      }
      if (e.target.closest('.button')) {
        let imageContainer = e.target.closest('.image-preview-container');
        this.sendImage(imageContainer);
      }
    })
  }

  /**
   * Отображает все полученные изображения в теле всплывающего окна
   */
  showImages(images) {
    images.reverse();
    let ImageHTMLArray = [];
    images.forEach(src => ImageHTMLArray.push(this.getImageHTML(src)));
    this.modal.querySelector('.content').innerHTML = ImageHTMLArray.join('');
    let defaultFileName = Array.from(this.modal.querySelectorAll('input'));
    let counter = 0;
    defaultFileName.forEach(input => input.value = `VK_${Date.now()}_${ counter ++ }.jpg`)
  }

  /**
   * Формирует HTML разметку с изображением, полем ввода для имени файла и кнопкной загрузки
   */
  getImageHTML(item) {
    return `
    <div class="image-preview-container">
      <img src=${item} />
      <div class="ui action input">
        <input type="text" placeholder="Путь к файлу">
        <button class="ui button"><i class="upload icon"></i></button>
      </div>
    </div>`
  }

  /**
   * Отправляет все изображения в облако
   */
  sendAllImages() {
    const imgContainers = Array.from(this.modal.querySelectorAll('.image-preview-container'));
    imgContainers.forEach(imageContainer => setTimeout(() => this.sendImage(imageContainer), 500));
  }

  checkExtension(fileName) {
    const regex = /\.(?:jp(?:e?g|e|2)|gif|png|tiff?|bmp|ico)$/i;
    let extension = fileName.slice(fileName.lastIndexOf('.'));
    return regex.test(extension);
  }

  /**
   * Валидирует изображение и отправляет его на сервер
   */
  sendImage(imageContainer) {
    let fileName = imageContainer.querySelector('input').value;
    if (!this.checkExtension(fileName)){
      fileName += ".jpg";
    }
    const inputFieldContainer = imageContainer.querySelector('.ui, .action, .input');
    if (!fileName) {
      inputFieldContainer.classList.add('error');
      console.log('error')
    }
    else {
      inputFieldContainer.classList.add('disabled');
      const url = imageContainer.querySelector('img').src;
      Yandex.uploadFile(fileName, url, () => {imageContainer.remove();
        setTimeout(() =>
        {if (this.modal.querySelector('.content').children.length == 0) {
          this.close();
          }}, 500)
      })
    }   
  }
}