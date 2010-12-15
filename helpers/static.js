module.exports = {
  truncate: function (str, num) {
    var limit = num || 20;

    if (str) {
      if (str.length > limit) {
        return str.slice(0, limit) + '...';
      } else {
        return str;
      }
    } else {
      return '';
    }
  },

  date_humanize: function (date) {
    if (date.year !== (new Date()).year) {
      return date.format('%ne %b, %Y');
    } else {
      return date.format('%ne %B');
    }
  },

  showErrors: function (validator, field) {
    if (validator && validator.hasError(field)) {
      var errors = '';

      validator.getErrorBucket(field, false).forEach(function (error) {
        errors += '<li>' + error + '</li>';
      });

      return "<ul class='error'>" + errors + "</ul>";
    }
  }
};
