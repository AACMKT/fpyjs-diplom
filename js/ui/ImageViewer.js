/**
 * Класс ImageViewer
 * Используется для взаимодействием блоком изображений
 * */
class ImageViewer {
  constructor( element ) {
    this.element = element;
    this.imgPreviewer = this.element.querySelector('.image');
    this.imgList = this.element.querySelector('.images-list');
    this.selectAll = this.element.querySelector('.images-list .row .select-all');
    this.send = this.element.querySelector('.images-list .row .send');
    this.preview = this.element.querySelector('.images-list .row .show-uploaded-files');
    this.registerEvents();
  }

  /**
   * Добавляет следующие обработчики событий:
   * 1. Клик по изображению меняет класс активности у изображения
   * 2. Двойной клик по изображению отображает изображаения в блоке предпросмотра
   * 3. Клик по кнопке выделения всех изображений проверяет у всех ли изображений есть класс активности?
   * Добавляет или удаляет класс активности у всех изображений
   * 4. Клик по кнопке "Посмотреть загруженные файлы" открывает всплывающее окно просмотра загруженных файлов
   * 5. Клик по кнопке "Отправить на диск" открывает всплывающее окно для загрузки файлов
   */
  registerEvents(){
    this.imgList.addEventListener("dblclick", (e) => {
      if (e.target.tagName.toLowerCase() == 'img') {
        this.imgPreviewer.src = e.target.src;
      }
    });

    this.imgList.addEventListener("click", (e) => {
      if (e.target.tagName.toLowerCase() == 'img') {
        e.target.classList.toggle('selected');
        this.checkButtonText();
      };
    });

    this.selectAll.addEventListener("click", ()=>
    {
      const imgArray = Array.from(this.imgList.querySelectorAll('img'));
      imgArray.every(img => img.classList.contains('selected')) ? imgArray.forEach(img => img.classList.remove('selected')) : imgArray.forEach(img => img.classList.add('selected'));
      this.checkButtonText();
    });

    this.send.addEventListener("click", ()=>
    {
      let modalSendImg = App.getModal('fileUploader');
      let selectedImg = (Array.from(this.imgList.querySelectorAll('img')).filter(img => img.classList.contains('selected')));
      modalSendImg.showImages(selectedImg.map(img => img.src));
      selectedImg.forEach(img => img.classList.remove('selected'));
      this.selectAll.innerHTML = 'Выбрать всё';
      this.send.classList.add('disabled');
      modalSendImg.open();
    });

    this.preview.addEventListener("click", () =>
    { Yandex.auth = `OAuth ${localStorage.getItem('yandexToken')}`;
      if (!localStorage.getItem('yandexToken')) {
        alert("Не найден токен!");
        App.getToken('yandexToken');
      }
      else {
        Yandex.checkAuth(callback =>{
          if (JSON.parse(callback).error == 'UnauthorizedError') {
            alert("Некорректный токен!");
            localStorage.removeItem('yandexToken');
            App.getToken('yandexToken');
          }
          else {
            const modalPrevew = App.getModal('filePreviewer');
            modalPrevew.open();
            Yandex.getUploadedFiles(callback => modalPrevew.showImages(JSON.parse(callback)));
          }
        });
      };
    });
  }

  /**
   * Очищает отрисованные изображения
   */
  clear() {
    const parent = document.querySelector('.images-list .grid .row');
    while (parent.firstChild) {
      parent.firstChild.remove()
  }

  }

  /**
   * Отрисовывает изображения.
  */
  drawImages(images) {
    const selectBtn = document.querySelector('.images-list .row .select-all')
    function urlExists(url) {
      try {
        const http = new XMLHttpRequest();
        http.open('HEAD', url, false);
        http.send();
        console.log(http.status)
        return http.status != 404;
      }
      catch(err) {
        return false;
      }
    };
    if (images.length > 0) {
      selectBtn.classList.remove('disabled');
      images.forEach(url => {
        if (urlExists(url)) {
        const div = document.createElement('div');
        div.classList.add('four', 'wide', 'column', 'ui', 'medium', 'image-wrapper');
        const img = document.createElement('img');
        img.src = url;
        div.appendChild(img);
        document.querySelector('.images-list .grid .row').append(div);
      }
      })
    }
    else {
      selectBtn.classList.add('disabled');
    }
    

  }

  /**
   * Контроллирует кнопки выделения всех изображений и отправки изображений на диск
   */
  checkButtonText() {
    const imgArray = Array.from(this.imgList.querySelectorAll('img'));
    let selectionTriggerAll = imgArray.every(img => img.classList.contains('selected'));
    let selectionTriggerAny = imgArray.some(img => img.classList.contains('selected'));
    const send = this.imgList.querySelector('.send');
    selectionTriggerAll ? this.selectAll.innerHTML = 'Снять выделение': this.selectAll.innerHTML = 'Выбрать всё';
    if (selectionTriggerAny) {
      send.classList.remove('disabled');
    }
    else {
      send.classList.add('disabled');
    }
  }

}

