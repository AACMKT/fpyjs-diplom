/**
 * Класс PreviewModal
 * Используется как обозреватель загруженный файлов в облако
 */
class PreviewModal extends BaseModal {
  constructor( element ) {
    super (element);
    this.modal = this.elementDOM;
    this.registerEvents();
  }

  /**
   * Добавляет следующие обработчики событий:
   * 1. Клик по крестику на всплывающем окне, закрывает его
   * 2. Клик по контроллерам изображения: 
   * Отправляет запрос на удаление изображения, если клик был на кнопке delete
   * Скачивает изображение, если клик был на кнопке download
   */
  registerEvents() {
    this.modal.querySelector('.header .icon').onclick = () => this.close();
    this.modal.addEventListener('click', (e) => {
      if (e.target.classList.contains('delete')) {
        e.target.querySelector('i').classList.add('icon', 'spinner', 'loading');
        e.target.classList.add('disabled');
        console.log(e.target);
        Yandex.removeFile(e.target.dataset.path, response => {
          if (!response){
            e.target.closest('.image-preview-container').remove();
          }
          else {
            e.target.querySelector('i').classList.remove('icon', 'spinner', 'loading');
            e.target.classList.remove('disabled');
            alert("Something went wrong. Please try again later")
          };
        })
      };
      if (e.target.classList.contains('download')) {
        const url = e.target.closest('.download').dataset.file;
        Yandex.downloadFileByUrl(url);
        e.target.classList.add('disabled');
      };
    })
  }


  /**
   * Отрисовывает изображения в блоке всплывающего окна
   */
  showImages(data) {
    let filtredData = data.items
    filtredData.reverse();
    let ImageHTMLArray = [];
    filtredData.forEach(src => ImageHTMLArray.push(this.getImageInfo(src)));
    this.modal.querySelector('.content').innerHTML = ImageHTMLArray.join('');
  }

  /**
   * Форматирует дату в формате 2021-12-30T20:40:02+00:00(строка)
   * в формат «30 декабря 2021 г. в 23:40» (учитывая временной пояс)
   * */
  formatDate(date) {
    return new Intl.DateTimeFormat('ru', {
      dateStyle: 'long',
      timeStyle: 'short',
      timeZone: 'Europe/Moscow',
    }).format(new Date(date));
  }

  /**
   * Возвращает разметку из изображения, таблицы с описанием данных изображения и кнопок контроллеров (удаления и скачивания)
   */
  getImageInfo(item) {
    return `
    <div class="image-preview-container">
      <img src=${item.preview} />
      <table class="ui celled table">
      <thead>
        <tr><th>Имя</th><th>Создано</th><th>Размер</th></tr>
      </thead>
      <tbody>
        <tr><td>${item.name}</td><td>${this.formatDate(item.created)}</td><td>${item.size} Кб</td></tr>
      </tbody>
      </table>
      <div class="buttons-wrapper">
        <button class="ui labeled icon red basic button delete" data-path='${item.path}'>
          Удалить
          <i class="trash icon"></i>
        </button>
        <button class="ui labeled icon violet basic button download" data-file=${item.file}>
          Скачать
          <i class="download icon"></i>
        </button>
      </div>
    </div>`;
  }
}
