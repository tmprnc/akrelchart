document.addEventListener("keydown", function (event) {
  if ((event.key === "f" || event.key === "F") && event.ctrlKey) {
    if (!document.querySelector(".activedialog")) {
      event.preventDefault();
      popsearch()
    }
  } else if (event.key === "Escape") {
    if (document.querySelector(".activedialog")) {
      closedialog()
    } else if (document.querySelector(".search_v")) {
      unpopsearch()
    } else {
      collapse()
    }
  }
})

function popsearch() {
  setvisibility(search, "v")
  document.getElementById("searchbar").focus()
}

function unpopsearch() {
  wiperesults("result")
  setvisibility(search, "i")
  document.getElementById("searchbar").value = ""
}

// my name is big monster and i like to eat burger for breakfast
function createresult(id, pname, which, gotoa) {
  const li = document.createElement("li");
  const a = document.createElement("a");
  a.classList.add("reslink")
  a.href = '#';
  if (gotoa) {
    a.onclick = function () {
      event.preventDefault();
      goto(id)
      unpopsearch()
    }
  } else {
    a.onclick = function () {
      event.preventDefault();
      // lol
      a.parentNode.parentNode.previousElementSibling.value = `${which}/${id}`
      a.parentNode.parentNode.previousElementSibling.dispatchEvent(new Event('input'))
      //a.parentNode.parentNode.innerHTML = ""
    }
  }
  const div = document.createElement("div");
  if (which === "characters") {
    icon = document.createElement("img");
    icon.src = `../images/icon/${id}.webp`;
    div.appendChild(icon);
  }
  p = document.createElement("p");
  p.innerHTML = pname;
  div.appendChild(p);
  a.appendChild(div);
  li.appendChild(a);
  return li
}

function wiperesults(id) {
  document.getElementById(id).innerHTML = "";
}

const fuseOptions = {
  threshold: 0.3,
  keys: ['data.name', 'data._key', 'data.aliases']
}

bar = document.getElementById("searchbar")
resultl = document.getElementById("result")

var rows;
function auto(where, goto, which, rows) {
  if (which === "characters") {
    fu = fuse
  } else {
    fu = fusee
  }
  where = document.getElementById(where)
  bar = where.previousElementSibling
  wiperesults(where.id)
  if (bar.value.length !== 0) {
    if (!rows) {
      rows = window.innerHeight / 64 - 2
    }
    fu.search(bar.value).slice(0, Math.floor(rows)).forEach(result => {
      where.appendChild(createresult(result.item.data._key, result.item.data.name, which, goto))
    })
    if (where.children[0]) {
      where.children[0].classList.add("kbsel")
    }
  }
}

var kbsel = 0;
bar.addEventListener("keydown", function (event) {
  switch (event.key) {
    case 'ArrowDown':
      console.log(kbsel, resultl.children[kbsel + 1])
      sel(kbsel, resultl.children[kbsel + 1])
      kbsel = kbsel + 1
      break
    case 'ArrowUp':
      sel(kbsel, resultl.children[kbsel - 1])
      kbsel = kbsel - 1
      break
    case 'Enter':
      s = resultl.children[kbsel].children[0]
      s.onclick();
      break
  }
})

function sel(kbsel, e) {
  if (kbsel < 0) {
    kbsel = kbsel + 1;
    return
  }
  if (kbsel > rows) {
    kbsel = kbsel - 1;
    return
  }
  document.querySelector('.kbsel').classList.remove('kbsel')
  e.classList.add('kbsel')
}


function kbselevent(where) {
  where = document.getElementById(where)
  where.previousElementSibling.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      where.children[0].children[0].onclick()
    }
  })
}

['r_insdiag', 'r_assocdiag1', 'r_assocdiag2', 'r_mendiag1', 'r_mendiag2',
  'r_insdiage', 'r_assocdiage', 'r_mendiage'].forEach(e => {
    kbselevent(e)
  })