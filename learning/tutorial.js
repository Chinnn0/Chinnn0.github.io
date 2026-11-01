'use strict';

document.addEventListener('DOMContentLoaded', function () {
  const byId = function (id) { return document.getElementById(id); };
  byId('update-title').addEventListener('click', function () {
    const title = byId('demo-name').value.trim();
    byId('preview-title').textContent = title || '未命名作品';
    byId('html-status').textContent = '預覽已更新：' + (title || '未命名作品') + '。這是 DOM 文字更新的實際結果。';
    byId('html-status').className = 'status ok';
  });

  function setLayout(narrow) {
    byId('layout-frame').classList.toggle('narrow', narrow);
    byId('layout-wide').setAttribute('aria-pressed', String(!narrow));
    byId('layout-narrow').setAttribute('aria-pressed', String(narrow));
    byId('css-status').textContent = narrow
      ? '目前為窄版容器（340px 上限）：CSS container query 將卡片排為單欄。'
      : '目前為寬版容器；視窗夠寬時以三欄排列。';
  }
  byId('layout-wide').addEventListener('click', function () { setLayout(false); });
  byId('layout-narrow').addEventListener('click', function () { setLayout(true); });

  const validJson = '{"title":"個人網頁","tags":["HTML5","CSS","jQuery"]}';
  function parseJson() {
    try {
      const data = JSON.parse(byId('json-input').value);
      byId('json-output').textContent = '解析成功\n' + JSON.stringify(data, null, 2);
    } catch (error) {
      byId('json-output').textContent = '解析失敗\n' + error.message;
    }
  }
  byId('parse-json').addEventListener('click', parseJson);
  byId('valid-json').addEventListener('click', function () {
    byId('json-input').value = validJson;
    parseJson();
  });
  byId('invalid-json').addEventListener('click', function () {
    byId('json-input').value = '{"title":"個人網頁",}';
    parseJson();
  });

  if (!window.jQuery || typeof window.jQuery.getJSON !== 'function') {
    byId('jquery-version').textContent = 'jQuery 完整版本未載入。請確認 ../vendor/jquery.min.js 存在並含 Ajax 模組。';
    byId('jquery-version').className = 'status error';
    byId('ajax-status').textContent = '尚無法發送請求：需要本地 jQuery 完整版本。';
    ['load-projects', 'test-missing', 'toggle-note'].forEach(function (id) { byId(id).disabled = true; });
    byId('filter-demo').disabled = true;
    return;
  }

  const $ = window.jQuery;
  $('#jquery-version').text('已載入本地 jQuery ' + $.fn.jquery + '，Ajax 模組可用。').addClass('ok');
  let pendingRequest = null;
  function loadProjects(path) {
    if (pendingRequest) { pendingRequest.abort(); }
    $('#ajax-projects').empty();
    $('#ajax-status').attr('class', 'status').text('載入中：' + path);
    $('#load-projects, #test-missing').prop('disabled', true);
    pendingRequest = $.getJSON(path)
      .done(function (data, textStatus, xhr) {
        const projects = Array.isArray(data) ? data : data.projects;
        if (!Array.isArray(projects)) {
          $('#ajax-status').attr('class', 'status error').text('回應已收到，但格式不符合預期：需要作品陣列或 projects 陣列欄位。');
          return;
        }
        projects.forEach(function (project, index) {
          $('<li>').text(project.title || project.name || ('作品 ' + (index + 1))).appendTo('#ajax-projects');
        });
        $('#ajax-status').attr('class', 'status ok').text('請求成功 · HTTP ' + xhr.status + ' · 讀取 ' + projects.length + ' 筆作品資料。' + (projects.length === 0 ? '目前沒有作品。' : ''));
      })
      .fail(function (xhr, textStatus) {
        if (textStatus === 'abort') { return; }
        const advice = location.protocol === 'file:' ? '請改用 HTTP 網址開啟本頁。' : '請檢查路徑與連線，再按「讀取作品 JSON」重試。';
        $('#ajax-status').attr('class', 'status error').text('請求失敗 · HTTP ' + xhr.status + ' · ' + textStatus + '。' + advice);
      })
      .always(function () {
        pendingRequest = null;
        $('#load-projects, #test-missing').prop('disabled', false);
      });
  }
  $('#load-projects').on('click', function () { loadProjects('../data/projects.json'); });
  $('#test-missing').on('click', function () { loadProjects('../data/this-file-does-not-exist.json'); });

  $('#toggle-note').on('click', function () {
    const expanded = $(this).attr('aria-expanded') === 'true';
    $(this).attr('aria-expanded', String(!expanded));
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    $('#jquery-note').stop(true, true).slideToggle(reduceMotion ? 0 : 150);
  });
  $('#filter-demo').on('input', function () {
    const keyword = $(this).val().trim().toLocaleLowerCase();
    let count = 0;
    $('#technology-list li').each(function () {
      const visible = $(this).text().toLocaleLowerCase().includes(keyword);
      $(this).toggle(visible);
      if (visible) { count += 1; }
    });
    $('#filter-status').text(count ? '目前顯示 ' + count + ' 項技術。' : '沒有符合的技術名稱。清除搜尋文字可顯示全部。');
  });
});
