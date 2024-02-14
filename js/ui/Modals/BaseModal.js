/**
 * Класс BaseModal
 * Используется как базовый класс всплывающего окна
 */
class BaseModal {
  constructor( element ) {
    this.elementDOM = element[0];
    this.elementSemantic = element;
  }

  /**
   * Открывает всплывающее окно
   */
  open() {
    this.elementSemantic.modal('show');
  }

  /**
   * Закрывает всплывающее окно
   */
  close() {
    this.elementSemantic.modal('hide');
  }
}