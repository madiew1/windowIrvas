import checkNumInputs from './checkNumInputs';

const forms = (state) => {
    const form = document.querySelectorAll('form'),
          inputs = document.querySelectorAll('input'),
          btns = document.querySelectorAll('.button');

    checkNumInputs('input[name="user_phone"]');      
    
    const message = {
        loading: 'Loading...',
        success: 'Thanks! Soon we contact with you',
        failure: 'Something went wrong...'
    };

    const postData = async (url, data) => {
        document.querySelector('.status').textContent = message.loading;
        let res = await fetch(url, {
            method: "POST",
            body: data
        });

        return await res.text()
    };

    const clearInputs = () => {
        inputs.forEach (item => {
            item.value = '';
        });
    }

    function checkInputs() {
        let allFilled = false;

        inputs.forEach(input => {
            if (!input.value.trim() === '') {
                allFilled = true;
            }
        });

        // Если все инпуты заполнены, активируем кнопку, иначе отключаем
        btns.disabled = !allFilled;
    }

    inputs.forEach(input => {
        input.addEventListener('input', checkInputs);
    });


    form.forEach(item => {
        item.addEventListener('submit', (e) => {
            e.preventDefault();

            let statusMessage = document.createElement('div');
            statusMessage.classList.add('status');
            item.appendChild(statusMessage);

            const formData = new FormData(item);
            if(item.getAttribute('data-calc') === "end") {
                for(let key in state) {
                    formData.append(key, state[key]);
                }
            }

            postData('assets/server.php', formData)
                .then(res => {
                    console.log(res);
                    statusMessage.textContent = message.success;
                })
                .catch (() => statusMessage.textContent = message.failure)
                .finally(() => {
                    clearInputs();
                    setTimeout(() => {
                        statusMessage.remove();
                    }, 5000);
                })
        });
    })
}

export default forms;