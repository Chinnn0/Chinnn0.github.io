/* Web Lab: jQuery events, Ajax JSON loading and safe DOM rendering. */
(function ($) {
  "use strict";
  $(function () {
    var projects = [];
    var activeFilter = "all";
    var request = null;
    var $grid = $("#project-grid");
    var $status = $("#project-status");
    var categoryNames = { web: "網頁設計", data: "資料互動", git: "版本管理" };

    function makeArt(category, index) {
      var $art = $("<div>").addClass("project-art art-" + category).attr("aria-hidden", "true");
      $("<span>").addClass("art-number").text("EXAMPLE / 0" + (index + 1)).appendTo($art);
      if (category === "web") {
        var $browser = $("<div>").addClass("mini-browser").appendTo($art);
        var $bar = $("<div>").addClass("mini-browser-bar").appendTo($browser);
        for (var i = 0; i < 3; i += 1) $("<i>").appendTo($bar);
        var $layout = $("<div>").addClass("mini-layout").appendTo($browser);
        var $lines = $("<div>").addClass("mini-lines").appendTo($layout);
        for (var j = 0; j < 4; j += 1) $("<i>").appendTo($lines);
        $("<div>").addClass("mini-avatar").appendTo($layout);
      } else if (category === "data") {
        $("<span>").addClass("data-node").text("{ }").appendTo($art);
        $("<span>").addClass("data-arrow").appendTo($art);
        var $list = $("<div>").addClass("data-list").appendTo($art);
        for (var k = 0; k < 3; k += 1) $("<i>").appendTo($list);
      } else {
        var $graph = $("<div>").addClass("git-graph").appendTo($art);
        $("<div>").addClass("git-line").appendTo($graph);
        $("<div>").addClass("git-branch").appendTo($graph);
        for (var n = 0; n < 4; n += 1) $("<span>").addClass("git-point").appendTo($graph);
      }
      $("<span>").addClass("art-caption").text(category === "web" ? "STRUCTURE + STYLE" : category === "data" ? "DATA → INTERFACE" : "TRACK EVERY CHANGE").appendTo($art);
      return $art;
    }

    function createCard(project, index) {
      var $card = $("<article>").addClass("project-card").attr("data-category", project.category);
      $card.append(makeArt(project.category, index));
      var $body = $("<div>").addClass("project-body").appendTo($card);
      $("<p>").addClass("project-category").text(categoryNames[project.category] + " / 課堂實作示例").appendTo($body);
      $("<h3>").text(project.title).appendTo($body);
      $("<p>").addClass("project-description").text(project.description).appendTo($body);
      var $tags = $("<ul>").addClass("tag-list").attr("aria-label", "使用技術").appendTo($body);
      project.tags.forEach(function (tag) { $("<li>").text(tag).appendTo($tags); });
      var detailsId = "project-detail-" + project.id;
      var $button = $("<button>").attr({ type: "button", "class": "detail-toggle", "aria-expanded": "false", "aria-controls": detailsId }).appendTo($body);
      $("<span>").addClass("toggle-label").text("查看實作說明").appendTo($button);
      $("<span>").addClass("toggle-icon").attr("aria-hidden", "true").text("+").appendTo($button);
      var $details = $("<div>").addClass("project-details").attr({ id: detailsId, hidden: true }).appendTo($body);
      project.details.forEach(function (detail) { $("<p>").text(detail).appendTo($details); });
      return $card;
    }

    function renderProjects() {
      var keyword = $("#project-search").val().trim().toLocaleLowerCase();
      var visible = projects.filter(function (project) {
        var matchesCategory = activeFilter === "all" || project.category === activeFilter;
        var searchable = [project.title, project.description, project.tags.join(" "), categoryNames[project.category]].join(" ").toLocaleLowerCase();
        return matchesCategory && searchable.indexOf(keyword) !== -1;
      });
      $grid.empty();
      visible.forEach(function (project) { $grid.append(createCard(project, projects.indexOf(project))); });
      $("#project-empty").prop("hidden", visible.length !== 0);
      $status.text("顯示 " + visible.length + " / " + projects.length + " 件作品 · JSON 資料已載入");
    }

    function validProject(project) {
      return project && typeof project.id === "string" && /^[a-z0-9-]+$/.test(project.id) && Object.prototype.hasOwnProperty.call(categoryNames, project.category) && typeof project.title === "string" && typeof project.description === "string" && Array.isArray(project.tags) && project.tags.every(function (tag) { return typeof tag === "string"; }) && Array.isArray(project.details) && project.details.every(function (detail) { return typeof detail === "string"; });
    }

    function showError() {
      projects = [];
      $grid.empty();
      $("#project-error").prop("hidden", false);
      $("#project-empty").prop("hidden", true);
      $status.text("資料載入失敗，請按「再試一次」重新讀取。");
    }

    function loadProjects() {
      if (request) return;
      $grid.attr("aria-busy", "true");
      $("#project-error, #project-empty").prop("hidden", true);
      $("#reload-projects, #retry-projects").prop("disabled", true);
      $status.text("正在透過 Ajax 讀取作品資料…");
      request = $.ajax({ url: "data/projects.json", method: "GET", dataType: "json", timeout: 10000, cache: false })
        .done(function (data) {
          if (!data || !Array.isArray(data.projects) || !data.projects.length || !data.projects.every(validProject) || new Set(data.projects.map(function (p) { return p.id; })).size !== data.projects.length) {
            showError();
            return;
          }
          projects = data.projects;
          renderProjects();
        })
        .fail(function () { showError(); })
        .always(function () {
          request = null;
          $grid.attr("aria-busy", "false");
          $("#reload-projects, #retry-projects").prop("disabled", false);
        });
    }

    $(".filter-button").on("click", function () {
      activeFilter = $(this).attr("data-filter");
      $(".filter-button").removeClass("is-active").attr("aria-pressed", "false");
      $(this).addClass("is-active").attr("aria-pressed", "true");
      if (projects.length) renderProjects();
    });
    $("#project-search").on("input", function () { if (projects.length) renderProjects(); });
    $grid.on("click", ".detail-toggle", function () {
      var $button = $(this);
      var isOpen = $button.attr("aria-expanded") === "true";
      $button.attr("aria-expanded", String(!isOpen));
      $button.find(".toggle-label").text(isOpen ? "查看實作說明" : "收合實作說明");
      $button.find(".toggle-icon").text(isOpen ? "+" : "−");
      $(document.getElementById($button.attr("aria-controls"))).prop("hidden", isOpen);
    });
    $("#reload-projects, #retry-projects").on("click", loadProjects);
    $("#reset-filters").on("click", function () {
      activeFilter = "all";
      $("#project-search").val("");
      $(".filter-button").removeClass("is-active").attr("aria-pressed", "false");
      $(".filter-button[data-filter='all']").addClass("is-active").attr("aria-pressed", "true");
      renderProjects();
    });
    loadProjects();
  });
})(jQuery);
