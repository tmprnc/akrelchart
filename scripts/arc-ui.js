const seconds = new Date().getMilliseconds();

var ptilopload = "open.webp"

if (seconds % 60 === 0) {
    ptilopload = "ropen.webp"
} else if (seconds % 90 === 0) {
    ptilopload = "lopen.webp"
}

// copied from stackoverflow
// also, lol?
window.mobileCheck = function() {
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
};

// this is more generic than i thought
function loadtext(lw, text) {
    document.getElementById(`${lw}`).innerHTML = text
}

go();

function delbutton(edge) {
    a = document.createElement("a")
    a.classList.add("admin")
    if (!loggedin) {
        a.classList.add("none")
    }
    a.classList.add("icon")
    a.classList.add("icon-delete")
    a.href = '#'
    a.title = "Delete"
    a.onclick = function() {
        event.preventDefault()
        del(false, edge)
    }
    return a
}

function instancegen(edge){// event, type, as) {
    evt = cy.$id(edge.data("target"))
    type = edge.data("type")
    _as = edge.data("sprite")
    li = document.createElement("li");
    p1 = document.createElement("p");
    p1.innerHTML = type
    a = document.createElement("a");
    a.href = evt.data("url")
    a.setAttribute("target", "_blank")
    a.innerHTML = evt.data("name")
    li.appendChild(p1)
    li.appendChild(a)
    if (_as !== "default") {
        p2 = document.createElement("p");
        p2.innerHTML = "as"
        img = document.createElement("img")
        img.src = `../images/icon/${_as}`
        li.appendChild(p2)
        li.appendChild(img)
    }
    a2 = document.createElement("a")
    a2.classList.add("admin")
    if (!loggedin) {
        a2.classList.add("none")
    }
    a2.classList.add("icon")
    a2.classList.add("icon-edit")
    a2.href = '#'
    a2.title = "Edit"
    a2.onclick = function() {
        event.preventDefault()
        showdialog("instanced", edge)
    }
    a3 = document.createElement("a")
    a3.classList.add("admin")
    if (!loggedin) {
        a3.classList.add("none")
    }
    a3.classList.add("icon")
    a3.classList.add("icon-editevent")
    a3.href = '#'
    a3.title = "Edit event"
    a3.onclick = function() {
        event.preventDefault()
        showdialog("eventd", evt)
    }
    li.appendChild(a3)
    li.appendChild(a2)
    li.appendChild(delbutton(edge))
    return li
}

function assocgen(edge, point, reverse) {
    target = cy.$id(edge.data(`${point === "source" ? "source" : "target"}`))
    itype = reverse ? edge.data("subtype_reverse") : edge.data("subtype")
    if (!itype) {
        itype = edge.data("subtype")
    }
    evt = cy.$id(edge.data("instance"))
    li = document.createElement("li")
    p1 = document.createElement("p")
    p1.innerHTML = itype
    img = document.createElement("img")
    img.src = `../images/icon/${target.data("_key")}.webp`
    a = document.createElement("a")
    a.innerHTML = target.data("name")
    a.href = '#'
    a.onclick = function() {
        event.preventDefault();
        goto(target.data("_key"))
    }
    p2 = document.createElement("p")
    p2.innerHTML = " in "
    a2 = document.createElement("a")
    a2.innerHTML = evt.data("name")
    a2.href = evt.data("url")
    a2.setAttribute("target", "_blank")
    li.appendChild(p1)
    li.appendChild(img)
    li.appendChild(a)
    li.appendChild(p2)
    li.appendChild(a2)
    if (edge.data("url")) {
        a3 = document.createElement("a")
        a3.classList.add("icon")
        a3.classList.add("icon-open")
        a3.href = edge.data("url")
        a3.title = edge.data("instancedetail")
        a3.setAttribute("target", "_blank")
        li.appendChild(a3)
    }
    a4 = document.createElement("a")
    a4.classList.add("admin")
    if (!loggedin) {
        a4.classList.add("none")
    }
    a4.classList.add("icon")
    a4.classList.add("icon-edit")
    a4.href = '#'
    a4.title = "Edit"
    a4.onclick = function() {
        event.preventDefault()
        showdialog("assocd", edge)
    }
    li.appendChild(a4)
    li.appendChild(delbutton(edge))
    return li
}

