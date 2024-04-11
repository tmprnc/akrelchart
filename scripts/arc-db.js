function rename(obj, oldKey, newKey) {
    obj[newKey] = obj[oldKey];
    delete obj[oldKey];
}

function cyte(doc) {
    if (doc["_from"] && doc["_to"]) {
        rename(doc, "_from", "source")
        rename(doc, "_to", "target")
    }
    rename(doc, "_id", "id")
    return doc
}

// prolly a much better way to make this, don't care rn
characters = []
events = []
chartochar = []
chartoevent = []

async function load() {
    try {
        const urls = [
            'https://api.ptilopsis.network/get/characters',
            'https://api.ptilopsis.network/get/events',
            'https://api.ptilopsis.network/get/chartochar',
            'https://api.ptilopsis.network/get/chartoevent'
        ];

        const fetchPromises = urls.map(url => fetch(url));
        const response = await Promise.all(fetchPromises);
        var [chars, eves, charchar, charevent] = await Promise.all(response.map(res => res.json()));
    } catch (e) {
        loadtext("warn", "failed to connect to the database")
        throw e
    }
    loadtext("load", "preparing data")
    for await (char of chars) {
        char.category = 'characters'
        char = {data: cyte(char)}
        characters.push(char)
    }
    for await (eve of eves) {
        eve.category = 'events'
        eve = {data: cyte(eve)}
        events.push(eve)
    }
    for await (cc of charchar) {
        cc.category = 'chartochar'
        cc = {data: cyte(cc)}
        chartochar.push(cc)
    }
    for await (ce of charevent) {
        ce.category = 'chartoevent'
        ce = {data: cyte(ce)}
        chartoevent.push(ce)
    }
}

lstr = document.getElementById("loginstr")
usern = document.getElementById("username")
logoutb = document.getElementById("logout")
loginb = document.getElementById("logina")
loggedin = false

async function login(form) {
    event.preventDefault();
    const data = new FormData(form)
    try {
        r = await fetch("https://api.ptilopsis.network/login", {
            method: "POST",
            body: data,
            credentials: "include"
        })
    
        if (r.ok) {
            setvisibility(form.parentElement, 'i')
            document.querySelector('#loginform > input[type="password"]').value = ""
            loadtext("lerr", "")
            usern.innerHTML = await r.text()
            document.querySelectorAll('.admin').forEach((ele) => {
                ele.classList.toggle('none')
            })
            loggedin = true
        } 
    } catch (e) {
        loadtext("lerr", await r.statusText.toLowerCase())
    }
}

async function logout() {
    r = await fetch("https://api.ptilopsis.network/logout", {
        credentials: "include"
    })

    if (r.ok) {
        setvisibility(document.getElementById("login"), 'v')
        closedialog()
        usern.innerHTML = ""
        document.querySelectorAll('.admin').forEach((ele) => {
            ele.classList.toggle('none')
        })
        loggedin = false
    }
}

function charvalid(input) {
    if (cy.$id(input.value).data()) {
        input.setCustomValidity("")
    } else {
        input.setCustomValidity("node doesn't exist")
    }
}


async function send(that) {
    event.preventDefault();
    
    switch (that.id) {
        case "instanceform":
            err = document.getElementById("ierr")
            endpoint = "chartoevent"
            break;
        case "associationform":
            err = document.getElementById("aerr")
            endpoint = "chartochar"
            break;
        case "mentionform":
            err = document.getElementById("merr")
            endpoint = "chartochar"
            break;
        case "eventform":
            err = document.getElementById("eerr")
            endpoint = "events"
            break;
        default:
            return;
    }

    const fd = new FormData(that)
    if (that.id === "eventform") {
        fd.set('completion', fd.has('completion') ? true : false)
    }

    try {
        r = await fetch(`https://api.ptilopsis.network/admin/${endpoint}`, {
            method: "POST",
            body: fd,
            credentials: "include"
        })

        if (await r.ok) {
            that.reset()
            closedialog()
            err.innerHTML = ""
            b = Object.fromEntries(fd.entries())
            response = await r.json()
            b._key = response._key
            b._id = response._id
            if (that.id === "eventform") {
                if (b.completion == "true") {
                    b.completion = true
                } else if (b.completion == "false") {
                    b.completion = false
                }
            }
    
            if (cy.$id(b._id).data()) {
                cy.$id(b._id).data({...cyte(b), category: `${endpoint}`})
            } else {
                cy.add({data: {...cyte(b), category: `${endpoint}`}})
            }
            if (that.id !== "eventform") {
                goto(cy.$id(fd.get("_from")).data("_key"))
            }
        } else {
            err.innerHTML = await r.statusText.toLowerCase()
        }
    } catch (e) {
        err.innerHTML = await r.statusText.toLowerCase()
    }    
}

async function del(confirm, edge) {
    if (!confirm) {
        setvisibility(document.getElementById("ays"), "v")
        m = document.getElementById("areyoudel")
        m.innerHTML = `${edge.data("source")} -> ${edge.data("target")}`
        b = document.getElementById("aysb")
        b.onclick = function() {
            del(true, edge)
        }
    } else {
        switch (edge.data("category")) {
            case "chartochar":
                endpoint = "chartochar"
                break;
            case "chartoevent":
                endpoint = "chartoevent"
                break;
            default:
                break;
        }
        r = await fetch(`https://api.ptilopsis.network/admin/${endpoint}`, {
            method: "DELETE",
            body: edge.data("_key"),
            credentials: "include"
        })
        if (await r.ok) {
            setvisibility(document.getElementById("ays"), "i")
            cy.remove(edge)
            goto(cy.$(":selected").data("_key"))
        } else {
            c = document.querySelector("#ays > div > p")
            c.classList.add("req")
            c.innerHTML = r.statusText.toLowerCase()
        }
    }
}

async function changepw(that) {
    event.preventDefault();
    const fd = new FormData(that)
    r = await fetch("https://api.ptilopsis.network/admin/passwordchange", {
        method: "POST",
        body: fd,
        credentials: "include"
    })

    if (await r.ok) {
        that.reset()
        hidepwchange()
        loadtext("pwerr", "")
    } else {
        loadtext("pwerr", r.statusText.toLowerCase())
    }
}