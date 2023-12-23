const dropdownList = document.querySelectorAll('.custom-select');

dropdownList.forEach((dropdown) => {
    const dropdownButton = dropdown.querySelector('.dropdown__button');
    const dropdownList = dropdown.querySelector('.dropdown-list');
    const dropdownItems = dropdownList.querySelectorAll('.dropdown-list-item');
    const input = dropdown.querySelector('.dropdown-input');

    function clickButton (evt) {
        evt.preventDefault();
        dropdownList.classList.toggle('hidden');
        dropdownButton.classList.toggle('dropdown-list__opened');
        document.addEventListener('click', clickOutsideDropdown);
        document.addEventListener('keydown', keyDown);
    }

    dropdownButton.addEventListener('click', clickButton);

    function clickItem () {
        dropdownButton.innerText = this.innerText;
        input.value = this.dataset.value;
        closeDropdown();
    }

    dropdownItems.forEach(function (item) {
        item.addEventListener('click', clickItem)
    });

    function closeDropdown () {
        dropdownList.classList.add('hidden');
        dropdownButton.classList.remove('dropdown-list__opened');
        document.removeEventListener('click', clickOutsideDropdown);
        document.removeEventListener('keydown', keyDown);
    }

    function clickOutsideDropdown (evt) {
        const click = evt.composedPath();
    
        if (!click.includes(dropdownButton) && !dropdownList.classList.contains('hidden')) {
            closeDropdown();
        }
    }

    function keyDown (evt) {
        if (evt.key === 'Tab' || evt.key === 'Escape') {
            closeDropdown();
        }
    }
});