/**
 * @fileoverview
 * Capture the results of a cajoled module that is included by script
 * concatenation.
  *
 * @author jasvir@gmail.com
 * @author kpreid@switchb.org
 * @requires ___, console
 * @overrides window
 * @provides CaptureCajoledModule
 */

function CaptureCajoledModule(importsCallback) {
  // Save and restore
  var originalNewModuleHandler = ___.getNewModuleHandler();

  // Set up a fresh handler
  var ourHandler = ___.makeNormalNewModuleHandler();

  // ... which grabs Domado and removes itself.
  var normalHandle = ourHandler.handle;
  ourHandler.handle = ___.markConstFunc(function (module) {
    ___.setNewModuleHandler(originalNewModuleHandler);

    // TODO(kpreid): This useful-for-debugging code ought to be available
    // somewhere, perhaps as part of the ES53 runtime. cajaVM.log is similar,
    // but is not a de facto standard for non-Caja environments.
    //
    // Firebug console object and its methods have no prototype methods so we
    // cannot expose them.
    if (typeof console !== 'undefined') {
      var saneConsole = {};
      ["log", "warn", "error", "debug"].forEach(function (v) {
        var f = console[v];
        var logFunc;
        if (console.firebug) {
          // On Firebug, there is a hazard of the inspector invoking
          // the objects it inspects, so we replace them with text
          logFunc = function () {
            var a = [];
            for (var i = 0; i < arguments.length; i++) {
              a[i] = "" + arguments[i];
            }
            Function.prototype.apply.call(f, console, a);
          };
        } else {
          logFunc = function () {
            Function.prototype.apply.call(f, console, arguments);
          };
        }
        saneConsole.DefineOwnProperty___(v, {
          value: ___.markConstFunc(logFunc),
          enumerable: true
        });
      });
      ourHandler.getImports().DefineOwnProperty___("console", {
        value: ___.freeze(saneConsole),
        enumerable: true
      });
    }

    // Load module
    normalHandle.call(ourHandler, module);

    var imports = ourHandler.getImports();

    importsCallback(imports);
  });

  ___.setNewModuleHandler(ourHandler);
}

if (typeof window !== 'undefined') {
  window['CaptureCajoledModule'] = CaptureCajoledModule;
}
