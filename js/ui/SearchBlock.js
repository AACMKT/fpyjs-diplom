/**
 * Класс SearchBlock
 * Используется для взаимодействием со строкой ввода и поиска изображений
 * */
class SearchBlock {
  constructor( element ) {
    this.element = element;
    this.registerEvents();
  }

  /**
   * Выполняет подписку на кнопки "Заменить" и "Добавить"
   * Клик по кнопкам выполняет запрос на получение изображений и отрисовывает их,
   * только клик по кнопке "Заменить" перед отрисовкой очищает все отрисованные ранее изображения
   */
  registerEvents(){
    this.element.addEventListener('click', (e) =>{
      if (this.element.querySelector('input').value) {
        let userId = this.element.querySelector('input').value.trim();
        if (e.target.classList.contains('replace')){
          VK.ACCESS_TOKEN = localStorage.getItem('VkToken'); 
          App.imageViewer.clear();
          VK.get(userId, App.imageViewer.drawImages);
          document.querySelector('.column .image').src = "https://yugcleaning.ru/wp-content/themes/consultix/images/no-image-found-360x250.png";
        }
        if (e.target.classList.contains('add')){
          VK.ACCESS_TOKEN = localStorage.getItem('VkToken');
          document.querySelector('.replace').classList.remove('disabled')
          if (userId != VK.id){
            VK.get(userId, App.imageViewer.drawImages);
          }
        }
       
      }
      else {
        if (e.target.classList.contains('add') || e.target.classList.contains('replace')) {
          alert('Enter user-id first');
        }
        
      }
    }
    )
  }

}