function mentiongen(edge, point, by) {
    char = cy.$id(edge.data(`${point === "source" ? "source" : "target"}`))
    instance = cy.$id(edge.data('instance'))
    li = document.createElement("li")
    img = document.createElement("img")
    img.src = `../images/icon/${char.data("_key")}.webp`
    a = document.createElement("a")
    a.href = '#'
    a.innerHTML = char.data("name")
    a.onclick = function() {
        event.preventDefault()
        goto(char.data("_key"))
    }
    p2 = document.createElement("p")
    p2.innerHTML = " in "
    a2 = document.createElement("a")
    a2.href = instance.data("url")
    a2.setAttribute("target", "_blank")
    a2.innerHTML = instance.data("name")
    if (by) {
        p = document.createElement("p")
        p.innerHTML = "by "
        li.appendChild(p)
    } else {
    }
    li.appendChild(img)
    li.appendChild(a)
    li.appendChild(p2)
    li.appendChild(a2)
    if (edge.data("url")) {
        a3 = document.createElement("a")
        a3.classList.add("icon")
        a3.classList.add("icon-open")
        a3.href = edge.data("url")
        a3.title = edge.data("instancedetail")
        a3.setAttribute("target", "_blank")
        li.appendChild(a3)
    }
    a4 = document.createElement("a")
    a4.classList.add("admin")
    if (!loggedin) {
        a4.classList.add("none")
    }
    a4.classList.add("icon")
    a4.classList.add("icon-edit")
    a4.href = '#'
    a4.title = "Edit"
    a4.onclick = function() {
        event.preventDefault()
        showdialog("mentiond", edge)
    }
    li.appendChild(a4)
    li.appendChild(delbutton(edge))
    return li
}

function generate(illust, romanized) {
    // assumes there's an illustrator
    const li = document.createElement("li");
    const node1 = document.createTextNode(illust);
    li.appendChild(node1);
    if (romanized) {
        const i = document.createElement("i");
        i.innerHTML = " aka &hairsp;";
        li.appendChild(i);
        const node2 = document.createTextNode(`"${romanized}"`);
        li.appendChild(node2);
    }
    const list = document.getElementById("list");
    list.prepend(li);
}

search = document.getElementById("search")
popoutcontainer = document.getElementById("popoutcontainer")
footer = document.getElementById("footer")
restoreui = document.getElementById("restoreui")

function setvisibility(e, v) {
    // todo make this not shit
    // i shouldn't have to do this but javascript wasn't
    // supposed to be used like this anyway
    e.classList.remove(`${e.id}_${v === "v" ? "i" : "v"}`)
    e.classList.add(`${e.id}_${v === "v" ? "v" : "i"}`)
}

function collapse() {
    setvisibility(popoutcontainer, "i")
    cy.nodes().unselect()
}

function hide() {
    setvisibility(search, "i")
    setvisibility(footer, "i")
    setvisibility(restoreui, "v")
    collapse()
}

function unhide() {
    setvisibility(footer, "v")
    setvisibility(restoreui, "i")
}

/* 
window.innerHeight / window.innerWidth
> 0.80 = BAD
*/

function showlogin() {
    setvisibility(logind, "v")
    form.children[2].focus()
}

function hidelogin() {
    setvisibility(logind, "i")
}

function goto(id) {
    cy.$(':selected').unselect()
    cy.$(`[_key='${id}']`).select()
}

function toggletextsize() {
    cy.startBatch()
        cy.$('node').toggleClass('smalltext')
    cy.endBatch()
}

dialogform = document.getElementById("dialogform")


