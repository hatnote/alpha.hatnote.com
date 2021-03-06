var API_URL = 'https://en.wikipedia.org/w/api.php';
var ENABLE_CAT_ADDS = false;

function load_cat(cat_title, element) {
  var list = $(element).parent().append('<ul class="tree"></ul>');
  var url = API_URL;
  var params = {
    'action': 'query',
    'list': 'categorymembers',
    'cmtitle': cat_title,
    'format': 'json',
    'cmlimit': 100
  }
  $.ajax({
    dataType: 'jsonp',
    url: url,
    data: params,
  }).done(function(data) {
    if (data['query']['categorymembers'].length <= 0) {
      $('ul:first', list).append('<li>None</li>');
    }
    if (data['query-continue']) {
      var cont_str = data['query-continue']['categorymembers']['cmcontinue'];
      load_cat_continue(cat_title, cont_str, list);
    }
    $.map(data['query']['categorymembers'], function(category) {
      append_item(category, list);
    });
    if (ENABLE_CAT_ADDS) {
      $('ul:first', list).prepend('<li><a href="#" class="add-link">Add category member</a></li>');
      $('.add-link').on('click', function() {
        $(this).parent().html('<input type="text"> <input type="button" value="add" class="add">');
      })
    }
    $('.tree:odd').css("background-color", "#F7F7F7");
    $('.tree:even').css("background-color", "white");
  });
}

function load_cat_continue(cat_title, continue_str, element) {
  var url = API_URL;
  var params = {
    'action': 'query',
    'list': 'categorymembers',
    'cmtitle': cat_title,
    'cmcontinue': continue_str,
    'format': 'json'
  }
  $.ajax({
    dataType: 'jsonp',
    url: url,
    data: params,
  }).done(function(data, status, f) {
    if (data['query-continue']) {
      var cont_str = data['query-continue']['categorymembers']['cmcontinue'];
      load_cat_continue(cat_title, cont_str, element);
    }
    $.map(data['query']['categorymembers'], function(category) {
      append_item(category, element);
    });
  })
}

function append_item(category, element) {
  var cat = category['title'];
  if (category['ns'] === 14) {
    var cat_link = '<li class="cat"><span class="cat-link">' + cat + '</span>';
    var parents = $(element)
      .parents('li')
      .find('span.cat-link:first:contains("' + cat + '")')
    if (parents.length > 0) {
      cat_link += ' <span class="cycle">(Warning: graph cycle)</span>';
    }
    cat_link += '</li>'
    if (!$('ul:first .cat', element).length) {
      $('ul:first', element).prepend(cat_link);
    } else {
      $('ul:first .cat:last', element).after(cat_link);
    }
  } else {
    $('ul:first', element).append('<li>' + cat + '</li>');
  }

}

$(function init() {
  var starting_cat = 'Category:Contents';
  $('body').on('click', '.cat-link', function() {
    if ($(this).hasClass('loaded')) {
      $(this).parent().children('ul').toggle();
    } else {
      var cat = $(this).text();
      load_cat(cat, this);
      $(this).addClass('loaded');
    }
  });
  if (ENABLE_CAT_ADDS) {
    $('body').on('click', '.add', function() {
      var cat = $(this).closest('.cat').find('.cat-link:first').text();
      if (!cat) {
        cat = $('#top').text();
      }
      var page = $(this).parent().find('input').val();
      console.log(cat, page);
    });
  }
  $('#cats').html('<ul class="tree"><li class="cat"><span class="cat-link loaded">' + starting_cat + '</span></li></ul>');
  load_cat(starting_cat, $('#cats span  '));
});
