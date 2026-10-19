// Archives de la Force - Axis Community
(function () {
  // menu mobile
  var toggle = document.querySelector(".burger");
  var nav = document.querySelector(".tabs");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  // catalogue des poignees : rarete + recherche
  var hgrid = document.getElementById("hilts");
  if (hgrid) {
    var hcards = Array.prototype.slice.call(hgrid.children);
    var hs = { cat: "toutes", q: "" };
    var hcount = document.getElementById("hilts-count");
    var hsearch = document.getElementById("hilts-search");
    var hnorm = function (s) { return (s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); };
    var happly = function () {
      var q = hnorm(hs.q), k = 0;
      hcards.forEach(function (c) {
        var ok = (hs.cat === "toutes" || c.getAttribute("data-cat") === hs.cat) && (!q || hnorm(c.textContent).indexOf(q) !== -1);
        c.classList.toggle("hidden", !ok);
        if (ok) k++;
      });
      if (hcount) hcount.textContent = k + (k > 1 ? " poignées" : " poignée");
    };
    var hbtns = document.querySelectorAll("[data-hfilter]");
    hbtns.forEach(function (b) {
      b.addEventListener("click", function () {
        hbtns.forEach(function (o) { o.setAttribute("aria-pressed", "false"); });
        b.setAttribute("aria-pressed", "true");
        hs.cat = b.getAttribute("data-value");
        happly();
      });
    });
    if (hsearch) hsearch.addEventListener("input", function () { hs.q = hsearch.value; happly(); });
    happly();
  }

  // filtres de la page des pouvoirs
  var table = document.getElementById("powers");
  if (!table) return;
  var rows = Array.prototype.slice.call(table.querySelectorAll("tbody tr"));
  var state = { side: "tous", cat: "toutes", q: "" };
  var count = document.getElementById("powers-count");
  var search = document.getElementById("powers-search");

  function norm(s) {
    return (s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  }

  function apply() {
    var q = norm(state.q), n = 0;
    rows.forEach(function (r) {
      var side = r.getAttribute("data-side");
      var ok = true;
      if (state.side === "jedi") ok = side === "all" || side === "jedi";
      else if (state.side === "sith") ok = side === "all" || side === "sith";
      if (ok && state.cat !== "toutes") ok = r.getAttribute("data-cat") === state.cat;
      if (ok && q) ok = norm(r.textContent).indexOf(q) !== -1;
      r.classList.toggle("hidden", !ok);
      if (ok) n++;
    });
    if (count) count.textContent = n + (n > 1 ? " pouvoirs" : " pouvoir");
  }

  function group(name, key) {
    var chips = document.querySelectorAll('[data-filter="' + name + '"]');
    chips.forEach(function (c) {
      c.addEventListener("click", function () {
        chips.forEach(function (o) { o.setAttribute("aria-pressed", "false"); });
        c.setAttribute("aria-pressed", "true");
        state[key] = c.getAttribute("data-value");
        apply();
      });
    });
  }
  group("side", "side");
  group("cat", "cat");
  if (search) search.addEventListener("input", function () { state.q = search.value; apply(); });

  // lien direct : pouvoirs.html#jedi ou #sith
  var h = (location.hash || "").replace("#", "");
  if (h === "jedi" || h === "sith") {
    var c = document.querySelector('[data-filter="side"][data-value="' + h + '"]');
    if (c) c.click();
  }
  apply();
})();
