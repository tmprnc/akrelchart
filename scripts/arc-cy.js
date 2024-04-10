cystyle = [
    {
        selector: 'node[category="characters"]',
        style: {
            'background-color': '#d9d9d9',
            'background-opacity': '0',
            'width': '218',
            'height': '242',
            'shape': 'rectangle',
            'label': 'data(name)',
            'text-margin-y': '-34px',
            'font-size': '26pt',
            'text-wrap': 'ellipsis',
            'text-max-width': '196',
            'text-valign': 'bottom',
            'background-image': function(ele) {
                return ["../images/icon/" + ele.data("_key") + ".webp",
                "../images/polaroid.webp"]
            },
            'background-position-x': '18px',
            'background-position-y': '21px',
            'background-width': 'auto 218px',
            'background-image-containment': 'over',
            'background-clip': 'none',
            'font-family': 'NuberNext Condensed',
        }
    },
    {
        selector: ':selected',
        style: {
            'border-width': '8px',
            'border-style': 'solid',
            'border-color': 'white',
            'border-opacity': '0.9'
        }
    },
    {
        selector: '.smalltext',
        style: {
            'font-size': '20pt',
            'text-wrap': 'none',
            'text-max-width': '0',
        }
    }
]

var cy = cytoscape({
    container: document.getElementById('cy'),
    elements: [],
    style: cystyle,
    boxSelectionEnabled: false,
    wheelSensitivity: 0.1,
});


var fuse 
async function go() {
    await load();
    fuse = new Fuse(characters, fuseOptions)
    fusee = new Fuse(events, fuseOptions)
    loadtext("load", "adding characters to view")
    cy.add(characters)
    cy.add(chartochar)
    cy.add(events)
    cy.add(chartoevent)
    cy.$('[category = "events"]').hide()
    cy.$('[category = "chartoevent"]').hide()
    loadtext("load", "running layout")
    if (mobileCheck()) {
        setTimeout(function(){
            loadtext("warn", "this will take a while on mobile devices")
        }, 1000)
    }
    cy.elements('[category != "events"][category != "chartoevent"]').layout({
        name: 'cose',
        animate: false
    }).run()
}

cy.on('layoutstop', function(){
    setTimeout(function(){
        //cy.zoom(0.6)
        cy.center()
        loadtext("load", "done!")
        loadtext("warn", "")
        document.getElementById('ptilop').src = `../images/loading/${ptilopload}`
        document.getElementById('loading').classList.remove("loading_v")
        document.getElementById('loading').classList.add("loading_i")
    }, 0)
})

inslist = document.getElementById("instancelist")
rellist = document.getElementById("relations")
intlist = document.getElementById("interactions")
mbylist = document.getElementById("mentionby")
menlist = document.getElementById("mentions")

cy.on('select', 'node', async function(event){
    var node = event.target;
    unhide()
    unpopsearch()
    cy.animate({
        pan: {
            x: -node.position('x') * cy.zoom() + window.innerWidth / 4,
            y: -node.position('y') * cy.zoom() + window.innerHeight / 2
        },
        easing: "ease-out-quad"
    })

    fullcg = document.querySelector('#popoutcontainer > img')
    fullcg.src = `../images/fullcg/${node.data('_key')}.webp`

    popoutc = document.getElementById('popoutcontainer')
    setvisibility(popoutc, "v")
    popoutc.children[1].scrollTop = 0
    popout = document.getElementById('popout').children
    popout[1].innerHTML = node.data('name')
    
    // forgot why i had to do this
    try {
        const r = await fetch(`../images/faction/${node.data('sub-faction')}.webp`)
        if (r.ok) {
            fac = node.data('sub-faction')
        } else {
            fac = node.data('faction')
        }
    } catch (e) {}

    popout[2].src = `../images/faction/${fac}.webp`

    list = popout[3].children
    list[list.length - 2].innerHTML = node.data('faction')
    list[list.length - 1].innerHTML = node.data('sub-faction')
    illus = node.data('illustrator')
    for (i of illus) {
        if (typeof i === 'string') {
            generate(i)
            continue
        }
        generate(i[0], i[1])
    }

    for (e of node.connectedEdges()) {
        if (e.data("category") === "chartoevent") {
            inslist.appendChild(instancegen(e))
        } else if (e.data("category") === "chartochar") {
            switch (e.data("type")) {
                case "mention":
                    if (e.data("source") === node.data("id")) {
                        menlist.appendChild(mentiongen(e, "target", false));
                    } else {
                        mbylist.appendChild(mentiongen(e, "source", true));
                    }
                    break;
                case "relation":
                    if (e.data("source") === node.data("id")) {
                        rellist.appendChild(assocgen(e, "target", false));
                    } else {
                        rellist.appendChild(assocgen(e, "source", true));
                    }
                    break;
                case "interaction":
                    if (e.data("source") === node.data("id")) {
                        intlist.appendChild(assocgen(e, "target", false));
                    } else {
                        intlist.appendChild(assocgen(e, "source", true));
                    }
                    break;
            }
        }
    }
})

cy.on('unselect', 'node', function(event){
    node = event.target

    // JANK: on collapse this list is 
    // emptied before the animation finishes
    list = document.getElementById("list")
    while (list.childNodes.length > 4) { // why 4????
        list.removeChild(list.firstChild)
    }

    lists = [
        document.getElementById("instancelist"),
        document.getElementById("relations"),
        document.getElementById("interactions"),
        document.getElementById("mentionby"),
        document.getElementById("mentions"),
    ]

    for (e of lists) {
        e.replaceChildren()
    }

    setTimeout(function(){
        if (cy.$(':selected').length === 0) {
            collapse()
            cy.animate({
                center: {eles: node},
                easing: "ease-out-quad"
            })
        }
    }, 0)
})