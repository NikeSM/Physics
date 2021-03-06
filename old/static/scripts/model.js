var current_state = {
  current_paragraph: null,
  current_problem: null,
  current_hash: null,
  ref_paragraph: null,
  ref_problem: null,
  ref_sum: null,
  trace:[],
  isMobile: isMobile(),
  header_is_visible: true,
  search_is_visible: true

};
function isMobile (){
  var isMobile = {
    Android: function() {
      return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
      return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
      return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
      return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
      return navigator.userAgent.match(/IEMobile/i);
    },
    any: function() {
      return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
  };
  return isMobile.any()
}