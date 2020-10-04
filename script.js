let canv = document.getElementById("canvas"),
    pgd = document.querySelector(".playground"),
    ctx = canv.getContext("2d"),
    isMouseDown = false,
    rad = 1,
    color = "black",
    coords = [],
    stat = [];

canv.width = pgd.offsetWidth;
canv.height = pgd.offsetHeight - 100;

//code
// проверка нажата ли кнопка мыши
canv.addEventListener("mousedown", () => {
    isMouseDown = true;
});
//проверка не нажата ли кнопка мыши
canv.addEventListener("mouseup", () => {
    isMouseDown = false;
    ctx.beginPath(); //разограничитель линии начнётся здесь
    coords.push("mouseup"); //в координаты записывается когда делается разрыв
    stat.push("mouseup");
});

function changeRad() {
    let rds = document.querySelector("#line_width").value;
    if (rds == "1") {
        rad = 1;
    } else if (rds == "2") {
        rad = 2;
    } else if (rds == "5") {
        rad = 5;
    } else if (rds == "10") {
        rad = 10;
    } else if (rds == "12") {
        rad = 12;
    } else if (rds == "15") {
        rad = 15;
    } else if (rds == "18") {
        rad = 18;
    } else if (rds == "20") {
        rad = 20;
    }
    ctx.lineWidth = rad * 2;
}

function changeCol() {
    let clr = document.querySelector("#line_color").value;
    if (clr == "black") {
        color = "black";
    } else if (clr == "white") {
        color = "white";
    } else if (clr == "green") {
        color = "green";
    } else if (clr == "yellow") {
        color = "yellow";
    } else if (clr == "red") {
        color = "red";
    } else if (clr == "orange") {
        color = "orange";
    } else if (clr == "blue") {
        color = "blue";
    } else if (clr == "violet") {
        color = "violet";
    }
}

function eraser() {
    let era = document.querySelector('.eraser');
    canv.addEventListener("mousemove", (e) => {
        if (isMouseDown) {
            ctx.fillStyle = 'white';
            ctx.strokeStyle = 'white';
            ctx.lineTo(e.clientX, e.clientY - 100); //прокладывается линиия к этим координатам
            ctx.stroke();

            ctx.beginPath();
            ctx.rect(e.clientX, e.clientY, rad, rad);
            ctx.fillRect();

            ctx.beginPath(); //начало отрисовки
            ctx.moveTo(e.clientX, e.clientY - 100);
        }
    })
}

//толщина линии
canv.addEventListener("mousemove", (e) => {
    if (isMouseDown) {
        //если зажата ЛКМ

        ctx.fillStyle = color;
        ctx.strokeStyle = color;
        stat.push([rad, color]);
        coords.push([e.clientX, e.clientY - 100]); //в координаты добавляются координаты по х и у в виде массива
        ctx.lineTo(e.clientX, e.clientY - 100); //прокладывается линиия к этим координатам
        ctx.stroke(); //непосредственно отрисовка линии

        ctx.beginPath(); //начало отрисовки
        ctx.arc(e.clientX, e.clientY - 100, rad, 0, Math.PI * 2); //чертится круг (координаты х, у, радиус, точка начала, окружность)
        ctx.fill(); //команда отвечающая за заполнение цветом

        ctx.beginPath(); //начало отрисовки
        ctx.moveTo(e.clientX, e.clientY - 100); //передвижение к позиции на которой находится мышка
    }
});

function save() {
    localStorage.setItem("coords", JSON.stringify(coords)); //сохранение в локальныое зранилище(?) координат и js код преобразованый в json
    localStorage.setItem("stat", JSON.stringify(stat));
}

function clear() {
    ctx.clearRect(0, 0, canv.width, canv.height);
}

function replay() {
    let //объявляется таймер с интервалом 30 мс, каждые 30мс происходит:
        timer = setInterval(() => {
            if (!coords.length) {
                //проверка на существование координат в массиве
                clearInterval(timer); //очистка таймера
                ctx.beginPath(); //начало новой линии
                return;
            }

            let crd = coords.shift(), //из координат "вырывается" первое значение и записывается в переменную
                e = {
                    clientX: crd["0"], //расстояние от левого края по х берется из массива нулевого
                    clientY: crd["1"], //расстояние от верхнего края по у берется из массива первого
                },
                stt = stat.shift(),
                elem = {
                    wid: stt["0"],
                    color: stt["1"],
                },
                wgt = elem.wid,
                col = elem.color;
            ctx.lineWidth = wgt * 2;

            ctx.fillStyle = col;
            ctx.strokeStyle = col;

            ctx.lineTo(e.clientX, e.clientY); //всё то же самое что и сверху
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(e.clientX, e.clientY, wgt, 0, Math.PI * 2);
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo(e.clientX, e.clientY);
        }, 3);
}

document.addEventListener("keydown", (e) => {
    if (e.keyCode == 83) {
        //save
        save();
        console.log("Saved");
    }

    if (e.keyCode == 82) {
        //replay
        console.log("Replayin...");
        coords = JSON.parse(localStorage.getItem("coords")); //координаты достаются из json документа и преобразуются в js код
        stat = JSON.parse(localStorage.getItem("stat"));
        clear();
        replay();
    }

    if (e.keyCode == 67) {
        //clear
        clear();
        console.log("Cleared");
    }
});