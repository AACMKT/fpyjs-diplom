class AuthModal extends BaseModal {
    constructor( element ) {
      super (element);
      this.modal = this.elementDOM;
      this.registerEvents();
    }
    registerEvents(){
        this.modal.querySelector('.header .icon').onclick = () => this.close();
        this.modal.querySelector('.actions .close').onclick = () => this.close();
    }

    checkTokens () {
        this.modal.querySelector(".auth-body").innerHTML = "";
        let validator = [
            [localStorage.getItem('yandexToken'), 'Yandex-токен', 'yandexToken', 'https://yandex.ru/dev/disk/poligon/'], 
            [localStorage.getItem('VkToken'), 'VK-токен', 'VkToken', 'https://dev.vk.com/ru/api/access-token/getting-started']
            ];
        validator.forEach(el => {
            if (!el[0]) {
                this.tokenInputForm(el[1], el[2], el[3]);
                this.modal.querySelector(`#${el[2]}-input`).oninput = () => {
                    this.modal.querySelector(`[data-host="${el[2]}"]`).classList.remove('pressed');
                    this.modal.querySelector(`[data-host="${el[2]}"]`).classList.remove('disabled');
                };
                this.modal.querySelector(`[data-host="${el[2]}"]`).onclick = () => {
                    let input = this.modal.querySelector(`#${el[2]}-input`);
                    localStorage.setItem(el[2], input.value.trim());
                    this.modal.querySelector(`[data-host="${el[2]}"]`).classList.add('pressed');
                };
            };
        });
    };

    tokenInputForm(text, data, auth_guide_link) {
        let linkWrapper = document.createElement('div');
        linkWrapper.classList.add("auth-href");
        let link = document.createElement('a');
        link.href = auth_guide_link;
        link.target="_blank";
        link.textContent = `Как получить ${text}?`
        linkWrapper.appendChild(link);
        let inputWrapper = document.createElement('div');
        inputWrapper.classList.add('ui', 'fluid', 'action', 'input');
        let input = document.createElement('input');
        input.type = "text";
        input.value = "";
        input.placeholder = `${text}...`;
        input.setAttribute('id', `${data}-input`);
        let button = document.createElement('div');
        button.classList.add('ui', 'button');
        button.dataset.host = `${data}`;
        console.log(button);
        button.innerHTML = 'ОК';
        button.classList.add('disabled');
        inputWrapper.appendChild(input);
        inputWrapper.appendChild(button);
        this.modal.querySelector(".auth-body").appendChild(linkWrapper);
        this.modal.querySelector(".auth-body").appendChild(inputWrapper);
    }

}