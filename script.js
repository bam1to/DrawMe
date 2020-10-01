let
    canv = document.getElementById('canvas'),
    ctx = canv.getContext('2d'),
    isMouseDown = false,
    rad = 10,
    coords = [];

canv.width = window.innerWidth;
canv.height = window.innerHeight;

//code
// проверка нажата ли кнопка мыши
canv.addEventListener('mousedown', () => {
    isMouseDown = true;
});
//проверка не нажата ли кнопка мыши
canv.addEventListener('mouseup', () => {
    isMouseDown = false;
    ctx.beginPath(); //разограничитель линии начнётся здесь
    coords.push('mouseup'); //в координаты записывается когда делается разрыв
});

ctx.lineWidth = rad * 2; //толщина линии
canv.addEventListener('mousemove', (e) => {
    if (isMouseDown) { //если зажата ЛКМ
        coords.push([e.clientX, e.clientY]); //в координаты добавляются координаты по х и у в виде массива
        ctx.lineTo(e.clientX, e.clientY); //прокладывается линиия к этим координатам
        ctx.stroke(); //непосредственно отрисовка линии

        ctx.beginPath(); //начало отрисовки
        ctx.arc(e.clientX, e.clientY, rad, 0, Math.PI * 2); //чертится круг (координаты х, у, радиус, точка начала, окружность)
        ctx.fill(); //команда отвечающая за заполнение цветом

        ctx.beginPath(); //начало отрисовки
        ctx.moveTo(e.clientX, e.clientY); //передвижение к позиции на которой находится мышка 
    }

});

function save() {
    localStorage.setItem('coords', JSON.stringify(coords)); //сохранение в локальныое зранилище(?) координат и js код преобразованый в json
}

function clear() {
    ctx.clearRect(0, 0, canv.width, canv.height);
}

function replay() {
    let //объявляется таймер с интервалом 30 мс, каждые 30мс происходит:
        timer = setInterval(() => {
            if (!coords.length) { //проверка на существование координат в массиве
                clearInterval(timer); //очистка таймера
                ctx.beginPath(); //начало новой линии
                return;
            }
            let
                crd = coords.shift(), //из координат "вырывается" первое значение и записывается в переменную
                e = {
                    clientX: crd["0"], //расстояние от левого края по х берется из массива нулевого
                    clientY: crd["1"] //расстояние от верхнего края по у берется из массива первого
                };

            ctx.lineTo(e.clientX, e.clientY); //всё то же самое что и сверху
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(e.clientX, e.clientY, rad, 0, Math.PI * 2);
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo(e.clientX, e.clientY);
        }, 30);
        ctx.beginPath();
}


document.addEventListener('keydown', (e) => {

    if (e.keyCode == 83) {
        //save
        save();
        console.log('Saved');
    }

    if (e.keyCode == 82) {
        //replay
        console.log('Replayin...');
        coords = JSON.parse(localStorage.getItem('coords')); //координаты достаются из json документа и преобразуются в js код
        clear();
        replay();
        
    }

    if (e.keyCode == 67) {
        //clear
        clear();
        console.log('Cleared');

    }

});