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
      'background-image': function (ele) {
        return ["../images/icon/" + ele.data("_key") + ".webp",
          "../images/polaroid.webp"]
      },
      'background-position-x': '18px',
      'background-position-y': '21px',
      'background-width': 'auto 218px',
      'background-image-containment': 'over',
      'background-clip': 'none',
      'background-repeat': 'no-repeat',
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
  textureOnViewport: true,
});

const fuseOptions = {
  threshold: 0.3,
  keys: ['data.name', 'data._key', 'data.aliases']
}

var fuse
var fusee
async function go() {
  await load();
  fuse = new Fuse(characters, fuseOptions)
  fusee = new Fuse(events, fuseOptions)
  cy.add(characters)
  cy.add(chartochar)
  cy.add(events)
  cy.add(chartoevent)
  cy.$('[category = "events"]').hide()
  cy.$('[category = "chartoevent"]').hide()
  loadtext("load", "running layout")
  if (mobileCheck()) {
    loadtext("warn", "this will take a while on mobile devices")
    coolFactor = 0.93
  } else {
    coolFactor = 0.99
  }
  setTimeout(function () {
    cy.elements('[category != "events"][category != "chartoevent"]').layout({
      name: 'cose',
      animate: false,
      boundingBox: { x1: 0, y1: 0, w: 10000, h: 10000 },
      idealEdgeLength: 200,
      coolingFactor: coolFactor
    }).run()
  }, 0)
}

cy.on('layoutstop', function () {
  setTimeout(function () {
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

fetchq = []

cy.on('select', 'node', async function (event) {
  var node = event.target;
  unhide()
  unpopsearch()
  cy.animate({
    pan: {
      x: -node.position('x') * cy.zoom() + window.innerWidth / 1.5,
      y: -node.position('y') * cy.zoom() + window.innerHeight
    },
    easing: "ease-out-quad"
  })

  popoutc = document.getElementById('popoutcontainer')
  setvisibility(popoutc, "v")
  popoutc.children[1].scrollTop = 0
  popout = document.getElementById('popout').children
  popout[1].innerHTML = node.data('name')

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

  popout[4].children[0].innerHTML = node.data("_key")

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

  // loading gfx takes an eternity compared to crunching local data
  ac = new AbortController()
  as = ac.signal
  fetchq.push(ac)
  fullcg = document.querySelector('#popoutcontainer > img')
  fullcg.classList.add("imgloading")
  let blob
  image = await fetch(`../images/fullcg/${node.data('_key')}.webp`, {
                      signal: as})
  if (image.ok) {
    blob = URL.createObjectURL(await image.blob())
  } else {
    blob = "../images/faction/blank.webp"
  }

  fetchq.filter((ele) => {ele !== as})
  fullcg.src = blob
  fullcg.classList.remove("imgloading")

  try {
    const r = await fetch(`../images/faction/${node.data('sub-faction')}.webp`)
    if (r.ok) {
      fac = node.data('sub-faction')
    } else {
      const s = await fetch(`../images/faction/${node.data('faction')}.webp`)
      if (s.ok) {
        fac = node.data('faction')
      } else {
        fac = 'no-icon'
      }
    }
  } catch (e) { }

  popout[2].src = `../images/faction/${fac}.webp`

})

cy.on('unselect', 'node', function (event) {
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

  fetchq.forEach((fetch) => {fetch.abort()})
  setTimeout(function () {
    if (cy.$(':selected').length === 0) {
      collapse()
      cy.animate({
        center: { eles: node },
        easing: "ease-out-quad"
      })
    }
  }, 0)
})