function dynamicnewinput(type) {
    if (type === "illus") {
        const div = document.createElement("div");
        const input = document.createElement("input");
        input.type = "text";
        input.placeholder = "Illustrator";
        div.appendChild(input);
        const input2 = document.createElement("input");
        input2.type = "text";
        input2.placeholder = "Romanized";
        div.appendChild(input2);
        const button = document.createElement("button");
        button.innerHTML = "Remove";
        button.onclick = function() {
            event.preventDefault();
            div.remove();
        }
        div.appendChild(button);
        return div;
    } else if (type === "alias") {

    }
}

// type: instance, association, mention, character, event
function showdialog(id, data) {
    dialog = document.getElementById(id).firstElementChild
    closedialog()
    dialog.classList.add("activedialog")
    dialog.parentElement.classList.add("focus")
    h1 = dialog.children[1]
    switch (dialog.id) {
        case "instanceform":
            h1 = "instance"
            break;
        case "associationform":
            h1 = "association"
            break;
        case "mentionform":
            h1 = "mention"
            break;
        case "characterform":
            h1 = "character"
            break;
        case "eventform":
            h1 = "event";
            break;
        default:
            break;
    }
    dialog.children[1].innerHTML = `New ${h1}`
    if (data) {
        dialog.reset()
        fe = dialog.elements
        // static since the form names differ
        dialog.children[3].children[0].children[1].value = data.data("id")
        if (data.data("category") === "chartochar"  // i am very smart
         || data.data("category") === "chartoevent"
         || (data.data("illustrator") && dialog.id === "characterform")
         || (data.data("completion") && dialog.id === "eventform")) {
            dialog.children[1].innerHTML = `Editing ${h1} ${data.data("_key")}`
            dialog.lastElementChild.value = "Edit"
            switch (dialog.id) {
                case "instanceform":
                    fe["_key"].value = data.data("_key")
                    fe["_from"].value = data.data("source")
                    fe["_to"].value = data.data("target")
                    fe["type"].value = data.data("type")
                    fe["sprite"].value = data.data("sprite")
                    break;
                case "associationform":
                    fe["_key"].value = data.data("_key")
                    fe["_from"].value = data.data("source")
                    fe["_to"].value = data.data("target")
                    radios = fe["type"]
                    for (r of radios) {
                        if (r.value === data.data("type")) {
                            r.checked = true
                        }
                    }
                    fe["subtype"].value = data.data("subtype")
                    fe["subtype_reverse"].value = data.data("subtype_reverse")
                    fe["instance"].value = data.data("instance")
                    fe["instancedetail"].value = data.data("instancedetail")
                    fe["url"].value = data.data("url")
                    break;
                case "mentionform":
                    fe["_key"].value = data.data("_key")
                    fe["_from"].value = data.data("source")
                    fe["_to"].value = data.data("target")
                    fe["instance"].value = data.data("instance")
                    fe["instancedetail"].value = data.data("instancedetail")
                    fe["url"].value = data.data("url")
                    break;
                case "characterform":
                    fe["_key"].value = data.data("_key")
                    fe["name"].value = data.data("name")
                    fe["faction"].value = data.data("faction")
                    fe["sub-faction"].value = data.data("sub-faction")
                    // space reserved for dynamic inputs
                    fe["npc"].checked = data.data("npc")
                    fe["global"].checked = data.data("global")
                    fe["gender"].value = data.data("gender")
                    break;
                case "eventform":
                    fe["_key"].value = data.data("_key")
                    fe["name"].value = data.data("name")
                    fe["type"].value = data.data("type")
                    fe["subtype"].value = data.data("subtype")
                    fe["releasedate"].value = data.data("releasedate")
                    fe["url"].value = data.data("url")
                    fe["completion"].checked = data.data("completion")
                    break;
                default:
                    break;
            }
        }
    }
}

function closedialog() {
    a = document.querySelector(".activedialog")
    if (a) {
        a.classList.remove("activedialog")
        a.parentElement.classList.remove("focus")
        a.reset()
    }
}

function showpwchange() {
    setvisibility(document.getElementById('pw'), "v")
}

function hidepwchange() {
    setvisibility(document.getElementById('pw'), "i")
}