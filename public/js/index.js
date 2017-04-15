const module = {},
    popup = {};


popup.stats = function() { //moduł generujący okienko ze statystykami
    const showBtn = document.querySelector('.footer--stats'),
        body = document.querySelector('body'),
        popupBackground = document.createElement('div'),
        popupContainer = document.createElement('div');

    popupBackground.classList.add('popup--background');
    popupContainer.classList.add('popup--stats');

    const closePop = function() {
        popupContainer.style.opacity = 0;
        popupBackground.style.opacity = 0
        setTimeout(() => { popupBackground.remove() }, 1000);
    }
    const changeTimeFormat = function() {
        const lastDate = new Date(information[0].lastDateInMiliseconds),
            nowTime = Date.now();

        let A = nowTime - information[0].lastDateInMiliseconds;

        seconds = Math.floor((A / 1000) % 60);
        minutes = Math.floor((A / (1000 * 60)) % 60);
        hours = Math.floor((A / (1000 * 60 * 60)) % 24);

        if (hours) {
            return `${hours}h, ${minutes}m, ${seconds}s`;
        } else if (minutes) {
            return `${minutes}m, ${seconds}s`;
        } else {
            return `mniej niż 1 minuta`;
        }
    }

    const showStats = function() { 
        const lastDate = new Date(information[0].lastDateInMiliseconds);
        let closeBtn;

        popupBackground.style.opacity = 1;
        popupContainer.style.opacity = 1;

        popupContainer.innerHTML = `<button class="btn btn--close"></button>
            	<article class = "stats--information" >
                <p class = "popup--stats-text" >
                Ilość generacji cytatu: </br> 
                <span class = 'popup--stats-text-bold' >
                ${information[0].amount} 
                </span> 
                </p> 
                <p class = "popup--stats-text" >
                Data i czas ostatniej generacji: </br> 
                	<span class = 'popup--stats-text-bold'>
                		${lastDate.toLocaleString()}
                	</span> 
                </p> 
                <p class = "popup--stats-text">
                Od ostatniej generacji minęło: </br> 
                	<span class = 'popup--stats-text-bold' >
                		${changeTimeFormat()}	
                	</span> 
                </p> 
                </article>
    	`
        body.appendChild(popupBackground);
        popupBackground.appendChild(popupContainer);

        closeBtn = document.querySelector('.btn--close');
        closeBtn.addEventListener('click', closePop);
    }
    showBtn.addEventListener('click', showStats);
}


module.quote = function() { //moduł odpowiedzialny za wyświetalnie i zapis cytatów
    const changeBtn = document.querySelector('.header .btn--random'),
        quoteContainer = document.querySelector('.quote--container'),
        quote = document.querySelector('.quote--text'),
        auth = document.querySelector('.quote--author'),
        time = 500;

    const updateJSON = function(quote, author, time, amount) {
        if (typeof XMLHttpRequest == "undefined") {
            XMLHttpRequest = function() {
                return new ActiveXObject(
                    navigator.userAgent.indexOf("MSIE 5") >= 0 ? "Microsoft.XMLHTTP" : "Msxml2.XMLHTTP"
                );
            }
        }
        let xml = new XMLHttpRequest();
        xml.open("GET", "/save?quote="+quote+"&author="+author+"&time="+time+"&amount="+amount, true);
        xml.onreadystatechange = function() {
            if (xml.readyState == 4 && (xml.status >= 200 && xml.status < 300 || xml.status == 304 || navigator.userAgent.indexOf("Safari") >= 0 && typeof xml.status == "undefined")) {
                
                 

                xml = null;
            } else {
                console.log('updateJSON');
            }
        };
        xml.send();
    }

    const updateInfo = function(quote, author) {
        const timeMiliseconds = Date.now(),
            getDate = new Date(timeMiliseconds),
            lastDate = new Date(information[0].lastDateInMiliseconds),
            oldDate = lastDate.toLocaleString()
        nowDate = getDate.toLocaleString();

        information[0].quote = quote;
        information[0].author = author;
        information[0].lastDateInMiliseconds = timeMiliseconds;
        information[0].amount = information[0].amount + 1;
        updateJSON(information[0].quote, information[0].author, information[0].lastDateInMiliseconds, information[0].amount);
        // readWriteAsync();
    }
    const firstFillQuote = function() {
        quote.innerHTML = information[0].quote;
        auth.innerText = information[0].author;
    }

    const qouteAPI = function() {
        const rand = Math.floor((Math.random() * 10000) + 1);
        if (typeof XMLHttpRequest == "undefined") {
            XMLHttpRequest = function() {
                return new ActiveXObject(
                    navigator.userAgent.indexOf("MSIE 5") >= 0 ? "Microsoft.XMLHTTP" : "Msxml2.XMLHTTP"
                );
            }
        }
        let xml = new XMLHttpRequest();
        xml.open("GET", "http://quotesondesign.com/wp-json/posts?filter[orderby]=rand&filter[posts_per_page]=1&random=" + rand, true);

        xml.onreadystatechange = function() {
            if (xml.readyState == 4 && (xml.status >= 200 && xml.status < 300 || xml.status == 304 || navigator.userAgent.indexOf("Safari") >= 0 && typeof xml.status == "undefined")) {
                let response = JSON.parse(xml.responseText);
                quote.innerHTML = response[0].content;
                auth.innerText = response[0].title;
                updateInfo(response[0].content, response[0].title);

                xml = null;
            } else {
                quote.innerHTML = "Design is a solution to a problem. Art is a question to a problem.";
                auth.innerText = "JOHN MAEDA";
                // jeśli wystąpi problem, żeby nie było pusto jest wyświetlany ten cytat
            }
        };
        xml.send();
        setTimeout(() => { quoteContainer.style.opacity = 1 }, time + 100);
    }

    changeBtn.addEventListener('click', function() {
        quoteContainer.style.opacity = 0;
        setTimeout(qouteAPI, time);
    });

    return {
        init: function() {
            firstFillQuote();
            console.log('random qoutes works!');
        }
    }
}();

module.quote.init();
popup.stats();
