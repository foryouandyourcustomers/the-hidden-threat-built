import { c as create_ssr_component, a as subscribe, e as escape, v as validate_component, o as onDestroy, s as setContext, g as each, h as add_styles, f as add_attribute, i as getContext, b as spread, d as escape_object, j as compute_slots, k as createEventDispatcher, l as escape_attribute_value } from './ssr-35980408.js';
import { r as readable, w as writable } from './index2-60e1937a.js';
import { g as require_root, J as require_baseGetTag, p as requireIsObjectLike, c as requireIsObject, x as createMachine, H as interpret, y as assign, K as not, G as GameState, L as and, B as sharedGuards, I as isEqual, M as getUser, N as getPlayer, O as isActionEventOf, D as getPlayerSide, E as isDefenderId } from './xstate.esm-08ef3f17.js';
import { A as Actions$1, P as Paragraph, a as Polygon } from './Polygon-294533f8.js';
import { B as Button } from './Button-d4280ae9.js';
import { H as Heading } from './Heading-9e047160.js';
import { F as Face } from './Face-609c1abc.js';
import { R as ROW_COUNT, C as COLUMN_COUNT, F as FACES, i as isItemIdOfSide, N as NEW_GLOBAL_ATTACK_ROUNDS, A as ATTACKER_REVEAL_ROUNDS, T as TOTAL_ROUNDS, b as CHARACTERS } from './constants-54c99163.js';
import { I as Item } from './Item-90c917ec.js';
import { c as commonjsGlobal, g as getDefaultExportFromCjs } from './_commonjsHelpers-24198af3.js';
import './names-11b10067.js';

var howler = {};

/*!
 *  howler.js v2.2.3
 *  howlerjs.com
 *
 *  (c) 2013-2020, James Simpson of GoldFire Studios
 *  goldfirestudios.com
 *
 *  MIT License
 */

var hasRequiredHowler;

function requireHowler () {
	if (hasRequiredHowler) return howler;
	hasRequiredHowler = 1;
	(function (exports) {
		(function() {

		  /** Global Methods **/
		  /***************************************************************************/

		  /**
		   * Create the global controller. All contained methods and properties apply
		   * to all sounds that are currently playing or will be in the future.
		   */
		  var HowlerGlobal = function() {
		    this.init();
		  };
		  HowlerGlobal.prototype = {
		    /**
		     * Initialize the global Howler object.
		     * @return {Howler}
		     */
		    init: function() {
		      var self = this || Howler;

		      // Create a global ID counter.
		      self._counter = 1000;

		      // Pool of unlocked HTML5 Audio objects.
		      self._html5AudioPool = [];
		      self.html5PoolSize = 10;

		      // Internal properties.
		      self._codecs = {};
		      self._howls = [];
		      self._muted = false;
		      self._volume = 1;
		      self._canPlayEvent = 'canplaythrough';
		      self._navigator = (typeof window !== 'undefined' && window.navigator) ? window.navigator : null;

		      // Public properties.
		      self.masterGain = null;
		      self.noAudio = false;
		      self.usingWebAudio = true;
		      self.autoSuspend = true;
		      self.ctx = null;

		      // Set to false to disable the auto audio unlocker.
		      self.autoUnlock = true;

		      // Setup the various state values for global tracking.
		      self._setup();

		      return self;
		    },

		    /**
		     * Get/set the global volume for all sounds.
		     * @param  {Float} vol Volume from 0.0 to 1.0.
		     * @return {Howler/Float}     Returns self or current volume.
		     */
		    volume: function(vol) {
		      var self = this || Howler;
		      vol = parseFloat(vol);

		      // If we don't have an AudioContext created yet, run the setup.
		      if (!self.ctx) {
		        setupAudioContext();
		      }

		      if (typeof vol !== 'undefined' && vol >= 0 && vol <= 1) {
		        self._volume = vol;

		        // Don't update any of the nodes if we are muted.
		        if (self._muted) {
		          return self;
		        }

		        // When using Web Audio, we just need to adjust the master gain.
		        if (self.usingWebAudio) {
		          self.masterGain.gain.setValueAtTime(vol, Howler.ctx.currentTime);
		        }

		        // Loop through and change volume for all HTML5 audio nodes.
		        for (var i=0; i<self._howls.length; i++) {
		          if (!self._howls[i]._webAudio) {
		            // Get all of the sounds in this Howl group.
		            var ids = self._howls[i]._getSoundIds();

		            // Loop through all sounds and change the volumes.
		            for (var j=0; j<ids.length; j++) {
		              var sound = self._howls[i]._soundById(ids[j]);

		              if (sound && sound._node) {
		                sound._node.volume = sound._volume * vol;
		              }
		            }
		          }
		        }

		        return self;
		      }

		      return self._volume;
		    },

		    /**
		     * Handle muting and unmuting globally.
		     * @param  {Boolean} muted Is muted or not.
		     */
		    mute: function(muted) {
		      var self = this || Howler;

		      // If we don't have an AudioContext created yet, run the setup.
		      if (!self.ctx) {
		        setupAudioContext();
		      }

		      self._muted = muted;

		      // With Web Audio, we just need to mute the master gain.
		      if (self.usingWebAudio) {
		        self.masterGain.gain.setValueAtTime(muted ? 0 : self._volume, Howler.ctx.currentTime);
		      }

		      // Loop through and mute all HTML5 Audio nodes.
		      for (var i=0; i<self._howls.length; i++) {
		        if (!self._howls[i]._webAudio) {
		          // Get all of the sounds in this Howl group.
		          var ids = self._howls[i]._getSoundIds();

		          // Loop through all sounds and mark the audio node as muted.
		          for (var j=0; j<ids.length; j++) {
		            var sound = self._howls[i]._soundById(ids[j]);

		            if (sound && sound._node) {
		              sound._node.muted = (muted) ? true : sound._muted;
		            }
		          }
		        }
		      }

		      return self;
		    },

		    /**
		     * Handle stopping all sounds globally.
		     */
		    stop: function() {
		      var self = this || Howler;

		      // Loop through all Howls and stop them.
		      for (var i=0; i<self._howls.length; i++) {
		        self._howls[i].stop();
		      }

		      return self;
		    },

		    /**
		     * Unload and destroy all currently loaded Howl objects.
		     * @return {Howler}
		     */
		    unload: function() {
		      var self = this || Howler;

		      for (var i=self._howls.length-1; i>=0; i--) {
		        self._howls[i].unload();
		      }

		      // Create a new AudioContext to make sure it is fully reset.
		      if (self.usingWebAudio && self.ctx && typeof self.ctx.close !== 'undefined') {
		        self.ctx.close();
		        self.ctx = null;
		        setupAudioContext();
		      }

		      return self;
		    },

		    /**
		     * Check for codec support of specific extension.
		     * @param  {String} ext Audio file extention.
		     * @return {Boolean}
		     */
		    codecs: function(ext) {
		      return (this || Howler)._codecs[ext.replace(/^x-/, '')];
		    },

		    /**
		     * Setup various state values for global tracking.
		     * @return {Howler}
		     */
		    _setup: function() {
		      var self = this || Howler;

		      // Keeps track of the suspend/resume state of the AudioContext.
		      self.state = self.ctx ? self.ctx.state || 'suspended' : 'suspended';

		      // Automatically begin the 30-second suspend process
		      self._autoSuspend();

		      // Check if audio is available.
		      if (!self.usingWebAudio) {
		        // No audio is available on this system if noAudio is set to true.
		        if (typeof Audio !== 'undefined') {
		          try {
		            var test = new Audio();

		            // Check if the canplaythrough event is available.
		            if (typeof test.oncanplaythrough === 'undefined') {
		              self._canPlayEvent = 'canplay';
		            }
		          } catch(e) {
		            self.noAudio = true;
		          }
		        } else {
		          self.noAudio = true;
		        }
		      }

		      // Test to make sure audio isn't disabled in Internet Explorer.
		      try {
		        var test = new Audio();
		        if (test.muted) {
		          self.noAudio = true;
		        }
		      } catch (e) {}

		      // Check for supported codecs.
		      if (!self.noAudio) {
		        self._setupCodecs();
		      }

		      return self;
		    },

		    /**
		     * Check for browser support for various codecs and cache the results.
		     * @return {Howler}
		     */
		    _setupCodecs: function() {
		      var self = this || Howler;
		      var audioTest = null;

		      // Must wrap in a try/catch because IE11 in server mode throws an error.
		      try {
		        audioTest = (typeof Audio !== 'undefined') ? new Audio() : null;
		      } catch (err) {
		        return self;
		      }

		      if (!audioTest || typeof audioTest.canPlayType !== 'function') {
		        return self;
		      }

		      var mpegTest = audioTest.canPlayType('audio/mpeg;').replace(/^no$/, '');

		      // Opera version <33 has mixed MP3 support, so we need to check for and block it.
		      var ua = self._navigator ? self._navigator.userAgent : '';
		      var checkOpera = ua.match(/OPR\/([0-6].)/g);
		      var isOldOpera = (checkOpera && parseInt(checkOpera[0].split('/')[1], 10) < 33);
		      var checkSafari = ua.indexOf('Safari') !== -1 && ua.indexOf('Chrome') === -1;
		      var safariVersion = ua.match(/Version\/(.*?) /);
		      var isOldSafari = (checkSafari && safariVersion && parseInt(safariVersion[1], 10) < 15);

		      self._codecs = {
		        mp3: !!(!isOldOpera && (mpegTest || audioTest.canPlayType('audio/mp3;').replace(/^no$/, ''))),
		        mpeg: !!mpegTest,
		        opus: !!audioTest.canPlayType('audio/ogg; codecs="opus"').replace(/^no$/, ''),
		        ogg: !!audioTest.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, ''),
		        oga: !!audioTest.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, ''),
		        wav: !!(audioTest.canPlayType('audio/wav; codecs="1"') || audioTest.canPlayType('audio/wav')).replace(/^no$/, ''),
		        aac: !!audioTest.canPlayType('audio/aac;').replace(/^no$/, ''),
		        caf: !!audioTest.canPlayType('audio/x-caf;').replace(/^no$/, ''),
		        m4a: !!(audioTest.canPlayType('audio/x-m4a;') || audioTest.canPlayType('audio/m4a;') || audioTest.canPlayType('audio/aac;')).replace(/^no$/, ''),
		        m4b: !!(audioTest.canPlayType('audio/x-m4b;') || audioTest.canPlayType('audio/m4b;') || audioTest.canPlayType('audio/aac;')).replace(/^no$/, ''),
		        mp4: !!(audioTest.canPlayType('audio/x-mp4;') || audioTest.canPlayType('audio/mp4;') || audioTest.canPlayType('audio/aac;')).replace(/^no$/, ''),
		        weba: !!(!isOldSafari && audioTest.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/, '')),
		        webm: !!(!isOldSafari && audioTest.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/, '')),
		        dolby: !!audioTest.canPlayType('audio/mp4; codecs="ec-3"').replace(/^no$/, ''),
		        flac: !!(audioTest.canPlayType('audio/x-flac;') || audioTest.canPlayType('audio/flac;')).replace(/^no$/, '')
		      };

		      return self;
		    },

		    /**
		     * Some browsers/devices will only allow audio to be played after a user interaction.
		     * Attempt to automatically unlock audio on the first user interaction.
		     * Concept from: http://paulbakaus.com/tutorials/html5/web-audio-on-ios/
		     * @return {Howler}
		     */
		    _unlockAudio: function() {
		      var self = this || Howler;

		      // Only run this if Web Audio is supported and it hasn't already been unlocked.
		      if (self._audioUnlocked || !self.ctx) {
		        return;
		      }

		      self._audioUnlocked = false;
		      self.autoUnlock = false;

		      // Some mobile devices/platforms have distortion issues when opening/closing tabs and/or web views.
		      // Bugs in the browser (especially Mobile Safari) can cause the sampleRate to change from 44100 to 48000.
		      // By calling Howler.unload(), we create a new AudioContext with the correct sampleRate.
		      if (!self._mobileUnloaded && self.ctx.sampleRate !== 44100) {
		        self._mobileUnloaded = true;
		        self.unload();
		      }

		      // Scratch buffer for enabling iOS to dispose of web audio buffers correctly, as per:
		      // http://stackoverflow.com/questions/24119684
		      self._scratchBuffer = self.ctx.createBuffer(1, 1, 22050);

		      // Call this method on touch start to create and play a buffer,
		      // then check if the audio actually played to determine if
		      // audio has now been unlocked on iOS, Android, etc.
		      var unlock = function(e) {
		        // Create a pool of unlocked HTML5 Audio objects that can
		        // be used for playing sounds without user interaction. HTML5
		        // Audio objects must be individually unlocked, as opposed
		        // to the WebAudio API which only needs a single activation.
		        // This must occur before WebAudio setup or the source.onended
		        // event will not fire.
		        while (self._html5AudioPool.length < self.html5PoolSize) {
		          try {
		            var audioNode = new Audio();

		            // Mark this Audio object as unlocked to ensure it can get returned
		            // to the unlocked pool when released.
		            audioNode._unlocked = true;

		            // Add the audio node to the pool.
		            self._releaseHtml5Audio(audioNode);
		          } catch (e) {
		            self.noAudio = true;
		            break;
		          }
		        }

		        // Loop through any assigned audio nodes and unlock them.
		        for (var i=0; i<self._howls.length; i++) {
		          if (!self._howls[i]._webAudio) {
		            // Get all of the sounds in this Howl group.
		            var ids = self._howls[i]._getSoundIds();

		            // Loop through all sounds and unlock the audio nodes.
		            for (var j=0; j<ids.length; j++) {
		              var sound = self._howls[i]._soundById(ids[j]);

		              if (sound && sound._node && !sound._node._unlocked) {
		                sound._node._unlocked = true;
		                sound._node.load();
		              }
		            }
		          }
		        }

		        // Fix Android can not play in suspend state.
		        self._autoResume();

		        // Create an empty buffer.
		        var source = self.ctx.createBufferSource();
		        source.buffer = self._scratchBuffer;
		        source.connect(self.ctx.destination);

		        // Play the empty buffer.
		        if (typeof source.start === 'undefined') {
		          source.noteOn(0);
		        } else {
		          source.start(0);
		        }

		        // Calling resume() on a stack initiated by user gesture is what actually unlocks the audio on Android Chrome >= 55.
		        if (typeof self.ctx.resume === 'function') {
		          self.ctx.resume();
		        }

		        // Setup a timeout to check that we are unlocked on the next event loop.
		        source.onended = function() {
		          source.disconnect(0);

		          // Update the unlocked state and prevent this check from happening again.
		          self._audioUnlocked = true;

		          // Remove the touch start listener.
		          document.removeEventListener('touchstart', unlock, true);
		          document.removeEventListener('touchend', unlock, true);
		          document.removeEventListener('click', unlock, true);
		          document.removeEventListener('keydown', unlock, true);

		          // Let all sounds know that audio has been unlocked.
		          for (var i=0; i<self._howls.length; i++) {
		            self._howls[i]._emit('unlock');
		          }
		        };
		      };

		      // Setup a touch start listener to attempt an unlock in.
		      document.addEventListener('touchstart', unlock, true);
		      document.addEventListener('touchend', unlock, true);
		      document.addEventListener('click', unlock, true);
		      document.addEventListener('keydown', unlock, true);

		      return self;
		    },

		    /**
		     * Get an unlocked HTML5 Audio object from the pool. If none are left,
		     * return a new Audio object and throw a warning.
		     * @return {Audio} HTML5 Audio object.
		     */
		    _obtainHtml5Audio: function() {
		      var self = this || Howler;

		      // Return the next object from the pool if one exists.
		      if (self._html5AudioPool.length) {
		        return self._html5AudioPool.pop();
		      }

		      //.Check if the audio is locked and throw a warning.
		      var testPlay = new Audio().play();
		      if (testPlay && typeof Promise !== 'undefined' && (testPlay instanceof Promise || typeof testPlay.then === 'function')) {
		        testPlay.catch(function() {
		          console.warn('HTML5 Audio pool exhausted, returning potentially locked audio object.');
		        });
		      }

		      return new Audio();
		    },

		    /**
		     * Return an activated HTML5 Audio object to the pool.
		     * @return {Howler}
		     */
		    _releaseHtml5Audio: function(audio) {
		      var self = this || Howler;

		      // Don't add audio to the pool if we don't know if it has been unlocked.
		      if (audio._unlocked) {
		        self._html5AudioPool.push(audio);
		      }

		      return self;
		    },

		    /**
		     * Automatically suspend the Web Audio AudioContext after no sound has played for 30 seconds.
		     * This saves processing/energy and fixes various browser-specific bugs with audio getting stuck.
		     * @return {Howler}
		     */
		    _autoSuspend: function() {
		      var self = this;

		      if (!self.autoSuspend || !self.ctx || typeof self.ctx.suspend === 'undefined' || !Howler.usingWebAudio) {
		        return;
		      }

		      // Check if any sounds are playing.
		      for (var i=0; i<self._howls.length; i++) {
		        if (self._howls[i]._webAudio) {
		          for (var j=0; j<self._howls[i]._sounds.length; j++) {
		            if (!self._howls[i]._sounds[j]._paused) {
		              return self;
		            }
		          }
		        }
		      }

		      if (self._suspendTimer) {
		        clearTimeout(self._suspendTimer);
		      }

		      // If no sound has played after 30 seconds, suspend the context.
		      self._suspendTimer = setTimeout(function() {
		        if (!self.autoSuspend) {
		          return;
		        }

		        self._suspendTimer = null;
		        self.state = 'suspending';

		        // Handle updating the state of the audio context after suspending.
		        var handleSuspension = function() {
		          self.state = 'suspended';

		          if (self._resumeAfterSuspend) {
		            delete self._resumeAfterSuspend;
		            self._autoResume();
		          }
		        };

		        // Either the state gets suspended or it is interrupted.
		        // Either way, we need to update the state to suspended.
		        self.ctx.suspend().then(handleSuspension, handleSuspension);
		      }, 30000);

		      return self;
		    },

		    /**
		     * Automatically resume the Web Audio AudioContext when a new sound is played.
		     * @return {Howler}
		     */
		    _autoResume: function() {
		      var self = this;

		      if (!self.ctx || typeof self.ctx.resume === 'undefined' || !Howler.usingWebAudio) {
		        return;
		      }

		      if (self.state === 'running' && self.ctx.state !== 'interrupted' && self._suspendTimer) {
		        clearTimeout(self._suspendTimer);
		        self._suspendTimer = null;
		      } else if (self.state === 'suspended' || self.state === 'running' && self.ctx.state === 'interrupted') {
		        self.ctx.resume().then(function() {
		          self.state = 'running';

		          // Emit to all Howls that the audio has resumed.
		          for (var i=0; i<self._howls.length; i++) {
		            self._howls[i]._emit('resume');
		          }
		        });

		        if (self._suspendTimer) {
		          clearTimeout(self._suspendTimer);
		          self._suspendTimer = null;
		        }
		      } else if (self.state === 'suspending') {
		        self._resumeAfterSuspend = true;
		      }

		      return self;
		    }
		  };

		  // Setup the global audio controller.
		  var Howler = new HowlerGlobal();

		  /** Group Methods **/
		  /***************************************************************************/

		  /**
		   * Create an audio group controller.
		   * @param {Object} o Passed in properties for this group.
		   */
		  var Howl = function(o) {
		    var self = this;

		    // Throw an error if no source is provided.
		    if (!o.src || o.src.length === 0) {
		      console.error('An array of source files must be passed with any new Howl.');
		      return;
		    }

		    self.init(o);
		  };
		  Howl.prototype = {
		    /**
		     * Initialize a new Howl group object.
		     * @param  {Object} o Passed in properties for this group.
		     * @return {Howl}
		     */
		    init: function(o) {
		      var self = this;

		      // If we don't have an AudioContext created yet, run the setup.
		      if (!Howler.ctx) {
		        setupAudioContext();
		      }

		      // Setup user-defined default properties.
		      self._autoplay = o.autoplay || false;
		      self._format = (typeof o.format !== 'string') ? o.format : [o.format];
		      self._html5 = o.html5 || false;
		      self._muted = o.mute || false;
		      self._loop = o.loop || false;
		      self._pool = o.pool || 5;
		      self._preload = (typeof o.preload === 'boolean' || o.preload === 'metadata') ? o.preload : true;
		      self._rate = o.rate || 1;
		      self._sprite = o.sprite || {};
		      self._src = (typeof o.src !== 'string') ? o.src : [o.src];
		      self._volume = o.volume !== undefined ? o.volume : 1;
		      self._xhr = {
		        method: o.xhr && o.xhr.method ? o.xhr.method : 'GET',
		        headers: o.xhr && o.xhr.headers ? o.xhr.headers : null,
		        withCredentials: o.xhr && o.xhr.withCredentials ? o.xhr.withCredentials : false,
		      };

		      // Setup all other default properties.
		      self._duration = 0;
		      self._state = 'unloaded';
		      self._sounds = [];
		      self._endTimers = {};
		      self._queue = [];
		      self._playLock = false;

		      // Setup event listeners.
		      self._onend = o.onend ? [{fn: o.onend}] : [];
		      self._onfade = o.onfade ? [{fn: o.onfade}] : [];
		      self._onload = o.onload ? [{fn: o.onload}] : [];
		      self._onloaderror = o.onloaderror ? [{fn: o.onloaderror}] : [];
		      self._onplayerror = o.onplayerror ? [{fn: o.onplayerror}] : [];
		      self._onpause = o.onpause ? [{fn: o.onpause}] : [];
		      self._onplay = o.onplay ? [{fn: o.onplay}] : [];
		      self._onstop = o.onstop ? [{fn: o.onstop}] : [];
		      self._onmute = o.onmute ? [{fn: o.onmute}] : [];
		      self._onvolume = o.onvolume ? [{fn: o.onvolume}] : [];
		      self._onrate = o.onrate ? [{fn: o.onrate}] : [];
		      self._onseek = o.onseek ? [{fn: o.onseek}] : [];
		      self._onunlock = o.onunlock ? [{fn: o.onunlock}] : [];
		      self._onresume = [];

		      // Web Audio or HTML5 Audio?
		      self._webAudio = Howler.usingWebAudio && !self._html5;

		      // Automatically try to enable audio.
		      if (typeof Howler.ctx !== 'undefined' && Howler.ctx && Howler.autoUnlock) {
		        Howler._unlockAudio();
		      }

		      // Keep track of this Howl group in the global controller.
		      Howler._howls.push(self);

		      // If they selected autoplay, add a play event to the load queue.
		      if (self._autoplay) {
		        self._queue.push({
		          event: 'play',
		          action: function() {
		            self.play();
		          }
		        });
		      }

		      // Load the source file unless otherwise specified.
		      if (self._preload && self._preload !== 'none') {
		        self.load();
		      }

		      return self;
		    },

		    /**
		     * Load the audio file.
		     * @return {Howler}
		     */
		    load: function() {
		      var self = this;
		      var url = null;

		      // If no audio is available, quit immediately.
		      if (Howler.noAudio) {
		        self._emit('loaderror', null, 'No audio support.');
		        return;
		      }

		      // Make sure our source is in an array.
		      if (typeof self._src === 'string') {
		        self._src = [self._src];
		      }

		      // Loop through the sources and pick the first one that is compatible.
		      for (var i=0; i<self._src.length; i++) {
		        var ext, str;

		        if (self._format && self._format[i]) {
		          // If an extension was specified, use that instead.
		          ext = self._format[i];
		        } else {
		          // Make sure the source is a string.
		          str = self._src[i];
		          if (typeof str !== 'string') {
		            self._emit('loaderror', null, 'Non-string found in selected audio sources - ignoring.');
		            continue;
		          }

		          // Extract the file extension from the URL or base64 data URI.
		          ext = /^data:audio\/([^;,]+);/i.exec(str);
		          if (!ext) {
		            ext = /\.([^.]+)$/.exec(str.split('?', 1)[0]);
		          }

		          if (ext) {
		            ext = ext[1].toLowerCase();
		          }
		        }

		        // Log a warning if no extension was found.
		        if (!ext) {
		          console.warn('No file extension was found. Consider using the "format" property or specify an extension.');
		        }

		        // Check if this extension is available.
		        if (ext && Howler.codecs(ext)) {
		          url = self._src[i];
		          break;
		        }
		      }

		      if (!url) {
		        self._emit('loaderror', null, 'No codec support for selected audio sources.');
		        return;
		      }

		      self._src = url;
		      self._state = 'loading';

		      // If the hosting page is HTTPS and the source isn't,
		      // drop down to HTML5 Audio to avoid Mixed Content errors.
		      if (window.location.protocol === 'https:' && url.slice(0, 5) === 'http:') {
		        self._html5 = true;
		        self._webAudio = false;
		      }

		      // Create a new sound object and add it to the pool.
		      new Sound(self);

		      // Load and decode the audio data for playback.
		      if (self._webAudio) {
		        loadBuffer(self);
		      }

		      return self;
		    },

		    /**
		     * Play a sound or resume previous playback.
		     * @param  {String/Number} sprite   Sprite name for sprite playback or sound id to continue previous.
		     * @param  {Boolean} internal Internal Use: true prevents event firing.
		     * @return {Number}          Sound ID.
		     */
		    play: function(sprite, internal) {
		      var self = this;
		      var id = null;

		      // Determine if a sprite, sound id or nothing was passed
		      if (typeof sprite === 'number') {
		        id = sprite;
		        sprite = null;
		      } else if (typeof sprite === 'string' && self._state === 'loaded' && !self._sprite[sprite]) {
		        // If the passed sprite doesn't exist, do nothing.
		        return null;
		      } else if (typeof sprite === 'undefined') {
		        // Use the default sound sprite (plays the full audio length).
		        sprite = '__default';

		        // Check if there is a single paused sound that isn't ended.
		        // If there is, play that sound. If not, continue as usual.
		        if (!self._playLock) {
		          var num = 0;
		          for (var i=0; i<self._sounds.length; i++) {
		            if (self._sounds[i]._paused && !self._sounds[i]._ended) {
		              num++;
		              id = self._sounds[i]._id;
		            }
		          }

		          if (num === 1) {
		            sprite = null;
		          } else {
		            id = null;
		          }
		        }
		      }

		      // Get the selected node, or get one from the pool.
		      var sound = id ? self._soundById(id) : self._inactiveSound();

		      // If the sound doesn't exist, do nothing.
		      if (!sound) {
		        return null;
		      }

		      // Select the sprite definition.
		      if (id && !sprite) {
		        sprite = sound._sprite || '__default';
		      }

		      // If the sound hasn't loaded, we must wait to get the audio's duration.
		      // We also need to wait to make sure we don't run into race conditions with
		      // the order of function calls.
		      if (self._state !== 'loaded') {
		        // Set the sprite value on this sound.
		        sound._sprite = sprite;

		        // Mark this sound as not ended in case another sound is played before this one loads.
		        sound._ended = false;

		        // Add the sound to the queue to be played on load.
		        var soundId = sound._id;
		        self._queue.push({
		          event: 'play',
		          action: function() {
		            self.play(soundId);
		          }
		        });

		        return soundId;
		      }

		      // Don't play the sound if an id was passed and it is already playing.
		      if (id && !sound._paused) {
		        // Trigger the play event, in order to keep iterating through queue.
		        if (!internal) {
		          self._loadQueue('play');
		        }

		        return sound._id;
		      }

		      // Make sure the AudioContext isn't suspended, and resume it if it is.
		      if (self._webAudio) {
		        Howler._autoResume();
		      }

		      // Determine how long to play for and where to start playing.
		      var seek = Math.max(0, sound._seek > 0 ? sound._seek : self._sprite[sprite][0] / 1000);
		      var duration = Math.max(0, ((self._sprite[sprite][0] + self._sprite[sprite][1]) / 1000) - seek);
		      var timeout = (duration * 1000) / Math.abs(sound._rate);
		      var start = self._sprite[sprite][0] / 1000;
		      var stop = (self._sprite[sprite][0] + self._sprite[sprite][1]) / 1000;
		      sound._sprite = sprite;

		      // Mark the sound as ended instantly so that this async playback
		      // doesn't get grabbed by another call to play while this one waits to start.
		      sound._ended = false;

		      // Update the parameters of the sound.
		      var setParams = function() {
		        sound._paused = false;
		        sound._seek = seek;
		        sound._start = start;
		        sound._stop = stop;
		        sound._loop = !!(sound._loop || self._sprite[sprite][2]);
		      };

		      // End the sound instantly if seek is at the end.
		      if (seek >= stop) {
		        self._ended(sound);
		        return;
		      }

		      // Begin the actual playback.
		      var node = sound._node;
		      if (self._webAudio) {
		        // Fire this when the sound is ready to play to begin Web Audio playback.
		        var playWebAudio = function() {
		          self._playLock = false;
		          setParams();
		          self._refreshBuffer(sound);

		          // Setup the playback params.
		          var vol = (sound._muted || self._muted) ? 0 : sound._volume;
		          node.gain.setValueAtTime(vol, Howler.ctx.currentTime);
		          sound._playStart = Howler.ctx.currentTime;

		          // Play the sound using the supported method.
		          if (typeof node.bufferSource.start === 'undefined') {
		            sound._loop ? node.bufferSource.noteGrainOn(0, seek, 86400) : node.bufferSource.noteGrainOn(0, seek, duration);
		          } else {
		            sound._loop ? node.bufferSource.start(0, seek, 86400) : node.bufferSource.start(0, seek, duration);
		          }

		          // Start a new timer if none is present.
		          if (timeout !== Infinity) {
		            self._endTimers[sound._id] = setTimeout(self._ended.bind(self, sound), timeout);
		          }

		          if (!internal) {
		            setTimeout(function() {
		              self._emit('play', sound._id);
		              self._loadQueue();
		            }, 0);
		          }
		        };

		        if (Howler.state === 'running' && Howler.ctx.state !== 'interrupted') {
		          playWebAudio();
		        } else {
		          self._playLock = true;

		          // Wait for the audio context to resume before playing.
		          self.once('resume', playWebAudio);

		          // Cancel the end timer.
		          self._clearTimer(sound._id);
		        }
		      } else {
		        // Fire this when the sound is ready to play to begin HTML5 Audio playback.
		        var playHtml5 = function() {
		          node.currentTime = seek;
		          node.muted = sound._muted || self._muted || Howler._muted || node.muted;
		          node.volume = sound._volume * Howler.volume();
		          node.playbackRate = sound._rate;

		          // Some browsers will throw an error if this is called without user interaction.
		          try {
		            var play = node.play();

		            // Support older browsers that don't support promises, and thus don't have this issue.
		            if (play && typeof Promise !== 'undefined' && (play instanceof Promise || typeof play.then === 'function')) {
		              // Implements a lock to prevent DOMException: The play() request was interrupted by a call to pause().
		              self._playLock = true;

		              // Set param values immediately.
		              setParams();

		              // Releases the lock and executes queued actions.
		              play
		                .then(function() {
		                  self._playLock = false;
		                  node._unlocked = true;
		                  if (!internal) {
		                    self._emit('play', sound._id);
		                  } else {
		                    self._loadQueue();
		                  }
		                })
		                .catch(function() {
		                  self._playLock = false;
		                  self._emit('playerror', sound._id, 'Playback was unable to start. This is most commonly an issue ' +
		                    'on mobile devices and Chrome where playback was not within a user interaction.');

		                  // Reset the ended and paused values.
		                  sound._ended = true;
		                  sound._paused = true;
		                });
		            } else if (!internal) {
		              self._playLock = false;
		              setParams();
		              self._emit('play', sound._id);
		            }

		            // Setting rate before playing won't work in IE, so we set it again here.
		            node.playbackRate = sound._rate;

		            // If the node is still paused, then we can assume there was a playback issue.
		            if (node.paused) {
		              self._emit('playerror', sound._id, 'Playback was unable to start. This is most commonly an issue ' +
		                'on mobile devices and Chrome where playback was not within a user interaction.');
		              return;
		            }

		            // Setup the end timer on sprites or listen for the ended event.
		            if (sprite !== '__default' || sound._loop) {
		              self._endTimers[sound._id] = setTimeout(self._ended.bind(self, sound), timeout);
		            } else {
		              self._endTimers[sound._id] = function() {
		                // Fire ended on this audio node.
		                self._ended(sound);

		                // Clear this listener.
		                node.removeEventListener('ended', self._endTimers[sound._id], false);
		              };
		              node.addEventListener('ended', self._endTimers[sound._id], false);
		            }
		          } catch (err) {
		            self._emit('playerror', sound._id, err);
		          }
		        };

		        // If this is streaming audio, make sure the src is set and load again.
		        if (node.src === 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA') {
		          node.src = self._src;
		          node.load();
		        }

		        // Play immediately if ready, or wait for the 'canplaythrough'e vent.
		        var loadedNoReadyState = (window && window.ejecta) || (!node.readyState && Howler._navigator.isCocoonJS);
		        if (node.readyState >= 3 || loadedNoReadyState) {
		          playHtml5();
		        } else {
		          self._playLock = true;
		          self._state = 'loading';

		          var listener = function() {
		            self._state = 'loaded';
		            
		            // Begin playback.
		            playHtml5();

		            // Clear this listener.
		            node.removeEventListener(Howler._canPlayEvent, listener, false);
		          };
		          node.addEventListener(Howler._canPlayEvent, listener, false);

		          // Cancel the end timer.
		          self._clearTimer(sound._id);
		        }
		      }

		      return sound._id;
		    },

		    /**
		     * Pause playback and save current position.
		     * @param  {Number} id The sound ID (empty to pause all in group).
		     * @return {Howl}
		     */
		    pause: function(id) {
		      var self = this;

		      // If the sound hasn't loaded or a play() promise is pending, add it to the load queue to pause when capable.
		      if (self._state !== 'loaded' || self._playLock) {
		        self._queue.push({
		          event: 'pause',
		          action: function() {
		            self.pause(id);
		          }
		        });

		        return self;
		      }

		      // If no id is passed, get all ID's to be paused.
		      var ids = self._getSoundIds(id);

		      for (var i=0; i<ids.length; i++) {
		        // Clear the end timer.
		        self._clearTimer(ids[i]);

		        // Get the sound.
		        var sound = self._soundById(ids[i]);

		        if (sound && !sound._paused) {
		          // Reset the seek position.
		          sound._seek = self.seek(ids[i]);
		          sound._rateSeek = 0;
		          sound._paused = true;

		          // Stop currently running fades.
		          self._stopFade(ids[i]);

		          if (sound._node) {
		            if (self._webAudio) {
		              // Make sure the sound has been created.
		              if (!sound._node.bufferSource) {
		                continue;
		              }

		              if (typeof sound._node.bufferSource.stop === 'undefined') {
		                sound._node.bufferSource.noteOff(0);
		              } else {
		                sound._node.bufferSource.stop(0);
		              }

		              // Clean up the buffer source.
		              self._cleanBuffer(sound._node);
		            } else if (!isNaN(sound._node.duration) || sound._node.duration === Infinity) {
		              sound._node.pause();
		            }
		          }
		        }

		        // Fire the pause event, unless `true` is passed as the 2nd argument.
		        if (!arguments[1]) {
		          self._emit('pause', sound ? sound._id : null);
		        }
		      }

		      return self;
		    },

		    /**
		     * Stop playback and reset to start.
		     * @param  {Number} id The sound ID (empty to stop all in group).
		     * @param  {Boolean} internal Internal Use: true prevents event firing.
		     * @return {Howl}
		     */
		    stop: function(id, internal) {
		      var self = this;

		      // If the sound hasn't loaded, add it to the load queue to stop when capable.
		      if (self._state !== 'loaded' || self._playLock) {
		        self._queue.push({
		          event: 'stop',
		          action: function() {
		            self.stop(id);
		          }
		        });

		        return self;
		      }

		      // If no id is passed, get all ID's to be stopped.
		      var ids = self._getSoundIds(id);

		      for (var i=0; i<ids.length; i++) {
		        // Clear the end timer.
		        self._clearTimer(ids[i]);

		        // Get the sound.
		        var sound = self._soundById(ids[i]);

		        if (sound) {
		          // Reset the seek position.
		          sound._seek = sound._start || 0;
		          sound._rateSeek = 0;
		          sound._paused = true;
		          sound._ended = true;

		          // Stop currently running fades.
		          self._stopFade(ids[i]);

		          if (sound._node) {
		            if (self._webAudio) {
		              // Make sure the sound's AudioBufferSourceNode has been created.
		              if (sound._node.bufferSource) {
		                if (typeof sound._node.bufferSource.stop === 'undefined') {
		                  sound._node.bufferSource.noteOff(0);
		                } else {
		                  sound._node.bufferSource.stop(0);
		                }

		                // Clean up the buffer source.
		                self._cleanBuffer(sound._node);
		              }
		            } else if (!isNaN(sound._node.duration) || sound._node.duration === Infinity) {
		              sound._node.currentTime = sound._start || 0;
		              sound._node.pause();

		              // If this is a live stream, stop download once the audio is stopped.
		              if (sound._node.duration === Infinity) {
		                self._clearSound(sound._node);
		              }
		            }
		          }

		          if (!internal) {
		            self._emit('stop', sound._id);
		          }
		        }
		      }

		      return self;
		    },

		    /**
		     * Mute/unmute a single sound or all sounds in this Howl group.
		     * @param  {Boolean} muted Set to true to mute and false to unmute.
		     * @param  {Number} id    The sound ID to update (omit to mute/unmute all).
		     * @return {Howl}
		     */
		    mute: function(muted, id) {
		      var self = this;

		      // If the sound hasn't loaded, add it to the load queue to mute when capable.
		      if (self._state !== 'loaded'|| self._playLock) {
		        self._queue.push({
		          event: 'mute',
		          action: function() {
		            self.mute(muted, id);
		          }
		        });

		        return self;
		      }

		      // If applying mute/unmute to all sounds, update the group's value.
		      if (typeof id === 'undefined') {
		        if (typeof muted === 'boolean') {
		          self._muted = muted;
		        } else {
		          return self._muted;
		        }
		      }

		      // If no id is passed, get all ID's to be muted.
		      var ids = self._getSoundIds(id);

		      for (var i=0; i<ids.length; i++) {
		        // Get the sound.
		        var sound = self._soundById(ids[i]);

		        if (sound) {
		          sound._muted = muted;

		          // Cancel active fade and set the volume to the end value.
		          if (sound._interval) {
		            self._stopFade(sound._id);
		          }

		          if (self._webAudio && sound._node) {
		            sound._node.gain.setValueAtTime(muted ? 0 : sound._volume, Howler.ctx.currentTime);
		          } else if (sound._node) {
		            sound._node.muted = Howler._muted ? true : muted;
		          }

		          self._emit('mute', sound._id);
		        }
		      }

		      return self;
		    },

		    /**
		     * Get/set the volume of this sound or of the Howl group. This method can optionally take 0, 1 or 2 arguments.
		     *   volume() -> Returns the group's volume value.
		     *   volume(id) -> Returns the sound id's current volume.
		     *   volume(vol) -> Sets the volume of all sounds in this Howl group.
		     *   volume(vol, id) -> Sets the volume of passed sound id.
		     * @return {Howl/Number} Returns self or current volume.
		     */
		    volume: function() {
		      var self = this;
		      var args = arguments;
		      var vol, id;

		      // Determine the values based on arguments.
		      if (args.length === 0) {
		        // Return the value of the groups' volume.
		        return self._volume;
		      } else if (args.length === 1 || args.length === 2 && typeof args[1] === 'undefined') {
		        // First check if this is an ID, and if not, assume it is a new volume.
		        var ids = self._getSoundIds();
		        var index = ids.indexOf(args[0]);
		        if (index >= 0) {
		          id = parseInt(args[0], 10);
		        } else {
		          vol = parseFloat(args[0]);
		        }
		      } else if (args.length >= 2) {
		        vol = parseFloat(args[0]);
		        id = parseInt(args[1], 10);
		      }

		      // Update the volume or return the current volume.
		      var sound;
		      if (typeof vol !== 'undefined' && vol >= 0 && vol <= 1) {
		        // If the sound hasn't loaded, add it to the load queue to change volume when capable.
		        if (self._state !== 'loaded'|| self._playLock) {
		          self._queue.push({
		            event: 'volume',
		            action: function() {
		              self.volume.apply(self, args);
		            }
		          });

		          return self;
		        }

		        // Set the group volume.
		        if (typeof id === 'undefined') {
		          self._volume = vol;
		        }

		        // Update one or all volumes.
		        id = self._getSoundIds(id);
		        for (var i=0; i<id.length; i++) {
		          // Get the sound.
		          sound = self._soundById(id[i]);

		          if (sound) {
		            sound._volume = vol;

		            // Stop currently running fades.
		            if (!args[2]) {
		              self._stopFade(id[i]);
		            }

		            if (self._webAudio && sound._node && !sound._muted) {
		              sound._node.gain.setValueAtTime(vol, Howler.ctx.currentTime);
		            } else if (sound._node && !sound._muted) {
		              sound._node.volume = vol * Howler.volume();
		            }

		            self._emit('volume', sound._id);
		          }
		        }
		      } else {
		        sound = id ? self._soundById(id) : self._sounds[0];
		        return sound ? sound._volume : 0;
		      }

		      return self;
		    },

		    /**
		     * Fade a currently playing sound between two volumes (if no id is passed, all sounds will fade).
		     * @param  {Number} from The value to fade from (0.0 to 1.0).
		     * @param  {Number} to   The volume to fade to (0.0 to 1.0).
		     * @param  {Number} len  Time in milliseconds to fade.
		     * @param  {Number} id   The sound id (omit to fade all sounds).
		     * @return {Howl}
		     */
		    fade: function(from, to, len, id) {
		      var self = this;

		      // If the sound hasn't loaded, add it to the load queue to fade when capable.
		      if (self._state !== 'loaded' || self._playLock) {
		        self._queue.push({
		          event: 'fade',
		          action: function() {
		            self.fade(from, to, len, id);
		          }
		        });

		        return self;
		      }

		      // Make sure the to/from/len values are numbers.
		      from = Math.min(Math.max(0, parseFloat(from)), 1);
		      to = Math.min(Math.max(0, parseFloat(to)), 1);
		      len = parseFloat(len);

		      // Set the volume to the start position.
		      self.volume(from, id);

		      // Fade the volume of one or all sounds.
		      var ids = self._getSoundIds(id);
		      for (var i=0; i<ids.length; i++) {
		        // Get the sound.
		        var sound = self._soundById(ids[i]);

		        // Create a linear fade or fall back to timeouts with HTML5 Audio.
		        if (sound) {
		          // Stop the previous fade if no sprite is being used (otherwise, volume handles this).
		          if (!id) {
		            self._stopFade(ids[i]);
		          }

		          // If we are using Web Audio, let the native methods do the actual fade.
		          if (self._webAudio && !sound._muted) {
		            var currentTime = Howler.ctx.currentTime;
		            var end = currentTime + (len / 1000);
		            sound._volume = from;
		            sound._node.gain.setValueAtTime(from, currentTime);
		            sound._node.gain.linearRampToValueAtTime(to, end);
		          }

		          self._startFadeInterval(sound, from, to, len, ids[i], typeof id === 'undefined');
		        }
		      }

		      return self;
		    },

		    /**
		     * Starts the internal interval to fade a sound.
		     * @param  {Object} sound Reference to sound to fade.
		     * @param  {Number} from The value to fade from (0.0 to 1.0).
		     * @param  {Number} to   The volume to fade to (0.0 to 1.0).
		     * @param  {Number} len  Time in milliseconds to fade.
		     * @param  {Number} id   The sound id to fade.
		     * @param  {Boolean} isGroup   If true, set the volume on the group.
		     */
		    _startFadeInterval: function(sound, from, to, len, id, isGroup) {
		      var self = this;
		      var vol = from;
		      var diff = to - from;
		      var steps = Math.abs(diff / 0.01);
		      var stepLen = Math.max(4, (steps > 0) ? len / steps : len);
		      var lastTick = Date.now();

		      // Store the value being faded to.
		      sound._fadeTo = to;

		      // Update the volume value on each interval tick.
		      sound._interval = setInterval(function() {
		        // Update the volume based on the time since the last tick.
		        var tick = (Date.now() - lastTick) / len;
		        lastTick = Date.now();
		        vol += diff * tick;

		        // Round to within 2 decimal points.
		        vol = Math.round(vol * 100) / 100;

		        // Make sure the volume is in the right bounds.
		        if (diff < 0) {
		          vol = Math.max(to, vol);
		        } else {
		          vol = Math.min(to, vol);
		        }

		        // Change the volume.
		        if (self._webAudio) {
		          sound._volume = vol;
		        } else {
		          self.volume(vol, sound._id, true);
		        }

		        // Set the group's volume.
		        if (isGroup) {
		          self._volume = vol;
		        }

		        // When the fade is complete, stop it and fire event.
		        if ((to < from && vol <= to) || (to > from && vol >= to)) {
		          clearInterval(sound._interval);
		          sound._interval = null;
		          sound._fadeTo = null;
		          self.volume(to, sound._id);
		          self._emit('fade', sound._id);
		        }
		      }, stepLen);
		    },

		    /**
		     * Internal method that stops the currently playing fade when
		     * a new fade starts, volume is changed or the sound is stopped.
		     * @param  {Number} id The sound id.
		     * @return {Howl}
		     */
		    _stopFade: function(id) {
		      var self = this;
		      var sound = self._soundById(id);

		      if (sound && sound._interval) {
		        if (self._webAudio) {
		          sound._node.gain.cancelScheduledValues(Howler.ctx.currentTime);
		        }

		        clearInterval(sound._interval);
		        sound._interval = null;
		        self.volume(sound._fadeTo, id);
		        sound._fadeTo = null;
		        self._emit('fade', id);
		      }

		      return self;
		    },

		    /**
		     * Get/set the loop parameter on a sound. This method can optionally take 0, 1 or 2 arguments.
		     *   loop() -> Returns the group's loop value.
		     *   loop(id) -> Returns the sound id's loop value.
		     *   loop(loop) -> Sets the loop value for all sounds in this Howl group.
		     *   loop(loop, id) -> Sets the loop value of passed sound id.
		     * @return {Howl/Boolean} Returns self or current loop value.
		     */
		    loop: function() {
		      var self = this;
		      var args = arguments;
		      var loop, id, sound;

		      // Determine the values for loop and id.
		      if (args.length === 0) {
		        // Return the grou's loop value.
		        return self._loop;
		      } else if (args.length === 1) {
		        if (typeof args[0] === 'boolean') {
		          loop = args[0];
		          self._loop = loop;
		        } else {
		          // Return this sound's loop value.
		          sound = self._soundById(parseInt(args[0], 10));
		          return sound ? sound._loop : false;
		        }
		      } else if (args.length === 2) {
		        loop = args[0];
		        id = parseInt(args[1], 10);
		      }

		      // If no id is passed, get all ID's to be looped.
		      var ids = self._getSoundIds(id);
		      for (var i=0; i<ids.length; i++) {
		        sound = self._soundById(ids[i]);

		        if (sound) {
		          sound._loop = loop;
		          if (self._webAudio && sound._node && sound._node.bufferSource) {
		            sound._node.bufferSource.loop = loop;
		            if (loop) {
		              sound._node.bufferSource.loopStart = sound._start || 0;
		              sound._node.bufferSource.loopEnd = sound._stop;

		              // If playing, restart playback to ensure looping updates.
		              if (self.playing(ids[i])) {
		                self.pause(ids[i], true);
		                self.play(ids[i], true);
		              }
		            }
		          }
		        }
		      }

		      return self;
		    },

		    /**
		     * Get/set the playback rate of a sound. This method can optionally take 0, 1 or 2 arguments.
		     *   rate() -> Returns the first sound node's current playback rate.
		     *   rate(id) -> Returns the sound id's current playback rate.
		     *   rate(rate) -> Sets the playback rate of all sounds in this Howl group.
		     *   rate(rate, id) -> Sets the playback rate of passed sound id.
		     * @return {Howl/Number} Returns self or the current playback rate.
		     */
		    rate: function() {
		      var self = this;
		      var args = arguments;
		      var rate, id;

		      // Determine the values based on arguments.
		      if (args.length === 0) {
		        // We will simply return the current rate of the first node.
		        id = self._sounds[0]._id;
		      } else if (args.length === 1) {
		        // First check if this is an ID, and if not, assume it is a new rate value.
		        var ids = self._getSoundIds();
		        var index = ids.indexOf(args[0]);
		        if (index >= 0) {
		          id = parseInt(args[0], 10);
		        } else {
		          rate = parseFloat(args[0]);
		        }
		      } else if (args.length === 2) {
		        rate = parseFloat(args[0]);
		        id = parseInt(args[1], 10);
		      }

		      // Update the playback rate or return the current value.
		      var sound;
		      if (typeof rate === 'number') {
		        // If the sound hasn't loaded, add it to the load queue to change playback rate when capable.
		        if (self._state !== 'loaded' || self._playLock) {
		          self._queue.push({
		            event: 'rate',
		            action: function() {
		              self.rate.apply(self, args);
		            }
		          });

		          return self;
		        }

		        // Set the group rate.
		        if (typeof id === 'undefined') {
		          self._rate = rate;
		        }

		        // Update one or all volumes.
		        id = self._getSoundIds(id);
		        for (var i=0; i<id.length; i++) {
		          // Get the sound.
		          sound = self._soundById(id[i]);

		          if (sound) {
		            // Keep track of our position when the rate changed and update the playback
		            // start position so we can properly adjust the seek position for time elapsed.
		            if (self.playing(id[i])) {
		              sound._rateSeek = self.seek(id[i]);
		              sound._playStart = self._webAudio ? Howler.ctx.currentTime : sound._playStart;
		            }
		            sound._rate = rate;

		            // Change the playback rate.
		            if (self._webAudio && sound._node && sound._node.bufferSource) {
		              sound._node.bufferSource.playbackRate.setValueAtTime(rate, Howler.ctx.currentTime);
		            } else if (sound._node) {
		              sound._node.playbackRate = rate;
		            }

		            // Reset the timers.
		            var seek = self.seek(id[i]);
		            var duration = ((self._sprite[sound._sprite][0] + self._sprite[sound._sprite][1]) / 1000) - seek;
		            var timeout = (duration * 1000) / Math.abs(sound._rate);

		            // Start a new end timer if sound is already playing.
		            if (self._endTimers[id[i]] || !sound._paused) {
		              self._clearTimer(id[i]);
		              self._endTimers[id[i]] = setTimeout(self._ended.bind(self, sound), timeout);
		            }

		            self._emit('rate', sound._id);
		          }
		        }
		      } else {
		        sound = self._soundById(id);
		        return sound ? sound._rate : self._rate;
		      }

		      return self;
		    },

		    /**
		     * Get/set the seek position of a sound. This method can optionally take 0, 1 or 2 arguments.
		     *   seek() -> Returns the first sound node's current seek position.
		     *   seek(id) -> Returns the sound id's current seek position.
		     *   seek(seek) -> Sets the seek position of the first sound node.
		     *   seek(seek, id) -> Sets the seek position of passed sound id.
		     * @return {Howl/Number} Returns self or the current seek position.
		     */
		    seek: function() {
		      var self = this;
		      var args = arguments;
		      var seek, id;

		      // Determine the values based on arguments.
		      if (args.length === 0) {
		        // We will simply return the current position of the first node.
		        if (self._sounds.length) {
		          id = self._sounds[0]._id;
		        }
		      } else if (args.length === 1) {
		        // First check if this is an ID, and if not, assume it is a new seek position.
		        var ids = self._getSoundIds();
		        var index = ids.indexOf(args[0]);
		        if (index >= 0) {
		          id = parseInt(args[0], 10);
		        } else if (self._sounds.length) {
		          id = self._sounds[0]._id;
		          seek = parseFloat(args[0]);
		        }
		      } else if (args.length === 2) {
		        seek = parseFloat(args[0]);
		        id = parseInt(args[1], 10);
		      }

		      // If there is no ID, bail out.
		      if (typeof id === 'undefined') {
		        return 0;
		      }

		      // If the sound hasn't loaded, add it to the load queue to seek when capable.
		      if (typeof seek === 'number' && (self._state !== 'loaded' || self._playLock)) {
		        self._queue.push({
		          event: 'seek',
		          action: function() {
		            self.seek.apply(self, args);
		          }
		        });

		        return self;
		      }

		      // Get the sound.
		      var sound = self._soundById(id);

		      if (sound) {
		        if (typeof seek === 'number' && seek >= 0) {
		          // Pause the sound and update position for restarting playback.
		          var playing = self.playing(id);
		          if (playing) {
		            self.pause(id, true);
		          }

		          // Move the position of the track and cancel timer.
		          sound._seek = seek;
		          sound._ended = false;
		          self._clearTimer(id);

		          // Update the seek position for HTML5 Audio.
		          if (!self._webAudio && sound._node && !isNaN(sound._node.duration)) {
		            sound._node.currentTime = seek;
		          }

		          // Seek and emit when ready.
		          var seekAndEmit = function() {
		            // Restart the playback if the sound was playing.
		            if (playing) {
		              self.play(id, true);
		            }

		            self._emit('seek', id);
		          };

		          // Wait for the play lock to be unset before emitting (HTML5 Audio).
		          if (playing && !self._webAudio) {
		            var emitSeek = function() {
		              if (!self._playLock) {
		                seekAndEmit();
		              } else {
		                setTimeout(emitSeek, 0);
		              }
		            };
		            setTimeout(emitSeek, 0);
		          } else {
		            seekAndEmit();
		          }
		        } else {
		          if (self._webAudio) {
		            var realTime = self.playing(id) ? Howler.ctx.currentTime - sound._playStart : 0;
		            var rateSeek = sound._rateSeek ? sound._rateSeek - sound._seek : 0;
		            return sound._seek + (rateSeek + realTime * Math.abs(sound._rate));
		          } else {
		            return sound._node.currentTime;
		          }
		        }
		      }

		      return self;
		    },

		    /**
		     * Check if a specific sound is currently playing or not (if id is provided), or check if at least one of the sounds in the group is playing or not.
		     * @param  {Number}  id The sound id to check. If none is passed, the whole sound group is checked.
		     * @return {Boolean} True if playing and false if not.
		     */
		    playing: function(id) {
		      var self = this;

		      // Check the passed sound ID (if any).
		      if (typeof id === 'number') {
		        var sound = self._soundById(id);
		        return sound ? !sound._paused : false;
		      }

		      // Otherwise, loop through all sounds and check if any are playing.
		      for (var i=0; i<self._sounds.length; i++) {
		        if (!self._sounds[i]._paused) {
		          return true;
		        }
		      }

		      return false;
		    },

		    /**
		     * Get the duration of this sound. Passing a sound id will return the sprite duration.
		     * @param  {Number} id The sound id to check. If none is passed, return full source duration.
		     * @return {Number} Audio duration in seconds.
		     */
		    duration: function(id) {
		      var self = this;
		      var duration = self._duration;

		      // If we pass an ID, get the sound and return the sprite length.
		      var sound = self._soundById(id);
		      if (sound) {
		        duration = self._sprite[sound._sprite][1] / 1000;
		      }

		      return duration;
		    },

		    /**
		     * Returns the current loaded state of this Howl.
		     * @return {String} 'unloaded', 'loading', 'loaded'
		     */
		    state: function() {
		      return this._state;
		    },

		    /**
		     * Unload and destroy the current Howl object.
		     * This will immediately stop all sound instances attached to this group.
		     */
		    unload: function() {
		      var self = this;

		      // Stop playing any active sounds.
		      var sounds = self._sounds;
		      for (var i=0; i<sounds.length; i++) {
		        // Stop the sound if it is currently playing.
		        if (!sounds[i]._paused) {
		          self.stop(sounds[i]._id);
		        }

		        // Remove the source or disconnect.
		        if (!self._webAudio) {
		          // Set the source to 0-second silence to stop any downloading (except in IE).
		          self._clearSound(sounds[i]._node);

		          // Remove any event listeners.
		          sounds[i]._node.removeEventListener('error', sounds[i]._errorFn, false);
		          sounds[i]._node.removeEventListener(Howler._canPlayEvent, sounds[i]._loadFn, false);
		          sounds[i]._node.removeEventListener('ended', sounds[i]._endFn, false);

		          // Release the Audio object back to the pool.
		          Howler._releaseHtml5Audio(sounds[i]._node);
		        }

		        // Empty out all of the nodes.
		        delete sounds[i]._node;

		        // Make sure all timers are cleared out.
		        self._clearTimer(sounds[i]._id);
		      }

		      // Remove the references in the global Howler object.
		      var index = Howler._howls.indexOf(self);
		      if (index >= 0) {
		        Howler._howls.splice(index, 1);
		      }

		      // Delete this sound from the cache (if no other Howl is using it).
		      var remCache = true;
		      for (i=0; i<Howler._howls.length; i++) {
		        if (Howler._howls[i]._src === self._src || self._src.indexOf(Howler._howls[i]._src) >= 0) {
		          remCache = false;
		          break;
		        }
		      }

		      if (cache && remCache) {
		        delete cache[self._src];
		      }

		      // Clear global errors.
		      Howler.noAudio = false;

		      // Clear out `self`.
		      self._state = 'unloaded';
		      self._sounds = [];
		      self = null;

		      return null;
		    },

		    /**
		     * Listen to a custom event.
		     * @param  {String}   event Event name.
		     * @param  {Function} fn    Listener to call.
		     * @param  {Number}   id    (optional) Only listen to events for this sound.
		     * @param  {Number}   once  (INTERNAL) Marks event to fire only once.
		     * @return {Howl}
		     */
		    on: function(event, fn, id, once) {
		      var self = this;
		      var events = self['_on' + event];

		      if (typeof fn === 'function') {
		        events.push(once ? {id: id, fn: fn, once: once} : {id: id, fn: fn});
		      }

		      return self;
		    },

		    /**
		     * Remove a custom event. Call without parameters to remove all events.
		     * @param  {String}   event Event name.
		     * @param  {Function} fn    Listener to remove. Leave empty to remove all.
		     * @param  {Number}   id    (optional) Only remove events for this sound.
		     * @return {Howl}
		     */
		    off: function(event, fn, id) {
		      var self = this;
		      var events = self['_on' + event];
		      var i = 0;

		      // Allow passing just an event and ID.
		      if (typeof fn === 'number') {
		        id = fn;
		        fn = null;
		      }

		      if (fn || id) {
		        // Loop through event store and remove the passed function.
		        for (i=0; i<events.length; i++) {
		          var isId = (id === events[i].id);
		          if (fn === events[i].fn && isId || !fn && isId) {
		            events.splice(i, 1);
		            break;
		          }
		        }
		      } else if (event) {
		        // Clear out all events of this type.
		        self['_on' + event] = [];
		      } else {
		        // Clear out all events of every type.
		        var keys = Object.keys(self);
		        for (i=0; i<keys.length; i++) {
		          if ((keys[i].indexOf('_on') === 0) && Array.isArray(self[keys[i]])) {
		            self[keys[i]] = [];
		          }
		        }
		      }

		      return self;
		    },

		    /**
		     * Listen to a custom event and remove it once fired.
		     * @param  {String}   event Event name.
		     * @param  {Function} fn    Listener to call.
		     * @param  {Number}   id    (optional) Only listen to events for this sound.
		     * @return {Howl}
		     */
		    once: function(event, fn, id) {
		      var self = this;

		      // Setup the event listener.
		      self.on(event, fn, id, 1);

		      return self;
		    },

		    /**
		     * Emit all events of a specific type and pass the sound id.
		     * @param  {String} event Event name.
		     * @param  {Number} id    Sound ID.
		     * @param  {Number} msg   Message to go with event.
		     * @return {Howl}
		     */
		    _emit: function(event, id, msg) {
		      var self = this;
		      var events = self['_on' + event];

		      // Loop through event store and fire all functions.
		      for (var i=events.length-1; i>=0; i--) {
		        // Only fire the listener if the correct ID is used.
		        if (!events[i].id || events[i].id === id || event === 'load') {
		          setTimeout(function(fn) {
		            fn.call(this, id, msg);
		          }.bind(self, events[i].fn), 0);

		          // If this event was setup with `once`, remove it.
		          if (events[i].once) {
		            self.off(event, events[i].fn, events[i].id);
		          }
		        }
		      }

		      // Pass the event type into load queue so that it can continue stepping.
		      self._loadQueue(event);

		      return self;
		    },

		    /**
		     * Queue of actions initiated before the sound has loaded.
		     * These will be called in sequence, with the next only firing
		     * after the previous has finished executing (even if async like play).
		     * @return {Howl}
		     */
		    _loadQueue: function(event) {
		      var self = this;

		      if (self._queue.length > 0) {
		        var task = self._queue[0];

		        // Remove this task if a matching event was passed.
		        if (task.event === event) {
		          self._queue.shift();
		          self._loadQueue();
		        }

		        // Run the task if no event type is passed.
		        if (!event) {
		          task.action();
		        }
		      }

		      return self;
		    },

		    /**
		     * Fired when playback ends at the end of the duration.
		     * @param  {Sound} sound The sound object to work with.
		     * @return {Howl}
		     */
		    _ended: function(sound) {
		      var self = this;
		      var sprite = sound._sprite;

		      // If we are using IE and there was network latency we may be clipping
		      // audio before it completes playing. Lets check the node to make sure it
		      // believes it has completed, before ending the playback.
		      if (!self._webAudio && sound._node && !sound._node.paused && !sound._node.ended && sound._node.currentTime < sound._stop) {
		        setTimeout(self._ended.bind(self, sound), 100);
		        return self;
		      }

		      // Should this sound loop?
		      var loop = !!(sound._loop || self._sprite[sprite][2]);

		      // Fire the ended event.
		      self._emit('end', sound._id);

		      // Restart the playback for HTML5 Audio loop.
		      if (!self._webAudio && loop) {
		        self.stop(sound._id, true).play(sound._id);
		      }

		      // Restart this timer if on a Web Audio loop.
		      if (self._webAudio && loop) {
		        self._emit('play', sound._id);
		        sound._seek = sound._start || 0;
		        sound._rateSeek = 0;
		        sound._playStart = Howler.ctx.currentTime;

		        var timeout = ((sound._stop - sound._start) * 1000) / Math.abs(sound._rate);
		        self._endTimers[sound._id] = setTimeout(self._ended.bind(self, sound), timeout);
		      }

		      // Mark the node as paused.
		      if (self._webAudio && !loop) {
		        sound._paused = true;
		        sound._ended = true;
		        sound._seek = sound._start || 0;
		        sound._rateSeek = 0;
		        self._clearTimer(sound._id);

		        // Clean up the buffer source.
		        self._cleanBuffer(sound._node);

		        // Attempt to auto-suspend AudioContext if no sounds are still playing.
		        Howler._autoSuspend();
		      }

		      // When using a sprite, end the track.
		      if (!self._webAudio && !loop) {
		        self.stop(sound._id, true);
		      }

		      return self;
		    },

		    /**
		     * Clear the end timer for a sound playback.
		     * @param  {Number} id The sound ID.
		     * @return {Howl}
		     */
		    _clearTimer: function(id) {
		      var self = this;

		      if (self._endTimers[id]) {
		        // Clear the timeout or remove the ended listener.
		        if (typeof self._endTimers[id] !== 'function') {
		          clearTimeout(self._endTimers[id]);
		        } else {
		          var sound = self._soundById(id);
		          if (sound && sound._node) {
		            sound._node.removeEventListener('ended', self._endTimers[id], false);
		          }
		        }

		        delete self._endTimers[id];
		      }

		      return self;
		    },

		    /**
		     * Return the sound identified by this ID, or return null.
		     * @param  {Number} id Sound ID
		     * @return {Object}    Sound object or null.
		     */
		    _soundById: function(id) {
		      var self = this;

		      // Loop through all sounds and find the one with this ID.
		      for (var i=0; i<self._sounds.length; i++) {
		        if (id === self._sounds[i]._id) {
		          return self._sounds[i];
		        }
		      }

		      return null;
		    },

		    /**
		     * Return an inactive sound from the pool or create a new one.
		     * @return {Sound} Sound playback object.
		     */
		    _inactiveSound: function() {
		      var self = this;

		      self._drain();

		      // Find the first inactive node to recycle.
		      for (var i=0; i<self._sounds.length; i++) {
		        if (self._sounds[i]._ended) {
		          return self._sounds[i].reset();
		        }
		      }

		      // If no inactive node was found, create a new one.
		      return new Sound(self);
		    },

		    /**
		     * Drain excess inactive sounds from the pool.
		     */
		    _drain: function() {
		      var self = this;
		      var limit = self._pool;
		      var cnt = 0;
		      var i = 0;

		      // If there are less sounds than the max pool size, we are done.
		      if (self._sounds.length < limit) {
		        return;
		      }

		      // Count the number of inactive sounds.
		      for (i=0; i<self._sounds.length; i++) {
		        if (self._sounds[i]._ended) {
		          cnt++;
		        }
		      }

		      // Remove excess inactive sounds, going in reverse order.
		      for (i=self._sounds.length - 1; i>=0; i--) {
		        if (cnt <= limit) {
		          return;
		        }

		        if (self._sounds[i]._ended) {
		          // Disconnect the audio source when using Web Audio.
		          if (self._webAudio && self._sounds[i]._node) {
		            self._sounds[i]._node.disconnect(0);
		          }

		          // Remove sounds until we have the pool size.
		          self._sounds.splice(i, 1);
		          cnt--;
		        }
		      }
		    },

		    /**
		     * Get all ID's from the sounds pool.
		     * @param  {Number} id Only return one ID if one is passed.
		     * @return {Array}    Array of IDs.
		     */
		    _getSoundIds: function(id) {
		      var self = this;

		      if (typeof id === 'undefined') {
		        var ids = [];
		        for (var i=0; i<self._sounds.length; i++) {
		          ids.push(self._sounds[i]._id);
		        }

		        return ids;
		      } else {
		        return [id];
		      }
		    },

		    /**
		     * Load the sound back into the buffer source.
		     * @param  {Sound} sound The sound object to work with.
		     * @return {Howl}
		     */
		    _refreshBuffer: function(sound) {
		      var self = this;

		      // Setup the buffer source for playback.
		      sound._node.bufferSource = Howler.ctx.createBufferSource();
		      sound._node.bufferSource.buffer = cache[self._src];

		      // Connect to the correct node.
		      if (sound._panner) {
		        sound._node.bufferSource.connect(sound._panner);
		      } else {
		        sound._node.bufferSource.connect(sound._node);
		      }

		      // Setup looping and playback rate.
		      sound._node.bufferSource.loop = sound._loop;
		      if (sound._loop) {
		        sound._node.bufferSource.loopStart = sound._start || 0;
		        sound._node.bufferSource.loopEnd = sound._stop || 0;
		      }
		      sound._node.bufferSource.playbackRate.setValueAtTime(sound._rate, Howler.ctx.currentTime);

		      return self;
		    },

		    /**
		     * Prevent memory leaks by cleaning up the buffer source after playback.
		     * @param  {Object} node Sound's audio node containing the buffer source.
		     * @return {Howl}
		     */
		    _cleanBuffer: function(node) {
		      var self = this;
		      var isIOS = Howler._navigator && Howler._navigator.vendor.indexOf('Apple') >= 0;

		      if (Howler._scratchBuffer && node.bufferSource) {
		        node.bufferSource.onended = null;
		        node.bufferSource.disconnect(0);
		        if (isIOS) {
		          try { node.bufferSource.buffer = Howler._scratchBuffer; } catch(e) {}
		        }
		      }
		      node.bufferSource = null;

		      return self;
		    },

		    /**
		     * Set the source to a 0-second silence to stop any downloading (except in IE).
		     * @param  {Object} node Audio node to clear.
		     */
		    _clearSound: function(node) {
		      var checkIE = /MSIE |Trident\//.test(Howler._navigator && Howler._navigator.userAgent);
		      if (!checkIE) {
		        node.src = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';
		      }
		    }
		  };

		  /** Single Sound Methods **/
		  /***************************************************************************/

		  /**
		   * Setup the sound object, which each node attached to a Howl group is contained in.
		   * @param {Object} howl The Howl parent group.
		   */
		  var Sound = function(howl) {
		    this._parent = howl;
		    this.init();
		  };
		  Sound.prototype = {
		    /**
		     * Initialize a new Sound object.
		     * @return {Sound}
		     */
		    init: function() {
		      var self = this;
		      var parent = self._parent;

		      // Setup the default parameters.
		      self._muted = parent._muted;
		      self._loop = parent._loop;
		      self._volume = parent._volume;
		      self._rate = parent._rate;
		      self._seek = 0;
		      self._paused = true;
		      self._ended = true;
		      self._sprite = '__default';

		      // Generate a unique ID for this sound.
		      self._id = ++Howler._counter;

		      // Add itself to the parent's pool.
		      parent._sounds.push(self);

		      // Create the new node.
		      self.create();

		      return self;
		    },

		    /**
		     * Create and setup a new sound object, whether HTML5 Audio or Web Audio.
		     * @return {Sound}
		     */
		    create: function() {
		      var self = this;
		      var parent = self._parent;
		      var volume = (Howler._muted || self._muted || self._parent._muted) ? 0 : self._volume;

		      if (parent._webAudio) {
		        // Create the gain node for controlling volume (the source will connect to this).
		        self._node = (typeof Howler.ctx.createGain === 'undefined') ? Howler.ctx.createGainNode() : Howler.ctx.createGain();
		        self._node.gain.setValueAtTime(volume, Howler.ctx.currentTime);
		        self._node.paused = true;
		        self._node.connect(Howler.masterGain);
		      } else if (!Howler.noAudio) {
		        // Get an unlocked Audio object from the pool.
		        self._node = Howler._obtainHtml5Audio();

		        // Listen for errors (http://dev.w3.org/html5/spec-author-view/spec.html#mediaerror).
		        self._errorFn = self._errorListener.bind(self);
		        self._node.addEventListener('error', self._errorFn, false);

		        // Listen for 'canplaythrough' event to let us know the sound is ready.
		        self._loadFn = self._loadListener.bind(self);
		        self._node.addEventListener(Howler._canPlayEvent, self._loadFn, false);

		        // Listen for the 'ended' event on the sound to account for edge-case where
		        // a finite sound has a duration of Infinity.
		        self._endFn = self._endListener.bind(self);
		        self._node.addEventListener('ended', self._endFn, false);

		        // Setup the new audio node.
		        self._node.src = parent._src;
		        self._node.preload = parent._preload === true ? 'auto' : parent._preload;
		        self._node.volume = volume * Howler.volume();

		        // Begin loading the source.
		        self._node.load();
		      }

		      return self;
		    },

		    /**
		     * Reset the parameters of this sound to the original state (for recycle).
		     * @return {Sound}
		     */
		    reset: function() {
		      var self = this;
		      var parent = self._parent;

		      // Reset all of the parameters of this sound.
		      self._muted = parent._muted;
		      self._loop = parent._loop;
		      self._volume = parent._volume;
		      self._rate = parent._rate;
		      self._seek = 0;
		      self._rateSeek = 0;
		      self._paused = true;
		      self._ended = true;
		      self._sprite = '__default';

		      // Generate a new ID so that it isn't confused with the previous sound.
		      self._id = ++Howler._counter;

		      return self;
		    },

		    /**
		     * HTML5 Audio error listener callback.
		     */
		    _errorListener: function() {
		      var self = this;

		      // Fire an error event and pass back the code.
		      self._parent._emit('loaderror', self._id, self._node.error ? self._node.error.code : 0);

		      // Clear the event listener.
		      self._node.removeEventListener('error', self._errorFn, false);
		    },

		    /**
		     * HTML5 Audio canplaythrough listener callback.
		     */
		    _loadListener: function() {
		      var self = this;
		      var parent = self._parent;

		      // Round up the duration to account for the lower precision in HTML5 Audio.
		      parent._duration = Math.ceil(self._node.duration * 10) / 10;

		      // Setup a sprite if none is defined.
		      if (Object.keys(parent._sprite).length === 0) {
		        parent._sprite = {__default: [0, parent._duration * 1000]};
		      }

		      if (parent._state !== 'loaded') {
		        parent._state = 'loaded';
		        parent._emit('load');
		        parent._loadQueue();
		      }

		      // Clear the event listener.
		      self._node.removeEventListener(Howler._canPlayEvent, self._loadFn, false);
		    },

		    /**
		     * HTML5 Audio ended listener callback.
		     */
		    _endListener: function() {
		      var self = this;
		      var parent = self._parent;

		      // Only handle the `ended`` event if the duration is Infinity.
		      if (parent._duration === Infinity) {
		        // Update the parent duration to match the real audio duration.
		        // Round up the duration to account for the lower precision in HTML5 Audio.
		        parent._duration = Math.ceil(self._node.duration * 10) / 10;

		        // Update the sprite that corresponds to the real duration.
		        if (parent._sprite.__default[1] === Infinity) {
		          parent._sprite.__default[1] = parent._duration * 1000;
		        }

		        // Run the regular ended method.
		        parent._ended(self);
		      }

		      // Clear the event listener since the duration is now correct.
		      self._node.removeEventListener('ended', self._endFn, false);
		    }
		  };

		  /** Helper Methods **/
		  /***************************************************************************/

		  var cache = {};

		  /**
		   * Buffer a sound from URL, Data URI or cache and decode to audio source (Web Audio API).
		   * @param  {Howl} self
		   */
		  var loadBuffer = function(self) {
		    var url = self._src;

		    // Check if the buffer has already been cached and use it instead.
		    if (cache[url]) {
		      // Set the duration from the cache.
		      self._duration = cache[url].duration;

		      // Load the sound into this Howl.
		      loadSound(self);

		      return;
		    }

		    if (/^data:[^;]+;base64,/.test(url)) {
		      // Decode the base64 data URI without XHR, since some browsers don't support it.
		      var data = atob(url.split(',')[1]);
		      var dataView = new Uint8Array(data.length);
		      for (var i=0; i<data.length; ++i) {
		        dataView[i] = data.charCodeAt(i);
		      }

		      decodeAudioData(dataView.buffer, self);
		    } else {
		      // Load the buffer from the URL.
		      var xhr = new XMLHttpRequest();
		      xhr.open(self._xhr.method, url, true);
		      xhr.withCredentials = self._xhr.withCredentials;
		      xhr.responseType = 'arraybuffer';

		      // Apply any custom headers to the request.
		      if (self._xhr.headers) {
		        Object.keys(self._xhr.headers).forEach(function(key) {
		          xhr.setRequestHeader(key, self._xhr.headers[key]);
		        });
		      }

		      xhr.onload = function() {
		        // Make sure we get a successful response back.
		        var code = (xhr.status + '')[0];
		        if (code !== '0' && code !== '2' && code !== '3') {
		          self._emit('loaderror', null, 'Failed loading audio file with status: ' + xhr.status + '.');
		          return;
		        }

		        decodeAudioData(xhr.response, self);
		      };
		      xhr.onerror = function() {
		        // If there is an error, switch to HTML5 Audio.
		        if (self._webAudio) {
		          self._html5 = true;
		          self._webAudio = false;
		          self._sounds = [];
		          delete cache[url];
		          self.load();
		        }
		      };
		      safeXhrSend(xhr);
		    }
		  };

		  /**
		   * Send the XHR request wrapped in a try/catch.
		   * @param  {Object} xhr XHR to send.
		   */
		  var safeXhrSend = function(xhr) {
		    try {
		      xhr.send();
		    } catch (e) {
		      xhr.onerror();
		    }
		  };

		  /**
		   * Decode audio data from an array buffer.
		   * @param  {ArrayBuffer} arraybuffer The audio data.
		   * @param  {Howl}        self
		   */
		  var decodeAudioData = function(arraybuffer, self) {
		    // Fire a load error if something broke.
		    var error = function() {
		      self._emit('loaderror', null, 'Decoding audio data failed.');
		    };

		    // Load the sound on success.
		    var success = function(buffer) {
		      if (buffer && self._sounds.length > 0) {
		        cache[self._src] = buffer;
		        loadSound(self, buffer);
		      } else {
		        error();
		      }
		    };

		    // Decode the buffer into an audio source.
		    if (typeof Promise !== 'undefined' && Howler.ctx.decodeAudioData.length === 1) {
		      Howler.ctx.decodeAudioData(arraybuffer).then(success).catch(error);
		    } else {
		      Howler.ctx.decodeAudioData(arraybuffer, success, error);
		    }
		  };

		  /**
		   * Sound is now loaded, so finish setting everything up and fire the loaded event.
		   * @param  {Howl} self
		   * @param  {Object} buffer The decoded buffer sound source.
		   */
		  var loadSound = function(self, buffer) {
		    // Set the duration.
		    if (buffer && !self._duration) {
		      self._duration = buffer.duration;
		    }

		    // Setup a sprite if none is defined.
		    if (Object.keys(self._sprite).length === 0) {
		      self._sprite = {__default: [0, self._duration * 1000]};
		    }

		    // Fire the loaded event.
		    if (self._state !== 'loaded') {
		      self._state = 'loaded';
		      self._emit('load');
		      self._loadQueue();
		    }
		  };

		  /**
		   * Setup the audio context when available, or switch to HTML5 Audio mode.
		   */
		  var setupAudioContext = function() {
		    // If we have already detected that Web Audio isn't supported, don't run this step again.
		    if (!Howler.usingWebAudio) {
		      return;
		    }

		    // Check if we are using Web Audio and setup the AudioContext if we are.
		    try {
		      if (typeof AudioContext !== 'undefined') {
		        Howler.ctx = new AudioContext();
		      } else if (typeof webkitAudioContext !== 'undefined') {
		        Howler.ctx = new webkitAudioContext();
		      } else {
		        Howler.usingWebAudio = false;
		      }
		    } catch(e) {
		      Howler.usingWebAudio = false;
		    }

		    // If the audio context creation still failed, set using web audio to false.
		    if (!Howler.ctx) {
		      Howler.usingWebAudio = false;
		    }

		    // Check if a webview is being used on iOS8 or earlier (rather than the browser).
		    // If it is, disable Web Audio as it causes crashing.
		    var iOS = (/iP(hone|od|ad)/.test(Howler._navigator && Howler._navigator.platform));
		    var appVersion = Howler._navigator && Howler._navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/);
		    var version = appVersion ? parseInt(appVersion[1], 10) : null;
		    if (iOS && version && version < 9) {
		      var safari = /safari/.test(Howler._navigator && Howler._navigator.userAgent.toLowerCase());
		      if (Howler._navigator && !safari) {
		        Howler.usingWebAudio = false;
		      }
		    }

		    // Create and expose the master GainNode when using Web Audio (useful for plugins or advanced usage).
		    if (Howler.usingWebAudio) {
		      Howler.masterGain = (typeof Howler.ctx.createGain === 'undefined') ? Howler.ctx.createGainNode() : Howler.ctx.createGain();
		      Howler.masterGain.gain.setValueAtTime(Howler._muted ? 0 : Howler._volume, Howler.ctx.currentTime);
		      Howler.masterGain.connect(Howler.ctx.destination);
		    }

		    // Re-run the setup on Howler.
		    Howler._setup();
		  };

		  // Add support for CommonJS libraries such as browserify.
		  {
		    exports.Howler = Howler;
		    exports.Howl = Howl;
		  }

		  // Add to global in Node.js (for testing, etc).
		  if (typeof commonjsGlobal !== 'undefined') {
		    commonjsGlobal.HowlerGlobal = HowlerGlobal;
		    commonjsGlobal.Howler = Howler;
		    commonjsGlobal.Howl = Howl;
		    commonjsGlobal.Sound = Sound;
		  } else if (typeof window !== 'undefined') {  // Define globally in case AMD is not available or unused.
		    window.HowlerGlobal = HowlerGlobal;
		    window.Howler = Howler;
		    window.Howl = Howl;
		    window.Sound = Sound;
		  }
		})();


		/*!
		 *  Spatial Plugin - Adds support for stereo and 3D audio where Web Audio is supported.
		 *  
		 *  howler.js v2.2.3
		 *  howlerjs.com
		 *
		 *  (c) 2013-2020, James Simpson of GoldFire Studios
		 *  goldfirestudios.com
		 *
		 *  MIT License
		 */

		(function() {

		  // Setup default properties.
		  HowlerGlobal.prototype._pos = [0, 0, 0];
		  HowlerGlobal.prototype._orientation = [0, 0, -1, 0, 1, 0];

		  /** Global Methods **/
		  /***************************************************************************/

		  /**
		   * Helper method to update the stereo panning position of all current Howls.
		   * Future Howls will not use this value unless explicitly set.
		   * @param  {Number} pan A value of -1.0 is all the way left and 1.0 is all the way right.
		   * @return {Howler/Number}     Self or current stereo panning value.
		   */
		  HowlerGlobal.prototype.stereo = function(pan) {
		    var self = this;

		    // Stop right here if not using Web Audio.
		    if (!self.ctx || !self.ctx.listener) {
		      return self;
		    }

		    // Loop through all Howls and update their stereo panning.
		    for (var i=self._howls.length-1; i>=0; i--) {
		      self._howls[i].stereo(pan);
		    }

		    return self;
		  };

		  /**
		   * Get/set the position of the listener in 3D cartesian space. Sounds using
		   * 3D position will be relative to the listener's position.
		   * @param  {Number} x The x-position of the listener.
		   * @param  {Number} y The y-position of the listener.
		   * @param  {Number} z The z-position of the listener.
		   * @return {Howler/Array}   Self or current listener position.
		   */
		  HowlerGlobal.prototype.pos = function(x, y, z) {
		    var self = this;

		    // Stop right here if not using Web Audio.
		    if (!self.ctx || !self.ctx.listener) {
		      return self;
		    }

		    // Set the defaults for optional 'y' & 'z'.
		    y = (typeof y !== 'number') ? self._pos[1] : y;
		    z = (typeof z !== 'number') ? self._pos[2] : z;

		    if (typeof x === 'number') {
		      self._pos = [x, y, z];

		      if (typeof self.ctx.listener.positionX !== 'undefined') {
		        self.ctx.listener.positionX.setTargetAtTime(self._pos[0], Howler.ctx.currentTime, 0.1);
		        self.ctx.listener.positionY.setTargetAtTime(self._pos[1], Howler.ctx.currentTime, 0.1);
		        self.ctx.listener.positionZ.setTargetAtTime(self._pos[2], Howler.ctx.currentTime, 0.1);
		      } else {
		        self.ctx.listener.setPosition(self._pos[0], self._pos[1], self._pos[2]);
		      }
		    } else {
		      return self._pos;
		    }

		    return self;
		  };

		  /**
		   * Get/set the direction the listener is pointing in the 3D cartesian space.
		   * A front and up vector must be provided. The front is the direction the
		   * face of the listener is pointing, and up is the direction the top of the
		   * listener is pointing. Thus, these values are expected to be at right angles
		   * from each other.
		   * @param  {Number} x   The x-orientation of the listener.
		   * @param  {Number} y   The y-orientation of the listener.
		   * @param  {Number} z   The z-orientation of the listener.
		   * @param  {Number} xUp The x-orientation of the top of the listener.
		   * @param  {Number} yUp The y-orientation of the top of the listener.
		   * @param  {Number} zUp The z-orientation of the top of the listener.
		   * @return {Howler/Array}     Returns self or the current orientation vectors.
		   */
		  HowlerGlobal.prototype.orientation = function(x, y, z, xUp, yUp, zUp) {
		    var self = this;

		    // Stop right here if not using Web Audio.
		    if (!self.ctx || !self.ctx.listener) {
		      return self;
		    }

		    // Set the defaults for optional 'y' & 'z'.
		    var or = self._orientation;
		    y = (typeof y !== 'number') ? or[1] : y;
		    z = (typeof z !== 'number') ? or[2] : z;
		    xUp = (typeof xUp !== 'number') ? or[3] : xUp;
		    yUp = (typeof yUp !== 'number') ? or[4] : yUp;
		    zUp = (typeof zUp !== 'number') ? or[5] : zUp;

		    if (typeof x === 'number') {
		      self._orientation = [x, y, z, xUp, yUp, zUp];

		      if (typeof self.ctx.listener.forwardX !== 'undefined') {
		        self.ctx.listener.forwardX.setTargetAtTime(x, Howler.ctx.currentTime, 0.1);
		        self.ctx.listener.forwardY.setTargetAtTime(y, Howler.ctx.currentTime, 0.1);
		        self.ctx.listener.forwardZ.setTargetAtTime(z, Howler.ctx.currentTime, 0.1);
		        self.ctx.listener.upX.setTargetAtTime(xUp, Howler.ctx.currentTime, 0.1);
		        self.ctx.listener.upY.setTargetAtTime(yUp, Howler.ctx.currentTime, 0.1);
		        self.ctx.listener.upZ.setTargetAtTime(zUp, Howler.ctx.currentTime, 0.1);
		      } else {
		        self.ctx.listener.setOrientation(x, y, z, xUp, yUp, zUp);
		      }
		    } else {
		      return or;
		    }

		    return self;
		  };

		  /** Group Methods **/
		  /***************************************************************************/

		  /**
		   * Add new properties to the core init.
		   * @param  {Function} _super Core init method.
		   * @return {Howl}
		   */
		  Howl.prototype.init = (function(_super) {
		    return function(o) {
		      var self = this;

		      // Setup user-defined default properties.
		      self._orientation = o.orientation || [1, 0, 0];
		      self._stereo = o.stereo || null;
		      self._pos = o.pos || null;
		      self._pannerAttr = {
		        coneInnerAngle: typeof o.coneInnerAngle !== 'undefined' ? o.coneInnerAngle : 360,
		        coneOuterAngle: typeof o.coneOuterAngle !== 'undefined' ? o.coneOuterAngle : 360,
		        coneOuterGain: typeof o.coneOuterGain !== 'undefined' ? o.coneOuterGain : 0,
		        distanceModel: typeof o.distanceModel !== 'undefined' ? o.distanceModel : 'inverse',
		        maxDistance: typeof o.maxDistance !== 'undefined' ? o.maxDistance : 10000,
		        panningModel: typeof o.panningModel !== 'undefined' ? o.panningModel : 'HRTF',
		        refDistance: typeof o.refDistance !== 'undefined' ? o.refDistance : 1,
		        rolloffFactor: typeof o.rolloffFactor !== 'undefined' ? o.rolloffFactor : 1
		      };

		      // Setup event listeners.
		      self._onstereo = o.onstereo ? [{fn: o.onstereo}] : [];
		      self._onpos = o.onpos ? [{fn: o.onpos}] : [];
		      self._onorientation = o.onorientation ? [{fn: o.onorientation}] : [];

		      // Complete initilization with howler.js core's init function.
		      return _super.call(this, o);
		    };
		  })(Howl.prototype.init);

		  /**
		   * Get/set the stereo panning of the audio source for this sound or all in the group.
		   * @param  {Number} pan  A value of -1.0 is all the way left and 1.0 is all the way right.
		   * @param  {Number} id (optional) The sound ID. If none is passed, all in group will be updated.
		   * @return {Howl/Number}    Returns self or the current stereo panning value.
		   */
		  Howl.prototype.stereo = function(pan, id) {
		    var self = this;

		    // Stop right here if not using Web Audio.
		    if (!self._webAudio) {
		      return self;
		    }

		    // If the sound hasn't loaded, add it to the load queue to change stereo pan when capable.
		    if (self._state !== 'loaded') {
		      self._queue.push({
		        event: 'stereo',
		        action: function() {
		          self.stereo(pan, id);
		        }
		      });

		      return self;
		    }

		    // Check for PannerStereoNode support and fallback to PannerNode if it doesn't exist.
		    var pannerType = (typeof Howler.ctx.createStereoPanner === 'undefined') ? 'spatial' : 'stereo';

		    // Setup the group's stereo panning if no ID is passed.
		    if (typeof id === 'undefined') {
		      // Return the group's stereo panning if no parameters are passed.
		      if (typeof pan === 'number') {
		        self._stereo = pan;
		        self._pos = [pan, 0, 0];
		      } else {
		        return self._stereo;
		      }
		    }

		    // Change the streo panning of one or all sounds in group.
		    var ids = self._getSoundIds(id);
		    for (var i=0; i<ids.length; i++) {
		      // Get the sound.
		      var sound = self._soundById(ids[i]);

		      if (sound) {
		        if (typeof pan === 'number') {
		          sound._stereo = pan;
		          sound._pos = [pan, 0, 0];

		          if (sound._node) {
		            // If we are falling back, make sure the panningModel is equalpower.
		            sound._pannerAttr.panningModel = 'equalpower';

		            // Check if there is a panner setup and create a new one if not.
		            if (!sound._panner || !sound._panner.pan) {
		              setupPanner(sound, pannerType);
		            }

		            if (pannerType === 'spatial') {
		              if (typeof sound._panner.positionX !== 'undefined') {
		                sound._panner.positionX.setValueAtTime(pan, Howler.ctx.currentTime);
		                sound._panner.positionY.setValueAtTime(0, Howler.ctx.currentTime);
		                sound._panner.positionZ.setValueAtTime(0, Howler.ctx.currentTime);
		              } else {
		                sound._panner.setPosition(pan, 0, 0);
		              }
		            } else {
		              sound._panner.pan.setValueAtTime(pan, Howler.ctx.currentTime);
		            }
		          }

		          self._emit('stereo', sound._id);
		        } else {
		          return sound._stereo;
		        }
		      }
		    }

		    return self;
		  };

		  /**
		   * Get/set the 3D spatial position of the audio source for this sound or group relative to the global listener.
		   * @param  {Number} x  The x-position of the audio source.
		   * @param  {Number} y  The y-position of the audio source.
		   * @param  {Number} z  The z-position of the audio source.
		   * @param  {Number} id (optional) The sound ID. If none is passed, all in group will be updated.
		   * @return {Howl/Array}    Returns self or the current 3D spatial position: [x, y, z].
		   */
		  Howl.prototype.pos = function(x, y, z, id) {
		    var self = this;

		    // Stop right here if not using Web Audio.
		    if (!self._webAudio) {
		      return self;
		    }

		    // If the sound hasn't loaded, add it to the load queue to change position when capable.
		    if (self._state !== 'loaded') {
		      self._queue.push({
		        event: 'pos',
		        action: function() {
		          self.pos(x, y, z, id);
		        }
		      });

		      return self;
		    }

		    // Set the defaults for optional 'y' & 'z'.
		    y = (typeof y !== 'number') ? 0 : y;
		    z = (typeof z !== 'number') ? -0.5 : z;

		    // Setup the group's spatial position if no ID is passed.
		    if (typeof id === 'undefined') {
		      // Return the group's spatial position if no parameters are passed.
		      if (typeof x === 'number') {
		        self._pos = [x, y, z];
		      } else {
		        return self._pos;
		      }
		    }

		    // Change the spatial position of one or all sounds in group.
		    var ids = self._getSoundIds(id);
		    for (var i=0; i<ids.length; i++) {
		      // Get the sound.
		      var sound = self._soundById(ids[i]);

		      if (sound) {
		        if (typeof x === 'number') {
		          sound._pos = [x, y, z];

		          if (sound._node) {
		            // Check if there is a panner setup and create a new one if not.
		            if (!sound._panner || sound._panner.pan) {
		              setupPanner(sound, 'spatial');
		            }

		            if (typeof sound._panner.positionX !== 'undefined') {
		              sound._panner.positionX.setValueAtTime(x, Howler.ctx.currentTime);
		              sound._panner.positionY.setValueAtTime(y, Howler.ctx.currentTime);
		              sound._panner.positionZ.setValueAtTime(z, Howler.ctx.currentTime);
		            } else {
		              sound._panner.setPosition(x, y, z);
		            }
		          }

		          self._emit('pos', sound._id);
		        } else {
		          return sound._pos;
		        }
		      }
		    }

		    return self;
		  };

		  /**
		   * Get/set the direction the audio source is pointing in the 3D cartesian coordinate
		   * space. Depending on how direction the sound is, based on the `cone` attributes,
		   * a sound pointing away from the listener can be quiet or silent.
		   * @param  {Number} x  The x-orientation of the source.
		   * @param  {Number} y  The y-orientation of the source.
		   * @param  {Number} z  The z-orientation of the source.
		   * @param  {Number} id (optional) The sound ID. If none is passed, all in group will be updated.
		   * @return {Howl/Array}    Returns self or the current 3D spatial orientation: [x, y, z].
		   */
		  Howl.prototype.orientation = function(x, y, z, id) {
		    var self = this;

		    // Stop right here if not using Web Audio.
		    if (!self._webAudio) {
		      return self;
		    }

		    // If the sound hasn't loaded, add it to the load queue to change orientation when capable.
		    if (self._state !== 'loaded') {
		      self._queue.push({
		        event: 'orientation',
		        action: function() {
		          self.orientation(x, y, z, id);
		        }
		      });

		      return self;
		    }

		    // Set the defaults for optional 'y' & 'z'.
		    y = (typeof y !== 'number') ? self._orientation[1] : y;
		    z = (typeof z !== 'number') ? self._orientation[2] : z;

		    // Setup the group's spatial orientation if no ID is passed.
		    if (typeof id === 'undefined') {
		      // Return the group's spatial orientation if no parameters are passed.
		      if (typeof x === 'number') {
		        self._orientation = [x, y, z];
		      } else {
		        return self._orientation;
		      }
		    }

		    // Change the spatial orientation of one or all sounds in group.
		    var ids = self._getSoundIds(id);
		    for (var i=0; i<ids.length; i++) {
		      // Get the sound.
		      var sound = self._soundById(ids[i]);

		      if (sound) {
		        if (typeof x === 'number') {
		          sound._orientation = [x, y, z];

		          if (sound._node) {
		            // Check if there is a panner setup and create a new one if not.
		            if (!sound._panner) {
		              // Make sure we have a position to setup the node with.
		              if (!sound._pos) {
		                sound._pos = self._pos || [0, 0, -0.5];
		              }

		              setupPanner(sound, 'spatial');
		            }

		            if (typeof sound._panner.orientationX !== 'undefined') {
		              sound._panner.orientationX.setValueAtTime(x, Howler.ctx.currentTime);
		              sound._panner.orientationY.setValueAtTime(y, Howler.ctx.currentTime);
		              sound._panner.orientationZ.setValueAtTime(z, Howler.ctx.currentTime);
		            } else {
		              sound._panner.setOrientation(x, y, z);
		            }
		          }

		          self._emit('orientation', sound._id);
		        } else {
		          return sound._orientation;
		        }
		      }
		    }

		    return self;
		  };

		  /**
		   * Get/set the panner node's attributes for a sound or group of sounds.
		   * This method can optionall take 0, 1 or 2 arguments.
		   *   pannerAttr() -> Returns the group's values.
		   *   pannerAttr(id) -> Returns the sound id's values.
		   *   pannerAttr(o) -> Set's the values of all sounds in this Howl group.
		   *   pannerAttr(o, id) -> Set's the values of passed sound id.
		   *
		   *   Attributes:
		   *     coneInnerAngle - (360 by default) A parameter for directional audio sources, this is an angle, in degrees,
		   *                      inside of which there will be no volume reduction.
		   *     coneOuterAngle - (360 by default) A parameter for directional audio sources, this is an angle, in degrees,
		   *                      outside of which the volume will be reduced to a constant value of `coneOuterGain`.
		   *     coneOuterGain - (0 by default) A parameter for directional audio sources, this is the gain outside of the
		   *                     `coneOuterAngle`. It is a linear value in the range `[0, 1]`.
		   *     distanceModel - ('inverse' by default) Determines algorithm used to reduce volume as audio moves away from
		   *                     listener. Can be `linear`, `inverse` or `exponential.
		   *     maxDistance - (10000 by default) The maximum distance between source and listener, after which the volume
		   *                   will not be reduced any further.
		   *     refDistance - (1 by default) A reference distance for reducing volume as source moves further from the listener.
		   *                   This is simply a variable of the distance model and has a different effect depending on which model
		   *                   is used and the scale of your coordinates. Generally, volume will be equal to 1 at this distance.
		   *     rolloffFactor - (1 by default) How quickly the volume reduces as source moves from listener. This is simply a
		   *                     variable of the distance model and can be in the range of `[0, 1]` with `linear` and `[0, ∞]`
		   *                     with `inverse` and `exponential`.
		   *     panningModel - ('HRTF' by default) Determines which spatialization algorithm is used to position audio.
		   *                     Can be `HRTF` or `equalpower`.
		   *
		   * @return {Howl/Object} Returns self or current panner attributes.
		   */
		  Howl.prototype.pannerAttr = function() {
		    var self = this;
		    var args = arguments;
		    var o, id, sound;

		    // Stop right here if not using Web Audio.
		    if (!self._webAudio) {
		      return self;
		    }

		    // Determine the values based on arguments.
		    if (args.length === 0) {
		      // Return the group's panner attribute values.
		      return self._pannerAttr;
		    } else if (args.length === 1) {
		      if (typeof args[0] === 'object') {
		        o = args[0];

		        // Set the grou's panner attribute values.
		        if (typeof id === 'undefined') {
		          if (!o.pannerAttr) {
		            o.pannerAttr = {
		              coneInnerAngle: o.coneInnerAngle,
		              coneOuterAngle: o.coneOuterAngle,
		              coneOuterGain: o.coneOuterGain,
		              distanceModel: o.distanceModel,
		              maxDistance: o.maxDistance,
		              refDistance: o.refDistance,
		              rolloffFactor: o.rolloffFactor,
		              panningModel: o.panningModel
		            };
		          }

		          self._pannerAttr = {
		            coneInnerAngle: typeof o.pannerAttr.coneInnerAngle !== 'undefined' ? o.pannerAttr.coneInnerAngle : self._coneInnerAngle,
		            coneOuterAngle: typeof o.pannerAttr.coneOuterAngle !== 'undefined' ? o.pannerAttr.coneOuterAngle : self._coneOuterAngle,
		            coneOuterGain: typeof o.pannerAttr.coneOuterGain !== 'undefined' ? o.pannerAttr.coneOuterGain : self._coneOuterGain,
		            distanceModel: typeof o.pannerAttr.distanceModel !== 'undefined' ? o.pannerAttr.distanceModel : self._distanceModel,
		            maxDistance: typeof o.pannerAttr.maxDistance !== 'undefined' ? o.pannerAttr.maxDistance : self._maxDistance,
		            refDistance: typeof o.pannerAttr.refDistance !== 'undefined' ? o.pannerAttr.refDistance : self._refDistance,
		            rolloffFactor: typeof o.pannerAttr.rolloffFactor !== 'undefined' ? o.pannerAttr.rolloffFactor : self._rolloffFactor,
		            panningModel: typeof o.pannerAttr.panningModel !== 'undefined' ? o.pannerAttr.panningModel : self._panningModel
		          };
		        }
		      } else {
		        // Return this sound's panner attribute values.
		        sound = self._soundById(parseInt(args[0], 10));
		        return sound ? sound._pannerAttr : self._pannerAttr;
		      }
		    } else if (args.length === 2) {
		      o = args[0];
		      id = parseInt(args[1], 10);
		    }

		    // Update the values of the specified sounds.
		    var ids = self._getSoundIds(id);
		    for (var i=0; i<ids.length; i++) {
		      sound = self._soundById(ids[i]);

		      if (sound) {
		        // Merge the new values into the sound.
		        var pa = sound._pannerAttr;
		        pa = {
		          coneInnerAngle: typeof o.coneInnerAngle !== 'undefined' ? o.coneInnerAngle : pa.coneInnerAngle,
		          coneOuterAngle: typeof o.coneOuterAngle !== 'undefined' ? o.coneOuterAngle : pa.coneOuterAngle,
		          coneOuterGain: typeof o.coneOuterGain !== 'undefined' ? o.coneOuterGain : pa.coneOuterGain,
		          distanceModel: typeof o.distanceModel !== 'undefined' ? o.distanceModel : pa.distanceModel,
		          maxDistance: typeof o.maxDistance !== 'undefined' ? o.maxDistance : pa.maxDistance,
		          refDistance: typeof o.refDistance !== 'undefined' ? o.refDistance : pa.refDistance,
		          rolloffFactor: typeof o.rolloffFactor !== 'undefined' ? o.rolloffFactor : pa.rolloffFactor,
		          panningModel: typeof o.panningModel !== 'undefined' ? o.panningModel : pa.panningModel
		        };

		        // Update the panner values or create a new panner if none exists.
		        var panner = sound._panner;
		        if (panner) {
		          panner.coneInnerAngle = pa.coneInnerAngle;
		          panner.coneOuterAngle = pa.coneOuterAngle;
		          panner.coneOuterGain = pa.coneOuterGain;
		          panner.distanceModel = pa.distanceModel;
		          panner.maxDistance = pa.maxDistance;
		          panner.refDistance = pa.refDistance;
		          panner.rolloffFactor = pa.rolloffFactor;
		          panner.panningModel = pa.panningModel;
		        } else {
		          // Make sure we have a position to setup the node with.
		          if (!sound._pos) {
		            sound._pos = self._pos || [0, 0, -0.5];
		          }

		          // Create a new panner node.
		          setupPanner(sound, 'spatial');
		        }
		      }
		    }

		    return self;
		  };

		  /** Single Sound Methods **/
		  /***************************************************************************/

		  /**
		   * Add new properties to the core Sound init.
		   * @param  {Function} _super Core Sound init method.
		   * @return {Sound}
		   */
		  Sound.prototype.init = (function(_super) {
		    return function() {
		      var self = this;
		      var parent = self._parent;

		      // Setup user-defined default properties.
		      self._orientation = parent._orientation;
		      self._stereo = parent._stereo;
		      self._pos = parent._pos;
		      self._pannerAttr = parent._pannerAttr;

		      // Complete initilization with howler.js core Sound's init function.
		      _super.call(this);

		      // If a stereo or position was specified, set it up.
		      if (self._stereo) {
		        parent.stereo(self._stereo);
		      } else if (self._pos) {
		        parent.pos(self._pos[0], self._pos[1], self._pos[2], self._id);
		      }
		    };
		  })(Sound.prototype.init);

		  /**
		   * Override the Sound.reset method to clean up properties from the spatial plugin.
		   * @param  {Function} _super Sound reset method.
		   * @return {Sound}
		   */
		  Sound.prototype.reset = (function(_super) {
		    return function() {
		      var self = this;
		      var parent = self._parent;

		      // Reset all spatial plugin properties on this sound.
		      self._orientation = parent._orientation;
		      self._stereo = parent._stereo;
		      self._pos = parent._pos;
		      self._pannerAttr = parent._pannerAttr;

		      // If a stereo or position was specified, set it up.
		      if (self._stereo) {
		        parent.stereo(self._stereo);
		      } else if (self._pos) {
		        parent.pos(self._pos[0], self._pos[1], self._pos[2], self._id);
		      } else if (self._panner) {
		        // Disconnect the panner.
		        self._panner.disconnect(0);
		        self._panner = undefined;
		        parent._refreshBuffer(self);
		      }

		      // Complete resetting of the sound.
		      return _super.call(this);
		    };
		  })(Sound.prototype.reset);

		  /** Helper Methods **/
		  /***************************************************************************/

		  /**
		   * Create a new panner node and save it on the sound.
		   * @param  {Sound} sound Specific sound to setup panning on.
		   * @param {String} type Type of panner to create: 'stereo' or 'spatial'.
		   */
		  var setupPanner = function(sound, type) {
		    type = type || 'spatial';

		    // Create the new panner node.
		    if (type === 'spatial') {
		      sound._panner = Howler.ctx.createPanner();
		      sound._panner.coneInnerAngle = sound._pannerAttr.coneInnerAngle;
		      sound._panner.coneOuterAngle = sound._pannerAttr.coneOuterAngle;
		      sound._panner.coneOuterGain = sound._pannerAttr.coneOuterGain;
		      sound._panner.distanceModel = sound._pannerAttr.distanceModel;
		      sound._panner.maxDistance = sound._pannerAttr.maxDistance;
		      sound._panner.refDistance = sound._pannerAttr.refDistance;
		      sound._panner.rolloffFactor = sound._pannerAttr.rolloffFactor;
		      sound._panner.panningModel = sound._pannerAttr.panningModel;

		      if (typeof sound._panner.positionX !== 'undefined') {
		        sound._panner.positionX.setValueAtTime(sound._pos[0], Howler.ctx.currentTime);
		        sound._panner.positionY.setValueAtTime(sound._pos[1], Howler.ctx.currentTime);
		        sound._panner.positionZ.setValueAtTime(sound._pos[2], Howler.ctx.currentTime);
		      } else {
		        sound._panner.setPosition(sound._pos[0], sound._pos[1], sound._pos[2]);
		      }

		      if (typeof sound._panner.orientationX !== 'undefined') {
		        sound._panner.orientationX.setValueAtTime(sound._orientation[0], Howler.ctx.currentTime);
		        sound._panner.orientationY.setValueAtTime(sound._orientation[1], Howler.ctx.currentTime);
		        sound._panner.orientationZ.setValueAtTime(sound._orientation[2], Howler.ctx.currentTime);
		      } else {
		        sound._panner.setOrientation(sound._orientation[0], sound._orientation[1], sound._orientation[2]);
		      }
		    } else {
		      sound._panner = Howler.ctx.createStereoPanner();
		      sound._panner.pan.setValueAtTime(sound._stereo, Howler.ctx.currentTime);
		    }

		    sound._panner.connect(sound._node);

		    // Update the connections.
		    if (!sound._paused) {
		      sound._parent.pause(sound._id, true).play(sound._id, true);
		    }
		  };
		})(); 
	} (howler));
	return howler;
}

var howlerExports = requireHowler();

var now_1;
var hasRequiredNow;

function requireNow () {
	if (hasRequiredNow) return now_1;
	hasRequiredNow = 1;
	var root = require_root();

	/**
	 * Gets the timestamp of the number of milliseconds that have elapsed since
	 * the Unix epoch (1 January 1970 00:00:00 UTC).
	 *
	 * @static
	 * @memberOf _
	 * @since 2.4.0
	 * @category Date
	 * @returns {number} Returns the timestamp.
	 * @example
	 *
	 * _.defer(function(stamp) {
	 *   console.log(_.now() - stamp);
	 * }, _.now());
	 * // => Logs the number of milliseconds it took for the deferred invocation.
	 */
	var now = function() {
	  return root.Date.now();
	};

	now_1 = now;
	return now_1;
}

/** Used to match a single whitespace character. */

var _trimmedEndIndex;
var hasRequired_trimmedEndIndex;

function require_trimmedEndIndex () {
	if (hasRequired_trimmedEndIndex) return _trimmedEndIndex;
	hasRequired_trimmedEndIndex = 1;
	var reWhitespace = /\s/;

	/**
	 * Used by `_.trim` and `_.trimEnd` to get the index of the last non-whitespace
	 * character of `string`.
	 *
	 * @private
	 * @param {string} string The string to inspect.
	 * @returns {number} Returns the index of the last non-whitespace character.
	 */
	function trimmedEndIndex(string) {
	  var index = string.length;

	  while (index-- && reWhitespace.test(string.charAt(index))) {}
	  return index;
	}

	_trimmedEndIndex = trimmedEndIndex;
	return _trimmedEndIndex;
}

var _baseTrim;
var hasRequired_baseTrim;

function require_baseTrim () {
	if (hasRequired_baseTrim) return _baseTrim;
	hasRequired_baseTrim = 1;
	var trimmedEndIndex = require_trimmedEndIndex();

	/** Used to match leading whitespace. */
	var reTrimStart = /^\s+/;

	/**
	 * The base implementation of `_.trim`.
	 *
	 * @private
	 * @param {string} string The string to trim.
	 * @returns {string} Returns the trimmed string.
	 */
	function baseTrim(string) {
	  return string
	    ? string.slice(0, trimmedEndIndex(string) + 1).replace(reTrimStart, '')
	    : string;
	}

	_baseTrim = baseTrim;
	return _baseTrim;
}

var isSymbol_1;
var hasRequiredIsSymbol;

function requireIsSymbol () {
	if (hasRequiredIsSymbol) return isSymbol_1;
	hasRequiredIsSymbol = 1;
	var baseGetTag = require_baseGetTag(),
	    isObjectLike = requireIsObjectLike();

	/** `Object#toString` result references. */
	var symbolTag = '[object Symbol]';

	/**
	 * Checks if `value` is classified as a `Symbol` primitive or object.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
	 * @example
	 *
	 * _.isSymbol(Symbol.iterator);
	 * // => true
	 *
	 * _.isSymbol('abc');
	 * // => false
	 */
	function isSymbol(value) {
	  return typeof value == 'symbol' ||
	    (isObjectLike(value) && baseGetTag(value) == symbolTag);
	}

	isSymbol_1 = isSymbol;
	return isSymbol_1;
}

var toNumber_1;
var hasRequiredToNumber;

function requireToNumber () {
	if (hasRequiredToNumber) return toNumber_1;
	hasRequiredToNumber = 1;
	var baseTrim = require_baseTrim(),
	    isObject = requireIsObject(),
	    isSymbol = requireIsSymbol();

	/** Used as references for various `Number` constants. */
	var NAN = 0 / 0;

	/** Used to detect bad signed hexadecimal string values. */
	var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

	/** Used to detect binary string values. */
	var reIsBinary = /^0b[01]+$/i;

	/** Used to detect octal string values. */
	var reIsOctal = /^0o[0-7]+$/i;

	/** Built-in method references without a dependency on `root`. */
	var freeParseInt = parseInt;

	/**
	 * Converts `value` to a number.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to process.
	 * @returns {number} Returns the number.
	 * @example
	 *
	 * _.toNumber(3.2);
	 * // => 3.2
	 *
	 * _.toNumber(Number.MIN_VALUE);
	 * // => 5e-324
	 *
	 * _.toNumber(Infinity);
	 * // => Infinity
	 *
	 * _.toNumber('3.2');
	 * // => 3.2
	 */
	function toNumber(value) {
	  if (typeof value == 'number') {
	    return value;
	  }
	  if (isSymbol(value)) {
	    return NAN;
	  }
	  if (isObject(value)) {
	    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
	    value = isObject(other) ? (other + '') : other;
	  }
	  if (typeof value != 'string') {
	    return value === 0 ? value : +value;
	  }
	  value = baseTrim(value);
	  var isBinary = reIsBinary.test(value);
	  return (isBinary || reIsOctal.test(value))
	    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
	    : (reIsBadHex.test(value) ? NAN : +value);
	}

	toNumber_1 = toNumber;
	return toNumber_1;
}

var debounce_1;
var hasRequiredDebounce;

function requireDebounce () {
	if (hasRequiredDebounce) return debounce_1;
	hasRequiredDebounce = 1;
	var isObject = requireIsObject(),
	    now = requireNow(),
	    toNumber = requireToNumber();

	/** Error message constants. */
	var FUNC_ERROR_TEXT = 'Expected a function';

	/* Built-in method references for those with the same name as other `lodash` methods. */
	var nativeMax = Math.max,
	    nativeMin = Math.min;

	/**
	 * Creates a debounced function that delays invoking `func` until after `wait`
	 * milliseconds have elapsed since the last time the debounced function was
	 * invoked. The debounced function comes with a `cancel` method to cancel
	 * delayed `func` invocations and a `flush` method to immediately invoke them.
	 * Provide `options` to indicate whether `func` should be invoked on the
	 * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
	 * with the last arguments provided to the debounced function. Subsequent
	 * calls to the debounced function return the result of the last `func`
	 * invocation.
	 *
	 * **Note:** If `leading` and `trailing` options are `true`, `func` is
	 * invoked on the trailing edge of the timeout only if the debounced function
	 * is invoked more than once during the `wait` timeout.
	 *
	 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
	 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
	 *
	 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
	 * for details over the differences between `_.debounce` and `_.throttle`.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Function
	 * @param {Function} func The function to debounce.
	 * @param {number} [wait=0] The number of milliseconds to delay.
	 * @param {Object} [options={}] The options object.
	 * @param {boolean} [options.leading=false]
	 *  Specify invoking on the leading edge of the timeout.
	 * @param {number} [options.maxWait]
	 *  The maximum time `func` is allowed to be delayed before it's invoked.
	 * @param {boolean} [options.trailing=true]
	 *  Specify invoking on the trailing edge of the timeout.
	 * @returns {Function} Returns the new debounced function.
	 * @example
	 *
	 * // Avoid costly calculations while the window size is in flux.
	 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
	 *
	 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
	 * jQuery(element).on('click', _.debounce(sendMail, 300, {
	 *   'leading': true,
	 *   'trailing': false
	 * }));
	 *
	 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
	 * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
	 * var source = new EventSource('/stream');
	 * jQuery(source).on('message', debounced);
	 *
	 * // Cancel the trailing debounced invocation.
	 * jQuery(window).on('popstate', debounced.cancel);
	 */
	function debounce(func, wait, options) {
	  var lastArgs,
	      lastThis,
	      maxWait,
	      result,
	      timerId,
	      lastCallTime,
	      lastInvokeTime = 0,
	      leading = false,
	      maxing = false,
	      trailing = true;

	  if (typeof func != 'function') {
	    throw new TypeError(FUNC_ERROR_TEXT);
	  }
	  wait = toNumber(wait) || 0;
	  if (isObject(options)) {
	    leading = !!options.leading;
	    maxing = 'maxWait' in options;
	    maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
	    trailing = 'trailing' in options ? !!options.trailing : trailing;
	  }

	  function invokeFunc(time) {
	    var args = lastArgs,
	        thisArg = lastThis;

	    lastArgs = lastThis = undefined;
	    lastInvokeTime = time;
	    result = func.apply(thisArg, args);
	    return result;
	  }

	  function leadingEdge(time) {
	    // Reset any `maxWait` timer.
	    lastInvokeTime = time;
	    // Start the timer for the trailing edge.
	    timerId = setTimeout(timerExpired, wait);
	    // Invoke the leading edge.
	    return leading ? invokeFunc(time) : result;
	  }

	  function remainingWait(time) {
	    var timeSinceLastCall = time - lastCallTime,
	        timeSinceLastInvoke = time - lastInvokeTime,
	        timeWaiting = wait - timeSinceLastCall;

	    return maxing
	      ? nativeMin(timeWaiting, maxWait - timeSinceLastInvoke)
	      : timeWaiting;
	  }

	  function shouldInvoke(time) {
	    var timeSinceLastCall = time - lastCallTime,
	        timeSinceLastInvoke = time - lastInvokeTime;

	    // Either this is the first call, activity has stopped and we're at the
	    // trailing edge, the system time has gone backwards and we're treating
	    // it as the trailing edge, or we've hit the `maxWait` limit.
	    return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
	      (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
	  }

	  function timerExpired() {
	    var time = now();
	    if (shouldInvoke(time)) {
	      return trailingEdge(time);
	    }
	    // Restart the timer.
	    timerId = setTimeout(timerExpired, remainingWait(time));
	  }

	  function trailingEdge(time) {
	    timerId = undefined;

	    // Only invoke if we have `lastArgs` which means `func` has been
	    // debounced at least once.
	    if (trailing && lastArgs) {
	      return invokeFunc(time);
	    }
	    lastArgs = lastThis = undefined;
	    return result;
	  }

	  function cancel() {
	    if (timerId !== undefined) {
	      clearTimeout(timerId);
	    }
	    lastInvokeTime = 0;
	    lastArgs = lastCallTime = lastThis = timerId = undefined;
	  }

	  function flush() {
	    return timerId === undefined ? result : trailingEdge(now());
	  }

	  function debounced() {
	    var time = now(),
	        isInvoking = shouldInvoke(time);

	    lastArgs = arguments;
	    lastThis = this;
	    lastCallTime = time;

	    if (isInvoking) {
	      if (timerId === undefined) {
	        return leadingEdge(lastCallTime);
	      }
	      if (maxing) {
	        // Handle invocations in a tight loop.
	        clearTimeout(timerId);
	        timerId = setTimeout(timerExpired, wait);
	        return invokeFunc(lastCallTime);
	      }
	    }
	    if (timerId === undefined) {
	      timerId = setTimeout(timerExpired, wait);
	    }
	    return result;
	  }
	  debounced.cancel = cancel;
	  debounced.flush = flush;
	  return debounced;
	}

	debounce_1 = debounce;
	return debounce_1;
}

var throttle_1;
var hasRequiredThrottle;

function requireThrottle () {
	if (hasRequiredThrottle) return throttle_1;
	hasRequiredThrottle = 1;
	var debounce = requireDebounce(),
	    isObject = requireIsObject();

	/** Error message constants. */
	var FUNC_ERROR_TEXT = 'Expected a function';

	/**
	 * Creates a throttled function that only invokes `func` at most once per
	 * every `wait` milliseconds. The throttled function comes with a `cancel`
	 * method to cancel delayed `func` invocations and a `flush` method to
	 * immediately invoke them. Provide `options` to indicate whether `func`
	 * should be invoked on the leading and/or trailing edge of the `wait`
	 * timeout. The `func` is invoked with the last arguments provided to the
	 * throttled function. Subsequent calls to the throttled function return the
	 * result of the last `func` invocation.
	 *
	 * **Note:** If `leading` and `trailing` options are `true`, `func` is
	 * invoked on the trailing edge of the timeout only if the throttled function
	 * is invoked more than once during the `wait` timeout.
	 *
	 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
	 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
	 *
	 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
	 * for details over the differences between `_.throttle` and `_.debounce`.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Function
	 * @param {Function} func The function to throttle.
	 * @param {number} [wait=0] The number of milliseconds to throttle invocations to.
	 * @param {Object} [options={}] The options object.
	 * @param {boolean} [options.leading=true]
	 *  Specify invoking on the leading edge of the timeout.
	 * @param {boolean} [options.trailing=true]
	 *  Specify invoking on the trailing edge of the timeout.
	 * @returns {Function} Returns the new throttled function.
	 * @example
	 *
	 * // Avoid excessively updating the position while scrolling.
	 * jQuery(window).on('scroll', _.throttle(updatePosition, 100));
	 *
	 * // Invoke `renewToken` when the click event is fired, but not more than once every 5 minutes.
	 * var throttled = _.throttle(renewToken, 300000, { 'trailing': false });
	 * jQuery(element).on('click', throttled);
	 *
	 * // Cancel the trailing throttled invocation.
	 * jQuery(window).on('popstate', throttled.cancel);
	 */
	function throttle(func, wait, options) {
	  var leading = true,
	      trailing = true;

	  if (typeof func != 'function') {
	    throw new TypeError(FUNC_ERROR_TEXT);
	  }
	  if (isObject(options)) {
	    leading = 'leading' in options ? !!options.leading : leading;
	    trailing = 'trailing' in options ? !!options.trailing : trailing;
	  }
	  return debounce(func, wait, {
	    'leading': leading,
	    'maxWait': wait,
	    'trailing': trailing
	  });
	}

	throttle_1 = throttle;
	return throttle_1;
}

var throttleExports = requireThrottle();
var throttle = /*@__PURE__*/getDefaultExportFromCjs(throttleExports);

function useMachine(machine2, ...[options = {}]) {
  const { guards, actions, actors, delays, ...interpreterOptions } = options;
  const machineConfig = {
    guards,
    actions,
    actors,
    delays
  };
  const resolvedMachine = machine2.provide(machineConfig);
  const service = interpret(resolvedMachine, interpreterOptions).start();
  onDestroy(() => service.stop());
  let snapshot = service.getSnapshot();
  const state = readable(snapshot, (set) => {
    return service.subscribe((nextSnapshot) => {
      if (snapshot !== nextSnapshot) {
        snapshot = nextSnapshot;
        set(snapshot);
      }
    }).unsubscribe;
  });
  return { state, send: service.send, service };
}
function defaultCompare(a, b) {
  return a === b;
}
const useSelector = (actor, selector, compare = defaultCompare) => {
  let sub;
  let prevSelected = selector(actor.getSnapshot());
  const selected = readable(prevSelected, (set) => {
    const onNext = (state) => {
      const nextSelected = selector(state);
      if (!compare(prevSelected, nextSelected)) {
        prevSelected = nextSelected;
        set(nextSelected);
      }
    };
    onNext(actor.getSnapshot());
    sub = actor.subscribe(onNext);
    return () => {
      sub.unsubscribe();
    };
  });
  return selected;
};
const KEY = {};
const setGameContext = (context) => {
  setContext(KEY, context);
};
const getGameContext = () => getContext(KEY);
const machine = createMachine({
  id: "gameClient",
  context: ({ input }) => input,
  types: {
    // typegen: {} as import('./machine.typegen').Typegen0,
    context: {},
    events: {},
    actors: {}
  },
  initial: "Lobby",
  states: {
    Lobby: {
      initial: "Assigning sides",
      states: {
        "Assigning sides": {
          description: "This is the first step of the game setup, where users can join and are assigned to be either attacker or defender.\n\nUsers can also be made administrators.",
          initial: "Incomplete",
          states: {
            Incomplete: {
              always: {
                target: "Ready",
                guard: "allSidesAssigned",
                description: "All users have been assigned a side and there is an admin on both sides",
                reenter: false
              }
            },
            Ready: {
              on: {
                "next step": {
                  target: "Ready",
                  guard: "isAdmin",
                  actions: {
                    type: "forwardToServer",
                    params: {}
                  },
                  reenter: false
                }
              }
            }
          },
          always: {
            target: "Assigning roles",
            guard: "finishedAssigningSides",
            reenter: false
          },
          on: {
            "assign side": {
              target: "Assigning sides",
              guard: "isAdmin",
              actions: {
                type: "forwardToServer",
                params: {}
              },
              reenter: false
            },
            "assign admin": {
              target: "Assigning sides",
              guard: "isAdmin",
              actions: {
                type: "forwardToServer",
                params: {}
              },
              reenter: false
            }
          }
        },
        "Assigning roles": {
          description: "All users have been assigned a side, and now the roles will be configured.",
          initial: "Incomplete",
          states: {
            Incomplete: {
              always: [
                {
                  target: "Ready",
                  guard: "allRolesAssignedOfSide",
                  description: "All users have been assigned a role.",
                  reenter: false
                },
                {
                  target: "Editing player",
                  guard: "isEditingPlayerOfSide",
                  reenter: false
                }
              ]
            },
            Ready: {
              always: {
                target: "Editing player",
                guard: "isEditingPlayerOfSide",
                reenter: false
              },
              on: {
                "next step": {
                  target: "Ready",
                  guard: "isAdmin",
                  actions: {
                    type: "forwardToServer",
                    params: {}
                  },
                  reenter: false
                }
              }
            },
            "Editing player": {
              description: "Shows a modal where the admin can select the user, role and face image",
              always: {
                target: "Incomplete",
                guard: "isNotEditingPlayerOfSide",
                reenter: false
              },
              on: {
                "assign role": {
                  target: "Editing player",
                  guard: "isAdmin",
                  actions: {
                    type: "forwardToServer",
                    params: {}
                  },
                  reenter: false
                }
              }
            }
          },
          always: {
            target: "Waiting for other side",
            guard: "finishedAssigningRolesOfSide",
            reenter: false
          },
          on: {
            "start editing player": {
              target: "Assigning roles",
              guard: "isAdmin",
              actions: {
                type: "forwardToServer",
                params: {}
              },
              reenter: false
            },
            "stop editing player": {
              target: "Assigning roles",
              guard: "isAdmin",
              actions: {
                type: "forwardToServer",
                params: {}
              },
              reenter: false
            }
          }
        },
        "Waiting for other side": {}
      },
      always: {
        target: "Playing",
        guard: "finishedAssigningRoles",
        reenter: false
      }
    },
    Playing: {
      states: {
        Gameloop: {
          initial: "Waiting",
          states: {
            Waiting: {
              always: {
                target: "Playing",
                guard: "userOnActiveSide",
                reenter: false
              }
            },
            Playing: {
              initial: "Ready to move",
              states: {
                "Ready to move": {
                  always: {
                    target: "Ready for action",
                    guard: "playerMoved",
                    reenter: false
                  },
                  on: {
                    "apply game event": {
                      target: "Ready to move",
                      guard: "userControlsPlayer isMoveEvent",
                      actions: {
                        type: "forwardToServer",
                        params: {}
                      },
                      reenter: false
                    }
                  }
                },
                "Ready for action": {
                  always: {
                    target: "Ready to move",
                    guard: "playerPerformedAction",
                    reenter: false
                  },
                  on: {
                    "apply game event": {
                      target: "Ready for action",
                      guard: "userControlsPlayer isActionEvent",
                      actions: {
                        type: "forwardToServer",
                        params: {}
                      },
                      reenter: false
                    },
                    "cancel game event": {
                      target: "Ready for action",
                      guard: "userControlsPlayer lastEventIsAction lastEventNotFinalized",
                      actions: {
                        type: "forwardToServer",
                        params: {}
                      },
                      reenter: false
                    }
                  }
                }
              },
              always: {
                target: "Waiting",
                guard: "userNotOnActiveSide",
                reenter: false
              }
            }
          },
          on: {
            "rollback game event": {
              target: "Gameloop",
              guard: "isAdmin",
              actions: {
                type: "forwardToServer",
                params: {}
              },
              reenter: false
            }
          }
        },
        "Global Attack": {
          initial: "Showing current global attack",
          states: {
            "Showing current global attack": {
              on: {
                "dismiss global attack": {
                  target: "Dismissed",
                  reenter: false
                }
              }
            },
            Dismissed: {
              on: {
                "new global attack": {
                  target: "Showing current global attack",
                  reenter: false
                },
                "show global attack": {
                  target: "Showing current global attack",
                  reenter: false
                }
              }
            }
          }
        },
        Sides: {
          initial: "Initial",
          states: {
            Initial: {
              always: [
                {
                  target: "Defense",
                  guard: "userIsDefender",
                  reenter: false
                },
                {
                  target: "Attack",
                  reenter: false
                }
              ]
            },
            Defense: {
              states: {
                "Attacker visibility": {
                  initial: "Invisible",
                  states: {
                    Invisible: {
                      always: {
                        target: "Visible",
                        guard: "attackerShouldBeVisible",
                        reenter: false
                      }
                    },
                    Visible: {
                      always: {
                        target: "Invisible",
                        guard: "attackerShouldBeInvisible",
                        reenter: false
                      }
                    }
                  }
                }
              },
              type: "parallel"
            },
            Attack: {}
          },
          on: {
            "switch sides": {
              target: "Sides",
              guard: "isAdmin",
              actions: {
                type: "forwardToServer",
                params: {}
              },
              reenter: false
            }
          }
        }
      },
      always: {
        target: "Finished",
        guard: "gameFinished",
        reenter: false
      },
      type: "parallel"
    },
    Finished: {
      description: "The game finished, but the users can still communicate by sending emojis."
    },
    "Server stopped": {
      type: "final"
    }
  },
  always: {
    target: ".Server stopped",
    guard: "isServerStopped",
    reenter: false
  },
  on: {
    "shared game context update": {
      target: "#gameClient",
      actions: {
        type: "updateSharedGameContext",
        params: {}
      },
      reenter: false
    },
    "send emoji": {
      target: "#gameClient",
      actions: {
        type: "forwardToServer",
        params: {}
      },
      reenter: false
    },
    "show emoji": {
      actions: {
        type: "showEmoji",
        params: {}
      },
      reenter: true
    }
  }
});
const getCurrentUser = (context) => getUser(context.userId, context);
const getClientGameMachine = ({
  send,
  actions
}) => machine.provide({
  actions: {
    updateSharedGameContext: assign(({ event: e }) => {
      const event = e;
      return {
        ...event.sharedGameContext
      };
    }),
    showEmoji: ({ event: e }) => {
      const event = e;
      actions.showEmoji({ userId: event.userId, emoji: event.emoji });
    },
    forwardToServer: ({ event: e }) => {
      const event = e;
      send({ ...event, type: `user: ${event.type}` });
    }
  },
  actors: {},
  guards: {
    isHost: ({ context }) => context.hostUserId === context.userId,
    isAdmin: ({ context }) => !!context.users.find((user) => user.id === context.userId && user.isAdmin),
    isPlayer: ({ context }) => context.hostUserId !== context.userId,
    allRolesAssignedOfSide: ({ context }) => {
      const { side } = getCurrentUser(context);
      if (!side)
        return false;
      if (side === "attack") {
        return !!context.attack.attacker;
      } else {
        return context.defense.defenders.length === 4;
      }
    },
    finishedAssigningRolesOfSide: ({ context }) => {
      const { side } = getCurrentUser(context);
      if (!side)
        return false;
      return (side === "attack" ? context.attack : context.defense).finishedAssigning;
    },
    isEditingPlayerOfSide: ({ context }) => {
      const { side } = getCurrentUser(context);
      if (!side)
        return false;
      const editingPlayer = (side === "attack" ? context.attack : context.defense).editingPlayerId;
      return editingPlayer !== void 0;
    },
    isNotEditingPlayerOfSide: not("isEditingPlayerOfSide"),
    userControlsPlayer: ({ context }) => {
      const user = getCurrentUser(context);
      return user.isAdmin || user.id === GameState.fromContext(context).activePlayer.userId;
    },
    isMoveEvent: ({ event: e }) => {
      const event = e;
      return event.gameEvent.type === "move";
    },
    isActionEvent: ({ event: e }) => {
      const event = e;
      return event.gameEvent.type !== "move";
    },
    lastEventIsAction: ({ context }) => {
      const gameState = GameState.fromContext(context);
      return !!gameState.lastEvent && gameState.lastEvent.type !== "move";
    },
    lastEventNotFinalized: ({ context }) => {
      const gameState = GameState.fromContext(context);
      return !!gameState.lastEvent && !gameState.lastEvent.finalized;
    },
    "userControlsPlayer isMoveEvent": and(["userControlsPlayer", "isMoveEvent"]),
    "userControlsPlayer isActionEvent": and(["userControlsPlayer", "isActionEvent"]),
    "userControlsPlayer lastEventIsAction lastEventNotFinalized": and([
      "userControlsPlayer",
      "lastEventIsAction",
      "lastEventNotFinalized"
    ]),
    userOnActiveSide: ({ context }) => getCurrentUser(context).side === GameState.fromContext(context).activeSide,
    userNotOnActiveSide: not("userOnActiveSide"),
    playerMoved: ({ context }) => GameState.fromContext(context).nextEventType === "action",
    playerPerformedAction: ({ context }) => GameState.fromContext(context).nextEventType === "move",
    userIsDefender: () => false,
    isServerStopped: () => false,
    ...sharedGuards
  }
});
const createWebSocketConnection = ({
  gameId,
  userId,
  onMessage
}) => {
  const webSocketConnection = writable({ status: "opening", log: [] });
  const logEvent = (message, consoleData) => {
    console.debug("[websocket]", message, consoleData);
    return webSocketConnection.update((connection) => ({
      ...connection,
      log: [...connection.log, `[websocket] ${message}`]
    }));
  };
  const updateStatus = (status) => webSocketConnection.update((connection) => ({ ...connection, status }));
  let ws;
  const open = () => {
    logEvent("connecting");
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    ws = new WebSocket(
      `${protocol}//${window.location.host}/websocket?gameId=${gameId}&userId=${userId}`
    );
    ws.addEventListener("open", () => {
      updateStatus("opened");
      logEvent("connection open");
    });
    ws.addEventListener("close", () => {
      updateStatus("closed");
      logEvent("connection closed");
    });
    ws.addEventListener("message", (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type !== "mouse position")
          logEvent(`message received: ${event.data}`, event);
        onMessage(message);
      } catch (error) {
        logEvent(`error parsing message`, error);
      }
    });
  };
  const send = (message) => {
    ws?.send(JSON.stringify(message));
  };
  return { subscribe: webSocketConnection.subscribe, open, close: () => ws?.close(), send };
};
const css$o = {
  code: ".cursor.svelte-7ubvy1.svelte-7ubvy1{height:1px;left:0;position:absolute;top:0;width:1px}.cursor.svelte-7ubvy1 svg.svelte-7ubvy1{display:block;height:1.5rem!important;left:0;max-width:none;position:absolute;top:0;translate:-15% -20%;width:1.5rem!important}.cursor.svelte-7ubvy1 .name.svelte-7ubvy1{background:rgba(0,0,0,.667);border-radius:var(--radius-sm);display:inline-block;font-size:var(--scale-000);left:1.5rem;max-width:7rem;overflow:hidden;padding:.25rem .5rem;position:absolute;text-overflow:ellipsis;top:.5rem;white-space:nowrap}",
  map: null
};
const Cursor = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { position } = $$props;
  let el;
  if ($$props.position === void 0 && $$bindings.position && position !== void 0)
    $$bindings.position(position);
  $$result.css.add(css$o);
  return `<div class="cursor svelte-7ubvy1"${add_attribute("this", el, 0)}><svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2c3e50" fill="white" stroke-linecap="round" stroke-linejoin="round" class="svelte-7ubvy1"><path d="M7.904 17.563a1.2 1.2 0 0 0 2.228 .308l2.09 -3.093l4.907 4.907a1.067 1.067 0 0 0 1.509 0l1.047 -1.047a1.067 1.067 0 0 0 0 -1.509l-4.907 -4.907l3.113 -2.09a1.2 1.2 0 0 0 -.309 -2.228l-13.582 -3.904l3.904 13.563z"></path></svg> <span class="name svelte-7ubvy1">${escape(position.name)}</span> </div>`;
});
const css$n = {
  code: ".cursor-overlays.svelte-1n4ax7h{bottom:0;left:0;pointer-events:none;position:absolute;right:0;top:0;z-index:var(--layer-top)}",
  map: null
};
const CursorOverlays = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let userMousePositions;
  let $users, $$unsubscribe_users;
  let $user, $$unsubscribe_user;
  let { mousePositions = {} } = $$props;
  const { user, machine: machine2 } = getGameContext();
  $$unsubscribe_user = subscribe(user, (value) => $user = value);
  let gameWidth = 1;
  let gameHeight = 1;
  const users = useSelector(machine2.service, (state) => {
    const showAllUsers = state.matches("Lobby.Assigning sides") || state.matches("Finished");
    const allUsers = state.context.users.filter((user2) => user2.isConnected);
    return showAllUsers ? allUsers : allUsers.filter((otherUser) => otherUser.side === $user.side);
  });
  $$unsubscribe_users = subscribe(users, (value) => $users = value);
  const getMousePositions = (users2, mousePositions2) => {
    return users2.filter((user2) => user2.isConnected && !!mousePositions2[user2.id]).map((user2) => {
      const percentages = mousePositions2[user2.id];
      return {
        id: user2.id,
        name: user2.name,
        position: [percentages[0] * gameWidth, percentages[1] * gameHeight]
      };
    });
  };
  if ($$props.mousePositions === void 0 && $$bindings.mousePositions && mousePositions !== void 0)
    $$bindings.mousePositions(mousePositions);
  $$result.css.add(css$n);
  userMousePositions = getMousePositions($users, mousePositions);
  $$unsubscribe_users();
  $$unsubscribe_user();
  return `<div class="cursor-overlays svelte-1n4ax7h">${each(userMousePositions, (position) => {
    return `${validate_component(Cursor, "Cursor").$$render($$result, { position }, {}, {})}`;
  })} </div>`;
});
const css$m = {
  code: ".displayed-emoji.svelte-1tnpk3.svelte-1tnpk3{--_width:4rem;--_height:4rem;align-items:center;background:#fafafa;border-radius:var(--radius-full);box-shadow:0 0 30px hsla(0,0%,100%,.333);display:flex;flex-direction:column;font-size:3rem;height:4rem;height:var(--_height);justify-content:center;left:calc(var(--_x)*(100% - 4rem));left:calc(var(--_x)*(100% - var(--_width)));line-height:1.1;position:fixed;top:calc(var(--_y)*(100% - 4rem));top:calc(var(--_y)*(100% - var(--_height)));width:4rem;width:var(--_width)}.displayed-emoji.svelte-1tnpk3 .name.svelte-1tnpk3{background:#000;border-radius:var(--radius-sm);bottom:-1.75em;font-size:.3em;padding:0 .5rem;position:absolute}",
  map: null
};
const EmojiOverlays = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $users, $$unsubscribe_users;
  const context = getGameContext();
  const users = useSelector(context.machine.service, (state) => state.context.users);
  $$unsubscribe_users = subscribe(users, (value) => $users = value);
  let emojis = {};
  let i = 0;
  const showEmoji = ({ userId, emoji }) => {
    const name = $users.find((user) => user.id === userId)?.name ?? "Unknown";
    emojis[`${i++}`] = {
      emoji,
      userName: name,
      position: [Math.random(), Math.random()]
    };
    emojis = emojis;
    i++;
  };
  if ($$props.showEmoji === void 0 && $$bindings.showEmoji && showEmoji !== void 0)
    $$bindings.showEmoji(showEmoji);
  $$result.css.add(css$m);
  $$unsubscribe_users();
  return `${each(Object.entries(emojis), ([i2, emoji]) => {
    return `<div class="displayed-emoji svelte-1tnpk3"${add_styles({
      "--_x": emoji.position[0],
      "--_y": emoji.position[1]
    })}><span class="emjoi">${escape(emoji.emoji)}</span> <span class="name svelte-1tnpk3">${escape(emoji.userName)}</span> </div>`;
  })}`;
});
const Finished = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `Finished`;
});
const css$l = {
  code: ".emojis.svelte-usst85{display:flex;gap:.25rem}.emoji.svelte-usst85{align-content:center;aspect-ratio:1;background:var(--color-bg-secondary);border:none;border-radius:var(--radius-sm);cursor:pointer;display:grid;flex-shrink:0;font-size:var(--scale-3);justify-content:center;opacity:.3;padding:0;place-content:center;width:2.5rem}.emoji.svelte-usst85:hover{opacity:1}",
  map: null
};
const EmojiPicker = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  getGameContext();
  const validEmojis = ["👋", "👍", "👏", "😃", "🧠", "🤔"];
  $$result.css.add(css$l);
  return `<div class="emojis svelte-usst85">${each(validEmojis, (emoji) => {
    return `<button class="emoji svelte-usst85">${escape(emoji)}</button>`;
  })} </div>`;
});
const X_circle = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<svg${spread(
    [
      { viewBox: "0 0 24 24" },
      { width: "1.2em" },
      { height: "1.2em" },
      escape_object($$props)
    ],
    {}
  )}><!-- HTML_TAG_START -->${`<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="m15 9l-6 6m0-6l6 6"/></g>`}<!-- HTML_TAG_END --></svg>`;
});
const css$k = {
  code: ".expandable.svelte-4t104h.svelte-4t104h{color:#000;position:relative}.expandable.svelte-4t104h .icon.svelte-4t104h{align-content:center;background:#fff;border-radius:var(--radius-full);display:grid;height:1.5rem;justify-content:center;place-content:center;width:1.5rem}.expandable.svelte-4t104h .icon.svelte-4t104h svg{display:block;height:1rem;width:1rem}.expandable.expanded.svelte-4t104h .content.svelte-4t104h{display:block}.expandable.svelte-4t104h .content.svelte-4t104h{--_padding:0.25rem;background:#fff;border-radius:var(--radius-full);display:none;height:2rem;height:calc(1.5rem + var(--_padding)*2);padding:.25rem;padding:var(--_padding);position:absolute;right:-.25rem;right:calc(0px - var(--_padding));top:-.25rem;top:calc(0px - var(--_padding))}",
  map: null
};
const ExpandableButton = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$k);
  return `<div class="${["expandable svelte-4t104h", ""].join(" ").trim()}"><button class="unstyled icon svelte-4t104h">${slots.icon ? slots.icon({}) : ``}</button> <div class="content svelte-4t104h">${slots.content ? slots.content({}) : ``} <button class="unstyled icon svelte-4t104h">${validate_component(X_circle, "CloseIcon").$$render($$result, {}, {}, {})}</button></div> </div>`;
});
const RollbackButton = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $lastGameEvent, $$unsubscribe_lastGameEvent;
  const { machine: machine2 } = getGameContext();
  const lastGameEvent = useSelector(machine2.service, ({ context }) => {
    const gameState = GameState.fromContext(context);
    return gameState.lastEvent;
  });
  $$unsubscribe_lastGameEvent = subscribe(lastGameEvent, (value) => $lastGameEvent = value);
  $$unsubscribe_lastGameEvent();
  return `${$lastGameEvent ? `<button data-svelte-h="svelte-1c912wl">Spielzug zurücknehmen</button>` : ``}`;
});
const Settings = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<svg${spread(
    [
      { viewBox: "0 0 24 24" },
      { width: "1.2em" },
      { height: "1.2em" },
      escape_object($$props)
    ],
    {}
  )}><!-- HTML_TAG_START -->${`<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></g>`}<!-- HTML_TAG_END --></svg>`;
});
const Volume_2 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<svg${spread(
    [
      { viewBox: "0 0 24 24" },
      { width: "1.2em" },
      { height: "1.2em" },
      escape_object($$props)
    ],
    {}
  )}><!-- HTML_TAG_START -->${`<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5L6 9H2v6h4l5 4V5zm4.54 3.46a5 5 0 0 1 0 7.07m3.53-10.6a10 10 0 0 1 0 14.14"/>`}<!-- HTML_TAG_END --></svg>`;
});
const Shield_question = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<svg${spread(
    [
      { viewBox: "0 0 24 24" },
      { width: "1.2em" },
      { height: "1.2em" },
      escape_object($$props)
    ],
    {}
  )}><!-- HTML_TAG_START -->${`<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M12 17h.01M12 22s8-4 8-10V5l-8-3l-8 3v7c0 6 8 10 8 10"/><path d="M9.1 9a3 3 0 0 1 5.82 1c0 2-3 3-3 3"/></g>`}<!-- HTML_TAG_END --></svg>`;
});
const css$j = {
  code: ".header.svelte-7tzkuk{align-items:center;background:linear-gradient(180deg,rgba(43,52,72,0),rgba(43,52,72,.663));display:flex;height:3rem;justify-content:space-between;overflow:hidden;padding-left:3rem;padding-right:1rem}.title.svelte-7tzkuk{font:var(--display-h2);font-size:var(--scale-4);text-transform:uppercase}.actions.svelte-7tzkuk{display:flex;gap:1rem}",
  map: null
};
const Header = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$j);
  return `<div class="header svelte-7tzkuk"><div class="title svelte-7tzkuk" data-svelte-h="svelte-xbe4by">The hidden threat</div> ${validate_component(RollbackButton, "RollbackButton").$$render($$result, {}, {}, {})} ${validate_component(EmojiPicker, "EmojiPicker").$$render($$result, {}, {}, {})} <div class="actions svelte-7tzkuk">${validate_component(ExpandableButton, "ExpandableButton").$$render($$result, {}, {}, {
    icon: () => {
      return `${validate_component(Shield_question, "HelpIcon").$$render($$result, { slot: "icon" }, {}, {})}`;
    }
  })} ${validate_component(ExpandableButton, "ExpandableButton").$$render($$result, {}, {}, {
    icon: () => {
      return `${validate_component(Volume_2, "AudioIcon").$$render($$result, { slot: "icon" }, {}, {})}`;
    }
  })} ${validate_component(ExpandableButton, "ExpandableButton").$$render($$result, {}, {}, {
    icon: () => {
      return `${validate_component(Settings, "SettingsIcon").$$render($$result, { slot: "icon" }, {}, {})}`;
    }
  })}</div> </div>`;
});
const css$i = {
  code: ".users.svelte-1w8krv2{margin-bottom:3rem;margin-top:3rem}.side.svelte-1w8krv2{background:#000;border-radius:.5em;color:#fff;display:inline-block;font-size:.875rem;padding:.25rem .5rem}",
  map: null
};
const AssigningSides = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $users, $$unsubscribe_users;
  let $canAssignSides, $$unsubscribe_canAssignSides;
  let $canAssignAdmin, $$unsubscribe_canAssignAdmin;
  let $canContinue, $$unsubscribe_canContinue;
  let $user, $$unsubscribe_user;
  const { userId, user, machine: machine2 } = getGameContext();
  $$unsubscribe_user = subscribe(user, (value) => $user = value);
  const canAssignSides = useSelector(machine2.service, (snapshot) => snapshot.can({
    type: "assign side",
    otherUserId: "",
    side: "attack"
  }));
  $$unsubscribe_canAssignSides = subscribe(canAssignSides, (value) => $canAssignSides = value);
  const canAssignAdmin = useSelector(machine2.service, (snapshot) => snapshot.can({
    type: "assign admin",
    otherUserId: "",
    isAdmin: true
  }));
  $$unsubscribe_canAssignAdmin = subscribe(canAssignAdmin, (value) => $canAssignAdmin = value);
  const canContinue = useSelector(machine2.service, (snapshot) => snapshot.can({ type: "next step" }));
  $$unsubscribe_canContinue = subscribe(canContinue, (value) => $canContinue = value);
  const users = useSelector(machine2.service, (snapshot) => snapshot.context.users);
  $$unsubscribe_users = subscribe(users, (value) => $users = value);
  $$result.css.add(css$i);
  $$unsubscribe_users();
  $$unsubscribe_canAssignSides();
  $$unsubscribe_canAssignAdmin();
  $$unsubscribe_canContinue();
  $$unsubscribe_user();
  return `${validate_component(Heading, "Heading").$$render($$result, { separator: true }, {}, {
    info: () => {
      return `Schritt 2 von 3`;
    },
    default: () => {
      return `Einteilung in Teams`;
    }
  })} <p data-svelte-h="svelte-ugtca6">Gleich geht’s los. Sobald alle Teilnehmende sich eingeloggt haben, kann die Spielleitung alle in
  Teams einteilen.</p> <div class="users svelte-1w8krv2">${each($users, (user2) => {
    return `<div class="user">${escape(user2.name)} ${user2.isAdmin ? `<span class="admin" data-svelte-h="svelte-16777ag">(admin)</span>` : ``} ${user2.isSideAssigned ? `<span class="side svelte-1w8krv2">${user2.side === "attack" ? `Angriff` : `Verteidigung`} </span>` : ``} ${$canAssignSides ? `${validate_component(Button, "Button").$$render($$result, {}, {}, {
      default: () => {
        return `Angriff`;
      }
    })} ${validate_component(Button, "Button").$$render($$result, {}, {}, {
      default: () => {
        return `Verteidigung`;
      }
    })}` : ``} ${$canAssignAdmin && user2.id !== userId ? `${validate_component(Button, "Button").$$render($$result, {}, {}, {
      default: () => {
        return `Toggle Admin`;
      }
    })}` : ``} </div>`;
  })}</div> ${validate_component(Actions$1, "Actions").$$render($$result, {}, {}, {
    default: () => {
      return `${validate_component(Button, "Button").$$render(
        $$result,
        {
          primary: true,
          disabled: !$canContinue,
          disabledReason: $user.isAdmin ? "Alle Spieler:innen müssen einer Seite zugewiesen sein" : "Nur Administrator:innen dürfen bestätigen"
        },
        {},
        {
          default: () => {
            return `Next`;
          }
        }
      )}`;
    }
  })}`;
});
const Close = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M16 30C23.732 30 30 23.732 30 16C30 8.26801 23.732 2 16 2C8.26801 2 2 8.26801 2 16C2 23.732 8.26801 30 16 30ZM16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32Z" fill="currentColor"></path><path d="M20.8002 11.1997L11.2002 20.7997M11.2002 11.1997L20.8002 20.7997" stroke="currentColor" stroke-width="2.66667" stroke-linecap="round" stroke-linejoin="round"></path></svg>`;
});
const css$h = {
  code: "dialog.svelte-m0m887{background-color:var(--color-bg-secondary);border:none;border-radius:var(--radius-md);box-shadow:0 0 30px 0 var(--color-shadow-secondary);margin:auto;padding:1.5rem}.close-button.svelte-m0m887 svg{display:block}dialog.svelte-m0m887::backdrop{background-color:var(--color-bg);opacity:.85}",
  map: null
};
const Dialog = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { open = false } = $$props;
  let { title = "" } = $$props;
  let element;
  if ($$props.open === void 0 && $$bindings.open && open !== void 0)
    $$bindings.open(open);
  if ($$props.title === void 0 && $$bindings.title && title !== void 0)
    $$bindings.title(title);
  $$result.css.add(css$h);
  return `<dialog class="svelte-m0m887"${add_attribute("this", element, 0)}>${validate_component(Heading, "Heading").$$render($$result, { separator: true }, {}, {
    info: () => {
      return `<button class="unstyled close-button svelte-m0m887" slot="info">${validate_component(Close, "CloseIcon").$$render($$result, {}, {}, {})}</button>`;
    },
    default: () => {
      return `${title ? `${escape(title)}` : ``}`;
    }
  })} ${slots.default ? slots.default({}) : ``} </dialog>`;
});
const min = Math.min;
const max = Math.max;
const round = Math.round;
const floor = Math.floor;
const createCoords = (v) => ({
  x: v,
  y: v
});
const oppositeSideMap = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
};
const oppositeAlignmentMap = {
  start: "end",
  end: "start"
};
function clamp(start, value, end) {
  return max(start, min(value, end));
}
function evaluate(value, param) {
  return typeof value === "function" ? value(param) : value;
}
function getSide(placement) {
  return placement.split("-")[0];
}
function getAlignment(placement) {
  return placement.split("-")[1];
}
function getOppositeAxis(axis) {
  return axis === "x" ? "y" : "x";
}
function getAxisLength(axis) {
  return axis === "y" ? "height" : "width";
}
function getSideAxis(placement) {
  return ["top", "bottom"].includes(getSide(placement)) ? "y" : "x";
}
function getAlignmentAxis(placement) {
  return getOppositeAxis(getSideAxis(placement));
}
function getAlignmentSides(placement, rects, rtl) {
  if (rtl === void 0) {
    rtl = false;
  }
  const alignment = getAlignment(placement);
  const alignmentAxis = getAlignmentAxis(placement);
  const length = getAxisLength(alignmentAxis);
  let mainAlignmentSide = alignmentAxis === "x" ? alignment === (rtl ? "end" : "start") ? "right" : "left" : alignment === "start" ? "bottom" : "top";
  if (rects.reference[length] > rects.floating[length]) {
    mainAlignmentSide = getOppositePlacement(mainAlignmentSide);
  }
  return [mainAlignmentSide, getOppositePlacement(mainAlignmentSide)];
}
function getExpandedPlacements(placement) {
  const oppositePlacement = getOppositePlacement(placement);
  return [getOppositeAlignmentPlacement(placement), oppositePlacement, getOppositeAlignmentPlacement(oppositePlacement)];
}
function getOppositeAlignmentPlacement(placement) {
  return placement.replace(/start|end/g, (alignment) => oppositeAlignmentMap[alignment]);
}
function getSideList(side, isStart, rtl) {
  const lr = ["left", "right"];
  const rl = ["right", "left"];
  const tb = ["top", "bottom"];
  const bt = ["bottom", "top"];
  switch (side) {
    case "top":
    case "bottom":
      if (rtl)
        return isStart ? rl : lr;
      return isStart ? lr : rl;
    case "left":
    case "right":
      return isStart ? tb : bt;
    default:
      return [];
  }
}
function getOppositeAxisPlacements(placement, flipAlignment, direction, rtl) {
  const alignment = getAlignment(placement);
  let list = getSideList(getSide(placement), direction === "start", rtl);
  if (alignment) {
    list = list.map((side) => side + "-" + alignment);
    if (flipAlignment) {
      list = list.concat(list.map(getOppositeAlignmentPlacement));
    }
  }
  return list;
}
function getOppositePlacement(placement) {
  return placement.replace(/left|right|bottom|top/g, (side) => oppositeSideMap[side]);
}
function expandPaddingObject(padding) {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    ...padding
  };
}
function getPaddingObject(padding) {
  return typeof padding !== "number" ? expandPaddingObject(padding) : {
    top: padding,
    right: padding,
    bottom: padding,
    left: padding
  };
}
function rectToClientRect(rect) {
  return {
    ...rect,
    top: rect.y,
    left: rect.x,
    right: rect.x + rect.width,
    bottom: rect.y + rect.height
  };
}
function computeCoordsFromPlacement(_ref, placement, rtl) {
  let {
    reference,
    floating
  } = _ref;
  const sideAxis = getSideAxis(placement);
  const alignmentAxis = getAlignmentAxis(placement);
  const alignLength = getAxisLength(alignmentAxis);
  const side = getSide(placement);
  const isVertical = sideAxis === "y";
  const commonX = reference.x + reference.width / 2 - floating.width / 2;
  const commonY = reference.y + reference.height / 2 - floating.height / 2;
  const commonAlign = reference[alignLength] / 2 - floating[alignLength] / 2;
  let coords;
  switch (side) {
    case "top":
      coords = {
        x: commonX,
        y: reference.y - floating.height
      };
      break;
    case "bottom":
      coords = {
        x: commonX,
        y: reference.y + reference.height
      };
      break;
    case "right":
      coords = {
        x: reference.x + reference.width,
        y: commonY
      };
      break;
    case "left":
      coords = {
        x: reference.x - floating.width,
        y: commonY
      };
      break;
    default:
      coords = {
        x: reference.x,
        y: reference.y
      };
  }
  switch (getAlignment(placement)) {
    case "start":
      coords[alignmentAxis] -= commonAlign * (rtl && isVertical ? -1 : 1);
      break;
    case "end":
      coords[alignmentAxis] += commonAlign * (rtl && isVertical ? -1 : 1);
      break;
  }
  return coords;
}
const computePosition$1 = async (reference, floating, config) => {
  const {
    placement = "bottom",
    strategy = "absolute",
    middleware = [],
    platform: platform2
  } = config;
  const validMiddleware = middleware.filter(Boolean);
  const rtl = await (platform2.isRTL == null ? void 0 : platform2.isRTL(floating));
  let rects = await platform2.getElementRects({
    reference,
    floating,
    strategy
  });
  let {
    x,
    y
  } = computeCoordsFromPlacement(rects, placement, rtl);
  let statefulPlacement = placement;
  let middlewareData = {};
  let resetCount = 0;
  for (let i = 0; i < validMiddleware.length; i++) {
    const {
      name,
      fn
    } = validMiddleware[i];
    const {
      x: nextX,
      y: nextY,
      data,
      reset
    } = await fn({
      x,
      y,
      initialPlacement: placement,
      placement: statefulPlacement,
      strategy,
      middlewareData,
      rects,
      platform: platform2,
      elements: {
        reference,
        floating
      }
    });
    x = nextX != null ? nextX : x;
    y = nextY != null ? nextY : y;
    middlewareData = {
      ...middlewareData,
      [name]: {
        ...middlewareData[name],
        ...data
      }
    };
    if (reset && resetCount <= 50) {
      resetCount++;
      if (typeof reset === "object") {
        if (reset.placement) {
          statefulPlacement = reset.placement;
        }
        if (reset.rects) {
          rects = reset.rects === true ? await platform2.getElementRects({
            reference,
            floating,
            strategy
          }) : reset.rects;
        }
        ({
          x,
          y
        } = computeCoordsFromPlacement(rects, statefulPlacement, rtl));
      }
      i = -1;
      continue;
    }
  }
  return {
    x,
    y,
    placement: statefulPlacement,
    strategy,
    middlewareData
  };
};
async function detectOverflow(state, options) {
  var _await$platform$isEle;
  if (options === void 0) {
    options = {};
  }
  const {
    x,
    y,
    platform: platform2,
    rects,
    elements,
    strategy
  } = state;
  const {
    boundary = "clippingAncestors",
    rootBoundary = "viewport",
    elementContext = "floating",
    altBoundary = false,
    padding = 0
  } = evaluate(options, state);
  const paddingObject = getPaddingObject(padding);
  const altContext = elementContext === "floating" ? "reference" : "floating";
  const element = elements[altBoundary ? altContext : elementContext];
  const clippingClientRect = rectToClientRect(await platform2.getClippingRect({
    element: ((_await$platform$isEle = await (platform2.isElement == null ? void 0 : platform2.isElement(element))) != null ? _await$platform$isEle : true) ? element : element.contextElement || await (platform2.getDocumentElement == null ? void 0 : platform2.getDocumentElement(elements.floating)),
    boundary,
    rootBoundary,
    strategy
  }));
  const rect = elementContext === "floating" ? {
    ...rects.floating,
    x,
    y
  } : rects.reference;
  const offsetParent = await (platform2.getOffsetParent == null ? void 0 : platform2.getOffsetParent(elements.floating));
  const offsetScale = await (platform2.isElement == null ? void 0 : platform2.isElement(offsetParent)) ? await (platform2.getScale == null ? void 0 : platform2.getScale(offsetParent)) || {
    x: 1,
    y: 1
  } : {
    x: 1,
    y: 1
  };
  const elementClientRect = rectToClientRect(platform2.convertOffsetParentRelativeRectToViewportRelativeRect ? await platform2.convertOffsetParentRelativeRectToViewportRelativeRect({
    rect,
    offsetParent,
    strategy
  }) : rect);
  return {
    top: (clippingClientRect.top - elementClientRect.top + paddingObject.top) / offsetScale.y,
    bottom: (elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom) / offsetScale.y,
    left: (clippingClientRect.left - elementClientRect.left + paddingObject.left) / offsetScale.x,
    right: (elementClientRect.right - clippingClientRect.right + paddingObject.right) / offsetScale.x
  };
}
const flip = function(options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: "flip",
    options,
    async fn(state) {
      var _middlewareData$flip;
      const {
        placement,
        middlewareData,
        rects,
        initialPlacement,
        platform: platform2,
        elements
      } = state;
      const {
        mainAxis: checkMainAxis = true,
        crossAxis: checkCrossAxis = true,
        fallbackPlacements: specifiedFallbackPlacements,
        fallbackStrategy = "bestFit",
        fallbackAxisSideDirection = "none",
        flipAlignment = true,
        ...detectOverflowOptions
      } = evaluate(options, state);
      const side = getSide(placement);
      const isBasePlacement = getSide(initialPlacement) === initialPlacement;
      const rtl = await (platform2.isRTL == null ? void 0 : platform2.isRTL(elements.floating));
      const fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipAlignment ? [getOppositePlacement(initialPlacement)] : getExpandedPlacements(initialPlacement));
      if (!specifiedFallbackPlacements && fallbackAxisSideDirection !== "none") {
        fallbackPlacements.push(...getOppositeAxisPlacements(initialPlacement, flipAlignment, fallbackAxisSideDirection, rtl));
      }
      const placements = [initialPlacement, ...fallbackPlacements];
      const overflow = await detectOverflow(state, detectOverflowOptions);
      const overflows = [];
      let overflowsData = ((_middlewareData$flip = middlewareData.flip) == null ? void 0 : _middlewareData$flip.overflows) || [];
      if (checkMainAxis) {
        overflows.push(overflow[side]);
      }
      if (checkCrossAxis) {
        const sides = getAlignmentSides(placement, rects, rtl);
        overflows.push(overflow[sides[0]], overflow[sides[1]]);
      }
      overflowsData = [...overflowsData, {
        placement,
        overflows
      }];
      if (!overflows.every((side2) => side2 <= 0)) {
        var _middlewareData$flip2, _overflowsData$filter;
        const nextIndex = (((_middlewareData$flip2 = middlewareData.flip) == null ? void 0 : _middlewareData$flip2.index) || 0) + 1;
        const nextPlacement = placements[nextIndex];
        if (nextPlacement) {
          return {
            data: {
              index: nextIndex,
              overflows: overflowsData
            },
            reset: {
              placement: nextPlacement
            }
          };
        }
        let resetPlacement = (_overflowsData$filter = overflowsData.filter((d) => d.overflows[0] <= 0).sort((a, b) => a.overflows[1] - b.overflows[1])[0]) == null ? void 0 : _overflowsData$filter.placement;
        if (!resetPlacement) {
          switch (fallbackStrategy) {
            case "bestFit": {
              var _overflowsData$map$so;
              const placement2 = (_overflowsData$map$so = overflowsData.map((d) => [d.placement, d.overflows.filter((overflow2) => overflow2 > 0).reduce((acc, overflow2) => acc + overflow2, 0)]).sort((a, b) => a[1] - b[1])[0]) == null ? void 0 : _overflowsData$map$so[0];
              if (placement2) {
                resetPlacement = placement2;
              }
              break;
            }
            case "initialPlacement":
              resetPlacement = initialPlacement;
              break;
          }
        }
        if (placement !== resetPlacement) {
          return {
            reset: {
              placement: resetPlacement
            }
          };
        }
      }
      return {};
    }
  };
};
async function convertValueToCoords(state, options) {
  const {
    placement,
    platform: platform2,
    elements
  } = state;
  const rtl = await (platform2.isRTL == null ? void 0 : platform2.isRTL(elements.floating));
  const side = getSide(placement);
  const alignment = getAlignment(placement);
  const isVertical = getSideAxis(placement) === "y";
  const mainAxisMulti = ["left", "top"].includes(side) ? -1 : 1;
  const crossAxisMulti = rtl && isVertical ? -1 : 1;
  const rawValue = evaluate(options, state);
  let {
    mainAxis,
    crossAxis,
    alignmentAxis
  } = typeof rawValue === "number" ? {
    mainAxis: rawValue,
    crossAxis: 0,
    alignmentAxis: null
  } : {
    mainAxis: 0,
    crossAxis: 0,
    alignmentAxis: null,
    ...rawValue
  };
  if (alignment && typeof alignmentAxis === "number") {
    crossAxis = alignment === "end" ? alignmentAxis * -1 : alignmentAxis;
  }
  return isVertical ? {
    x: crossAxis * crossAxisMulti,
    y: mainAxis * mainAxisMulti
  } : {
    x: mainAxis * mainAxisMulti,
    y: crossAxis * crossAxisMulti
  };
}
const offset = function(options) {
  if (options === void 0) {
    options = 0;
  }
  return {
    name: "offset",
    options,
    async fn(state) {
      const {
        x,
        y
      } = state;
      const diffCoords = await convertValueToCoords(state, options);
      return {
        x: x + diffCoords.x,
        y: y + diffCoords.y,
        data: diffCoords
      };
    }
  };
};
const shift = function(options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: "shift",
    options,
    async fn(state) {
      const {
        x,
        y,
        placement
      } = state;
      const {
        mainAxis: checkMainAxis = true,
        crossAxis: checkCrossAxis = false,
        limiter = {
          fn: (_ref) => {
            let {
              x: x2,
              y: y2
            } = _ref;
            return {
              x: x2,
              y: y2
            };
          }
        },
        ...detectOverflowOptions
      } = evaluate(options, state);
      const coords = {
        x,
        y
      };
      const overflow = await detectOverflow(state, detectOverflowOptions);
      const crossAxis = getSideAxis(getSide(placement));
      const mainAxis = getOppositeAxis(crossAxis);
      let mainAxisCoord = coords[mainAxis];
      let crossAxisCoord = coords[crossAxis];
      if (checkMainAxis) {
        const minSide = mainAxis === "y" ? "top" : "left";
        const maxSide = mainAxis === "y" ? "bottom" : "right";
        const min2 = mainAxisCoord + overflow[minSide];
        const max2 = mainAxisCoord - overflow[maxSide];
        mainAxisCoord = clamp(min2, mainAxisCoord, max2);
      }
      if (checkCrossAxis) {
        const minSide = crossAxis === "y" ? "top" : "left";
        const maxSide = crossAxis === "y" ? "bottom" : "right";
        const min2 = crossAxisCoord + overflow[minSide];
        const max2 = crossAxisCoord - overflow[maxSide];
        crossAxisCoord = clamp(min2, crossAxisCoord, max2);
      }
      const limitedCoords = limiter.fn({
        ...state,
        [mainAxis]: mainAxisCoord,
        [crossAxis]: crossAxisCoord
      });
      return {
        ...limitedCoords,
        data: {
          x: limitedCoords.x - x,
          y: limitedCoords.y - y
        }
      };
    }
  };
};
function getNodeName(node) {
  if (isNode(node)) {
    return (node.nodeName || "").toLowerCase();
  }
  return "#document";
}
function getWindow(node) {
  var _node$ownerDocument;
  return (node == null ? void 0 : (_node$ownerDocument = node.ownerDocument) == null ? void 0 : _node$ownerDocument.defaultView) || window;
}
function getDocumentElement(node) {
  var _ref;
  return (_ref = (isNode(node) ? node.ownerDocument : node.document) || window.document) == null ? void 0 : _ref.documentElement;
}
function isNode(value) {
  return value instanceof Node || value instanceof getWindow(value).Node;
}
function isElement(value) {
  return value instanceof Element || value instanceof getWindow(value).Element;
}
function isHTMLElement(value) {
  return value instanceof HTMLElement || value instanceof getWindow(value).HTMLElement;
}
function isShadowRoot(value) {
  if (typeof ShadowRoot === "undefined") {
    return false;
  }
  return value instanceof ShadowRoot || value instanceof getWindow(value).ShadowRoot;
}
function isOverflowElement(element) {
  const {
    overflow,
    overflowX,
    overflowY,
    display
  } = getComputedStyle(element);
  return /auto|scroll|overlay|hidden|clip/.test(overflow + overflowY + overflowX) && !["inline", "contents"].includes(display);
}
function isTableElement(element) {
  return ["table", "td", "th"].includes(getNodeName(element));
}
function isContainingBlock(element) {
  const webkit = isWebKit();
  const css2 = getComputedStyle(element);
  return css2.transform !== "none" || css2.perspective !== "none" || (css2.containerType ? css2.containerType !== "normal" : false) || !webkit && (css2.backdropFilter ? css2.backdropFilter !== "none" : false) || !webkit && (css2.filter ? css2.filter !== "none" : false) || ["transform", "perspective", "filter"].some((value) => (css2.willChange || "").includes(value)) || ["paint", "layout", "strict", "content"].some((value) => (css2.contain || "").includes(value));
}
function getContainingBlock(element) {
  let currentNode = getParentNode(element);
  while (isHTMLElement(currentNode) && !isLastTraversableNode(currentNode)) {
    if (isContainingBlock(currentNode)) {
      return currentNode;
    } else {
      currentNode = getParentNode(currentNode);
    }
  }
  return null;
}
function isWebKit() {
  if (typeof CSS === "undefined" || !CSS.supports)
    return false;
  return CSS.supports("-webkit-backdrop-filter", "none");
}
function isLastTraversableNode(node) {
  return ["html", "body", "#document"].includes(getNodeName(node));
}
function getComputedStyle(element) {
  return getWindow(element).getComputedStyle(element);
}
function getNodeScroll(element) {
  if (isElement(element)) {
    return {
      scrollLeft: element.scrollLeft,
      scrollTop: element.scrollTop
    };
  }
  return {
    scrollLeft: element.pageXOffset,
    scrollTop: element.pageYOffset
  };
}
function getParentNode(node) {
  if (getNodeName(node) === "html") {
    return node;
  }
  const result = (
    // Step into the shadow DOM of the parent of a slotted node.
    node.assignedSlot || // DOM Element detected.
    node.parentNode || // ShadowRoot detected.
    isShadowRoot(node) && node.host || // Fallback.
    getDocumentElement(node)
  );
  return isShadowRoot(result) ? result.host : result;
}
function getNearestOverflowAncestor(node) {
  const parentNode = getParentNode(node);
  if (isLastTraversableNode(parentNode)) {
    return node.ownerDocument ? node.ownerDocument.body : node.body;
  }
  if (isHTMLElement(parentNode) && isOverflowElement(parentNode)) {
    return parentNode;
  }
  return getNearestOverflowAncestor(parentNode);
}
function getOverflowAncestors(node, list) {
  var _node$ownerDocument2;
  if (list === void 0) {
    list = [];
  }
  const scrollableAncestor = getNearestOverflowAncestor(node);
  const isBody = scrollableAncestor === ((_node$ownerDocument2 = node.ownerDocument) == null ? void 0 : _node$ownerDocument2.body);
  const win = getWindow(scrollableAncestor);
  if (isBody) {
    return list.concat(win, win.visualViewport || [], isOverflowElement(scrollableAncestor) ? scrollableAncestor : []);
  }
  return list.concat(scrollableAncestor, getOverflowAncestors(scrollableAncestor));
}
function getCssDimensions(element) {
  const css2 = getComputedStyle(element);
  let width = parseFloat(css2.width) || 0;
  let height = parseFloat(css2.height) || 0;
  const hasOffset = isHTMLElement(element);
  const offsetWidth = hasOffset ? element.offsetWidth : width;
  const offsetHeight = hasOffset ? element.offsetHeight : height;
  const shouldFallback = round(width) !== offsetWidth || round(height) !== offsetHeight;
  if (shouldFallback) {
    width = offsetWidth;
    height = offsetHeight;
  }
  return {
    width,
    height,
    $: shouldFallback
  };
}
function unwrapElement(element) {
  return !isElement(element) ? element.contextElement : element;
}
function getScale(element) {
  const domElement = unwrapElement(element);
  if (!isHTMLElement(domElement)) {
    return createCoords(1);
  }
  const rect = domElement.getBoundingClientRect();
  const {
    width,
    height,
    $
  } = getCssDimensions(domElement);
  let x = ($ ? round(rect.width) : rect.width) / width;
  let y = ($ ? round(rect.height) : rect.height) / height;
  if (!x || !Number.isFinite(x)) {
    x = 1;
  }
  if (!y || !Number.isFinite(y)) {
    y = 1;
  }
  return {
    x,
    y
  };
}
const noOffsets = /* @__PURE__ */ createCoords(0);
function getVisualOffsets(element) {
  const win = getWindow(element);
  if (!isWebKit() || !win.visualViewport) {
    return noOffsets;
  }
  return {
    x: win.visualViewport.offsetLeft,
    y: win.visualViewport.offsetTop
  };
}
function shouldAddVisualOffsets(element, isFixed, floatingOffsetParent) {
  if (isFixed === void 0) {
    isFixed = false;
  }
  if (!floatingOffsetParent || isFixed && floatingOffsetParent !== getWindow(element)) {
    return false;
  }
  return isFixed;
}
function getBoundingClientRect(element, includeScale, isFixedStrategy, offsetParent) {
  if (includeScale === void 0) {
    includeScale = false;
  }
  if (isFixedStrategy === void 0) {
    isFixedStrategy = false;
  }
  const clientRect = element.getBoundingClientRect();
  const domElement = unwrapElement(element);
  let scale = createCoords(1);
  if (includeScale) {
    if (offsetParent) {
      if (isElement(offsetParent)) {
        scale = getScale(offsetParent);
      }
    } else {
      scale = getScale(element);
    }
  }
  const visualOffsets = shouldAddVisualOffsets(domElement, isFixedStrategy, offsetParent) ? getVisualOffsets(domElement) : createCoords(0);
  let x = (clientRect.left + visualOffsets.x) / scale.x;
  let y = (clientRect.top + visualOffsets.y) / scale.y;
  let width = clientRect.width / scale.x;
  let height = clientRect.height / scale.y;
  if (domElement) {
    const win = getWindow(domElement);
    const offsetWin = offsetParent && isElement(offsetParent) ? getWindow(offsetParent) : offsetParent;
    let currentIFrame = win.frameElement;
    while (currentIFrame && offsetParent && offsetWin !== win) {
      const iframeScale = getScale(currentIFrame);
      const iframeRect = currentIFrame.getBoundingClientRect();
      const css2 = getComputedStyle(currentIFrame);
      const left = iframeRect.left + (currentIFrame.clientLeft + parseFloat(css2.paddingLeft)) * iframeScale.x;
      const top = iframeRect.top + (currentIFrame.clientTop + parseFloat(css2.paddingTop)) * iframeScale.y;
      x *= iframeScale.x;
      y *= iframeScale.y;
      width *= iframeScale.x;
      height *= iframeScale.y;
      x += left;
      y += top;
      currentIFrame = getWindow(currentIFrame).frameElement;
    }
  }
  return rectToClientRect({
    width,
    height,
    x,
    y
  });
}
function convertOffsetParentRelativeRectToViewportRelativeRect(_ref) {
  let {
    rect,
    offsetParent,
    strategy
  } = _ref;
  const isOffsetParentAnElement = isHTMLElement(offsetParent);
  const documentElement = getDocumentElement(offsetParent);
  if (offsetParent === documentElement) {
    return rect;
  }
  let scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  let scale = createCoords(1);
  const offsets = createCoords(0);
  if (isOffsetParentAnElement || !isOffsetParentAnElement && strategy !== "fixed") {
    if (getNodeName(offsetParent) !== "body" || isOverflowElement(documentElement)) {
      scroll = getNodeScroll(offsetParent);
    }
    if (isHTMLElement(offsetParent)) {
      const offsetRect = getBoundingClientRect(offsetParent);
      scale = getScale(offsetParent);
      offsets.x = offsetRect.x + offsetParent.clientLeft;
      offsets.y = offsetRect.y + offsetParent.clientTop;
    }
  }
  return {
    width: rect.width * scale.x,
    height: rect.height * scale.y,
    x: rect.x * scale.x - scroll.scrollLeft * scale.x + offsets.x,
    y: rect.y * scale.y - scroll.scrollTop * scale.y + offsets.y
  };
}
function getClientRects(element) {
  return Array.from(element.getClientRects());
}
function getWindowScrollBarX(element) {
  return getBoundingClientRect(getDocumentElement(element)).left + getNodeScroll(element).scrollLeft;
}
function getDocumentRect(element) {
  const html = getDocumentElement(element);
  const scroll = getNodeScroll(element);
  const body = element.ownerDocument.body;
  const width = max(html.scrollWidth, html.clientWidth, body.scrollWidth, body.clientWidth);
  const height = max(html.scrollHeight, html.clientHeight, body.scrollHeight, body.clientHeight);
  let x = -scroll.scrollLeft + getWindowScrollBarX(element);
  const y = -scroll.scrollTop;
  if (getComputedStyle(body).direction === "rtl") {
    x += max(html.clientWidth, body.clientWidth) - width;
  }
  return {
    width,
    height,
    x,
    y
  };
}
function getViewportRect(element, strategy) {
  const win = getWindow(element);
  const html = getDocumentElement(element);
  const visualViewport = win.visualViewport;
  let width = html.clientWidth;
  let height = html.clientHeight;
  let x = 0;
  let y = 0;
  if (visualViewport) {
    width = visualViewport.width;
    height = visualViewport.height;
    const visualViewportBased = isWebKit();
    if (!visualViewportBased || visualViewportBased && strategy === "fixed") {
      x = visualViewport.offsetLeft;
      y = visualViewport.offsetTop;
    }
  }
  return {
    width,
    height,
    x,
    y
  };
}
function getInnerBoundingClientRect(element, strategy) {
  const clientRect = getBoundingClientRect(element, true, strategy === "fixed");
  const top = clientRect.top + element.clientTop;
  const left = clientRect.left + element.clientLeft;
  const scale = isHTMLElement(element) ? getScale(element) : createCoords(1);
  const width = element.clientWidth * scale.x;
  const height = element.clientHeight * scale.y;
  const x = left * scale.x;
  const y = top * scale.y;
  return {
    width,
    height,
    x,
    y
  };
}
function getClientRectFromClippingAncestor(element, clippingAncestor, strategy) {
  let rect;
  if (clippingAncestor === "viewport") {
    rect = getViewportRect(element, strategy);
  } else if (clippingAncestor === "document") {
    rect = getDocumentRect(getDocumentElement(element));
  } else if (isElement(clippingAncestor)) {
    rect = getInnerBoundingClientRect(clippingAncestor, strategy);
  } else {
    const visualOffsets = getVisualOffsets(element);
    rect = {
      ...clippingAncestor,
      x: clippingAncestor.x - visualOffsets.x,
      y: clippingAncestor.y - visualOffsets.y
    };
  }
  return rectToClientRect(rect);
}
function hasFixedPositionAncestor(element, stopNode) {
  const parentNode = getParentNode(element);
  if (parentNode === stopNode || !isElement(parentNode) || isLastTraversableNode(parentNode)) {
    return false;
  }
  return getComputedStyle(parentNode).position === "fixed" || hasFixedPositionAncestor(parentNode, stopNode);
}
function getClippingElementAncestors(element, cache) {
  const cachedResult = cache.get(element);
  if (cachedResult) {
    return cachedResult;
  }
  let result = getOverflowAncestors(element).filter((el) => isElement(el) && getNodeName(el) !== "body");
  let currentContainingBlockComputedStyle = null;
  const elementIsFixed = getComputedStyle(element).position === "fixed";
  let currentNode = elementIsFixed ? getParentNode(element) : element;
  while (isElement(currentNode) && !isLastTraversableNode(currentNode)) {
    const computedStyle = getComputedStyle(currentNode);
    const currentNodeIsContaining = isContainingBlock(currentNode);
    if (!currentNodeIsContaining && computedStyle.position === "fixed") {
      currentContainingBlockComputedStyle = null;
    }
    const shouldDropCurrentNode = elementIsFixed ? !currentNodeIsContaining && !currentContainingBlockComputedStyle : !currentNodeIsContaining && computedStyle.position === "static" && !!currentContainingBlockComputedStyle && ["absolute", "fixed"].includes(currentContainingBlockComputedStyle.position) || isOverflowElement(currentNode) && !currentNodeIsContaining && hasFixedPositionAncestor(element, currentNode);
    if (shouldDropCurrentNode) {
      result = result.filter((ancestor) => ancestor !== currentNode);
    } else {
      currentContainingBlockComputedStyle = computedStyle;
    }
    currentNode = getParentNode(currentNode);
  }
  cache.set(element, result);
  return result;
}
function getClippingRect(_ref) {
  let {
    element,
    boundary,
    rootBoundary,
    strategy
  } = _ref;
  const elementClippingAncestors = boundary === "clippingAncestors" ? getClippingElementAncestors(element, this._c) : [].concat(boundary);
  const clippingAncestors = [...elementClippingAncestors, rootBoundary];
  const firstClippingAncestor = clippingAncestors[0];
  const clippingRect = clippingAncestors.reduce((accRect, clippingAncestor) => {
    const rect = getClientRectFromClippingAncestor(element, clippingAncestor, strategy);
    accRect.top = max(rect.top, accRect.top);
    accRect.right = min(rect.right, accRect.right);
    accRect.bottom = min(rect.bottom, accRect.bottom);
    accRect.left = max(rect.left, accRect.left);
    return accRect;
  }, getClientRectFromClippingAncestor(element, firstClippingAncestor, strategy));
  return {
    width: clippingRect.right - clippingRect.left,
    height: clippingRect.bottom - clippingRect.top,
    x: clippingRect.left,
    y: clippingRect.top
  };
}
function getDimensions(element) {
  return getCssDimensions(element);
}
function getRectRelativeToOffsetParent(element, offsetParent, strategy) {
  const isOffsetParentAnElement = isHTMLElement(offsetParent);
  const documentElement = getDocumentElement(offsetParent);
  const isFixed = strategy === "fixed";
  const rect = getBoundingClientRect(element, true, isFixed, offsetParent);
  let scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const offsets = createCoords(0);
  if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
    if (getNodeName(offsetParent) !== "body" || isOverflowElement(documentElement)) {
      scroll = getNodeScroll(offsetParent);
    }
    if (isOffsetParentAnElement) {
      const offsetRect = getBoundingClientRect(offsetParent, true, isFixed, offsetParent);
      offsets.x = offsetRect.x + offsetParent.clientLeft;
      offsets.y = offsetRect.y + offsetParent.clientTop;
    } else if (documentElement) {
      offsets.x = getWindowScrollBarX(documentElement);
    }
  }
  return {
    x: rect.left + scroll.scrollLeft - offsets.x,
    y: rect.top + scroll.scrollTop - offsets.y,
    width: rect.width,
    height: rect.height
  };
}
function getTrueOffsetParent(element, polyfill) {
  if (!isHTMLElement(element) || getComputedStyle(element).position === "fixed") {
    return null;
  }
  if (polyfill) {
    return polyfill(element);
  }
  return element.offsetParent;
}
function getOffsetParent(element, polyfill) {
  const window2 = getWindow(element);
  if (!isHTMLElement(element)) {
    return window2;
  }
  let offsetParent = getTrueOffsetParent(element, polyfill);
  while (offsetParent && isTableElement(offsetParent) && getComputedStyle(offsetParent).position === "static") {
    offsetParent = getTrueOffsetParent(offsetParent, polyfill);
  }
  if (offsetParent && (getNodeName(offsetParent) === "html" || getNodeName(offsetParent) === "body" && getComputedStyle(offsetParent).position === "static" && !isContainingBlock(offsetParent))) {
    return window2;
  }
  return offsetParent || getContainingBlock(element) || window2;
}
const getElementRects = async function(_ref) {
  let {
    reference,
    floating,
    strategy
  } = _ref;
  const getOffsetParentFn = this.getOffsetParent || getOffsetParent;
  const getDimensionsFn = this.getDimensions;
  return {
    reference: getRectRelativeToOffsetParent(reference, await getOffsetParentFn(floating), strategy),
    floating: {
      x: 0,
      y: 0,
      ...await getDimensionsFn(floating)
    }
  };
};
function isRTL(element) {
  return getComputedStyle(element).direction === "rtl";
}
const platform = {
  convertOffsetParentRelativeRectToViewportRelativeRect,
  getDocumentElement,
  getClippingRect,
  getOffsetParent,
  getElementRects,
  getClientRects,
  getDimensions,
  getScale,
  isElement,
  isRTL
};
function observeMove(element, onMove) {
  let io = null;
  let timeoutId;
  const root = getDocumentElement(element);
  function cleanup() {
    clearTimeout(timeoutId);
    io && io.disconnect();
    io = null;
  }
  function refresh(skip, threshold) {
    if (skip === void 0) {
      skip = false;
    }
    if (threshold === void 0) {
      threshold = 1;
    }
    cleanup();
    const {
      left,
      top,
      width,
      height
    } = element.getBoundingClientRect();
    if (!skip) {
      onMove();
    }
    if (!width || !height) {
      return;
    }
    const insetTop = floor(top);
    const insetRight = floor(root.clientWidth - (left + width));
    const insetBottom = floor(root.clientHeight - (top + height));
    const insetLeft = floor(left);
    const rootMargin = -insetTop + "px " + -insetRight + "px " + -insetBottom + "px " + -insetLeft + "px";
    const options = {
      rootMargin,
      threshold: max(0, min(1, threshold)) || 1
    };
    let isFirstUpdate = true;
    function handleObserve(entries) {
      const ratio = entries[0].intersectionRatio;
      if (ratio !== threshold) {
        if (!isFirstUpdate) {
          return refresh();
        }
        if (!ratio) {
          timeoutId = setTimeout(() => {
            refresh(false, 1e-7);
          }, 100);
        } else {
          refresh(false, ratio);
        }
      }
      isFirstUpdate = false;
    }
    try {
      io = new IntersectionObserver(handleObserve, {
        ...options,
        // Handle <iframe>s
        root: root.ownerDocument
      });
    } catch (e) {
      io = new IntersectionObserver(handleObserve, options);
    }
    io.observe(element);
  }
  refresh(true);
  return cleanup;
}
function autoUpdate(reference, floating, update, options) {
  if (options === void 0) {
    options = {};
  }
  const {
    ancestorScroll = true,
    ancestorResize = true,
    elementResize = typeof ResizeObserver === "function",
    layoutShift = typeof IntersectionObserver === "function",
    animationFrame = false
  } = options;
  const referenceEl = unwrapElement(reference);
  const ancestors = ancestorScroll || ancestorResize ? [...referenceEl ? getOverflowAncestors(referenceEl) : [], ...getOverflowAncestors(floating)] : [];
  ancestors.forEach((ancestor) => {
    ancestorScroll && ancestor.addEventListener("scroll", update, {
      passive: true
    });
    ancestorResize && ancestor.addEventListener("resize", update);
  });
  const cleanupIo = referenceEl && layoutShift ? observeMove(referenceEl, update) : null;
  let reobserveFrame = -1;
  let resizeObserver = null;
  if (elementResize) {
    resizeObserver = new ResizeObserver((_ref) => {
      let [firstEntry] = _ref;
      if (firstEntry && firstEntry.target === referenceEl && resizeObserver) {
        resizeObserver.unobserve(floating);
        cancelAnimationFrame(reobserveFrame);
        reobserveFrame = requestAnimationFrame(() => {
          resizeObserver && resizeObserver.observe(floating);
        });
      }
      update();
    });
    if (referenceEl && !animationFrame) {
      resizeObserver.observe(referenceEl);
    }
    resizeObserver.observe(floating);
  }
  let frameId;
  let prevRefRect = animationFrame ? getBoundingClientRect(reference) : null;
  if (animationFrame) {
    frameLoop();
  }
  function frameLoop() {
    const nextRefRect = getBoundingClientRect(reference);
    if (prevRefRect && (nextRefRect.x !== prevRefRect.x || nextRefRect.y !== prevRefRect.y || nextRefRect.width !== prevRefRect.width || nextRefRect.height !== prevRefRect.height)) {
      update();
    }
    prevRefRect = nextRefRect;
    frameId = requestAnimationFrame(frameLoop);
  }
  update();
  return () => {
    ancestors.forEach((ancestor) => {
      ancestorScroll && ancestor.removeEventListener("scroll", update);
      ancestorResize && ancestor.removeEventListener("resize", update);
    });
    cleanupIo && cleanupIo();
    resizeObserver && resizeObserver.disconnect();
    resizeObserver = null;
    if (animationFrame) {
      cancelAnimationFrame(frameId);
    }
  };
}
const computePosition = (reference, floating, options) => {
  const cache = /* @__PURE__ */ new Map();
  const mergedOptions = {
    platform,
    ...options
  };
  const platformWithCache = {
    ...mergedOptions.platform,
    _c: cache
  };
  return computePosition$1(reference, floating, {
    ...mergedOptions,
    platform: platformWithCache
  });
};
function createFloatingActions(initOptions) {
  let referenceElement;
  let floatingElement;
  const defaultOptions = {
    autoUpdate: true
  };
  let options = initOptions;
  const getOptions = (mixin) => {
    return { ...defaultOptions, ...initOptions || {}, ...mixin || {} };
  };
  const updatePosition = (updateOptions) => {
    if (referenceElement && floatingElement) {
      options = getOptions(updateOptions);
      computePosition(referenceElement, floatingElement, options).then((v) => {
        Object.assign(floatingElement.style, {
          position: v.strategy,
          left: `${v.x}px`,
          top: `${v.y}px`
        });
        options?.onComputed && options.onComputed(v);
      });
    }
  };
  const referenceAction = (node) => {
    if ("subscribe" in node) {
      setupVirtualElementObserver(node);
      return {};
    } else {
      referenceElement = node;
      updatePosition();
    }
  };
  const contentAction = (node, contentOptions) => {
    let autoUpdateDestroy;
    floatingElement = node;
    options = getOptions(contentOptions);
    setTimeout(() => updatePosition(contentOptions), 0);
    updatePosition(contentOptions);
    const destroyAutoUpdate = () => {
      if (autoUpdateDestroy) {
        autoUpdateDestroy();
        autoUpdateDestroy = void 0;
      }
    };
    const initAutoUpdate = ({ autoUpdate: autoUpdate$1 } = options || {}) => {
      destroyAutoUpdate();
      if (autoUpdate$1 !== false) {
        return autoUpdate(referenceElement, floatingElement, () => updatePosition(options), autoUpdate$1 === true ? {} : autoUpdate$1);
      }
      return;
    };
    autoUpdateDestroy = initAutoUpdate();
    return {
      update(contentOptions2) {
        updatePosition(contentOptions2);
        autoUpdateDestroy = initAutoUpdate(contentOptions2);
      },
      destroy() {
        destroyAutoUpdate();
      }
    };
  };
  const setupVirtualElementObserver = (node) => {
    const unsubscribe = node.subscribe(($node) => {
      if (referenceElement === void 0) {
        referenceElement = $node;
        updatePosition();
      } else {
        Object.assign(referenceElement, $node);
        updatePosition();
      }
    });
    onDestroy(unsubscribe);
  };
  return [
    referenceAction,
    contentAction,
    updatePosition
  ];
}
function filter({
  loadOptions,
  filterText,
  items,
  multiple,
  value,
  itemId,
  groupBy,
  filterSelectedItems,
  itemFilter,
  convertStringItemsToObjects: convertStringItemsToObjects2,
  filterGroupedItems,
  label
}) {
  if (items && loadOptions)
    return items;
  if (!items)
    return [];
  if (items && items.length > 0 && typeof items[0] !== "object") {
    items = convertStringItemsToObjects2(items);
  }
  let filterResults = items.filter((item) => {
    let matchesFilter = itemFilter(item[label], filterText, item);
    if (matchesFilter && multiple && value?.length) {
      matchesFilter = !value.some((x) => {
        return filterSelectedItems ? x[itemId] === item[itemId] : false;
      });
    }
    return matchesFilter;
  });
  if (groupBy) {
    filterResults = filterGroupedItems(filterResults);
  }
  return filterResults;
}
async function getItems({ dispatch, loadOptions, convertStringItemsToObjects: convertStringItemsToObjects2, filterText }) {
  let res = await loadOptions(filterText).catch((err) => {
    console.warn("svelte-select loadOptions error :>> ", err);
    dispatch("error", { type: "loadOptions", details: err });
  });
  if (res && !res.cancelled) {
    if (res) {
      if (res && res.length > 0 && typeof res[0] !== "object") {
        res = convertStringItemsToObjects2(res);
      }
      dispatch("loaded", { items: res });
    } else {
      res = [];
    }
    return {
      filteredItems: res,
      loading: false,
      focused: true,
      listOpen: true
    };
  }
}
const css$g = {
  code: "svg.svelte-qbd276{width:var(--chevron-icon-width, 20px);height:var(--chevron-icon-width, 20px);color:var(--chevron-icon-colour, currentColor)}",
  map: null
};
const ChevronIcon = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$g);
  return `<svg width="100%" height="100%" viewBox="0 0 20 20" focusable="false" aria-hidden="true" class="svelte-qbd276"><path fill="currentColor" d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747
          3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0
          1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502
          0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0
          0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"></path></svg>`;
});
const css$f = {
  code: "svg.svelte-whdbu1{width:var(--clear-icon-width, 20px);height:var(--clear-icon-width, 20px);color:var(--clear-icon-color, currentColor)}",
  map: null
};
const ClearIcon = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$f);
  return `<svg width="100%" height="100%" viewBox="-2 -2 50 50" focusable="false" aria-hidden="true" role="presentation" class="svelte-whdbu1"><path fill="currentColor" d="M34.923,37.251L24,26.328L13.077,37.251L9.436,33.61l10.923-10.923L9.436,11.765l3.641-3.641L24,19.047L34.923,8.124
    l3.641,3.641L27.641,22.688L38.564,33.61L34.923,37.251z"></path></svg>`;
});
const css$e = {
  code: ".loading.svelte-1p3nqvd{width:var(--spinner-width, 20px);height:var(--spinner-height, 20px);color:var(--spinner-color, var(--icons-color));animation:svelte-1p3nqvd-rotate 0.75s linear infinite;transform-origin:center center;transform:none}.circle_path.svelte-1p3nqvd{stroke-dasharray:90;stroke-linecap:round}@keyframes svelte-1p3nqvd-rotate{100%{transform:rotate(360deg)}}",
  map: null
};
const LoadingIcon = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$e);
  return `<svg class="loading svelte-1p3nqvd" viewBox="25 25 50 50"><circle class="circle_path svelte-1p3nqvd" cx="50" cy="50" r="20" fill="none" stroke="currentColor" stroke-width="5" stroke-miterlimit="10"></circle></svg>`;
});
const css$d = {
  code: ".svelte-select.svelte-apvs86.svelte-apvs86.svelte-apvs86{--borderRadius:var(--border-radius);--clearSelectColor:var(--clear-select-color);--clearSelectWidth:var(--clear-select-width);--disabledBackground:var(--disabled-background);--disabledBorderColor:var(--disabled-border-color);--disabledColor:var(--disabled-color);--disabledPlaceholderColor:var(--disabled-placeholder-color);--disabledPlaceholderOpacity:var(--disabled-placeholder-opacity);--errorBackground:var(--error-background);--errorBorder:var(--error-border);--groupItemPaddingLeft:var(--group-item-padding-left);--groupTitleColor:var(--group-title-color);--groupTitleFontSize:var(--group-title-font-size);--groupTitleFontWeight:var(--group-title-font-weight);--groupTitlePadding:var(--group-title-padding);--groupTitleTextTransform:var(--group-title-text-transform);--indicatorColor:var(--chevron-color);--indicatorHeight:var(--chevron-height);--indicatorWidth:var(--chevron-width);--inputColor:var(--input-color);--inputLeft:var(--input-left);--inputLetterSpacing:var(--input-letter-spacing);--inputMargin:var(--input-margin);--inputPadding:var(--input-padding);--itemActiveBackground:var(--item-active-background);--itemColor:var(--item-color);--itemFirstBorderRadius:var(--item-first-border-radius);--itemHoverBG:var(--item-hover-bg);--itemHoverColor:var(--item-hover-color);--itemIsActiveBG:var(--item-is-active-bg);--itemIsActiveColor:var(--item-is-active-color);--itemIsNotSelectableColor:var(--item-is-not-selectable-color);--itemPadding:var(--item-padding);--listBackground:var(--list-background);--listBorder:var(--list-border);--listBorderRadius:var(--list-border-radius);--listEmptyColor:var(--list-empty-color);--listEmptyPadding:var(--list-empty-padding);--listEmptyTextAlign:var(--list-empty-text-align);--listMaxHeight:var(--list-max-height);--listPosition:var(--list-position);--listShadow:var(--list-shadow);--listZIndex:var(--list-z-index);--multiItemBG:var(--multi-item-bg);--multiItemBorderRadius:var(--multi-item-border-radius);--multiItemDisabledHoverBg:var(--multi-item-disabled-hover-bg);--multiItemDisabledHoverColor:var(--multi-item-disabled-hover-color);--multiItemHeight:var(--multi-item-height);--multiItemMargin:var(--multi-item-margin);--multiItemPadding:var(--multi-item-padding);--multiSelectInputMargin:var(--multi-select-input-margin);--multiSelectInputPadding:var(--multi-select-input-padding);--multiSelectPadding:var(--multi-select-padding);--placeholderColor:var(--placeholder-color);--placeholderOpacity:var(--placeholder-opacity);--selectedItemPadding:var(--selected-item-padding);--spinnerColor:var(--spinner-color);--spinnerHeight:var(--spinner-height);--spinnerWidth:var(--spinner-width);--internal-padding:0 0 0 16px;border:var(--border, 1px solid #d8dbdf);border-radius:var(--border-radius, 6px);min-height:var(--height, 42px);position:relative;display:flex;align-items:stretch;padding:var(--padding, var(--internal-padding));background:var(--background, #fff);margin:var(--margin, 0);width:var(--width, 100%);font-size:var(--font-size, 16px);max-height:var(--max-height)}.svelte-apvs86.svelte-apvs86.svelte-apvs86{box-sizing:var(--box-sizing, border-box)}.svelte-select.svelte-apvs86.svelte-apvs86.svelte-apvs86:hover{border:var(--border-hover, 1px solid #b2b8bf)}.value-container.svelte-apvs86.svelte-apvs86.svelte-apvs86{display:flex;flex:1 1 0%;flex-wrap:wrap;align-items:center;gap:5px 10px;padding:var(--value-container-padding, 5px 0);position:relative;overflow:var(--value-container-overflow, hidden);align-self:stretch}.prepend.svelte-apvs86.svelte-apvs86.svelte-apvs86,.indicators.svelte-apvs86.svelte-apvs86.svelte-apvs86{display:flex;flex-shrink:0;align-items:center}.indicators.svelte-apvs86.svelte-apvs86.svelte-apvs86{position:var(--indicators-position);top:var(--indicators-top);right:var(--indicators-right);bottom:var(--indicators-bottom)}input.svelte-apvs86.svelte-apvs86.svelte-apvs86{position:absolute;cursor:default;border:none;color:var(--input-color, var(--item-color));padding:var(--input-padding, 0);letter-spacing:var(--input-letter-spacing, inherit);margin:var(--input-margin, 0);min-width:10px;top:0;right:0;bottom:0;left:0;background:transparent;font-size:var(--font-size, 16px)}.svelte-apvs86:not(.multi)>.value-container.svelte-apvs86>input.svelte-apvs86{width:100%;height:100%}input.svelte-apvs86.svelte-apvs86.svelte-apvs86::placeholder{color:var(--placeholder-color, #78848f);opacity:var(--placeholder-opacity, 1)}input.svelte-apvs86.svelte-apvs86.svelte-apvs86:focus{outline:none}.svelte-select.focused.svelte-apvs86.svelte-apvs86.svelte-apvs86{border:var(--border-focused, 1px solid #006fe8);border-radius:var(--border-radius-focused, var(--border-radius, 6px))}.disabled.svelte-apvs86.svelte-apvs86.svelte-apvs86{background:var(--disabled-background, #ebedef);border-color:var(--disabled-border-color, #ebedef);color:var(--disabled-color, #c1c6cc)}.disabled.svelte-apvs86 input.svelte-apvs86.svelte-apvs86::placeholder{color:var(--disabled-placeholder-color, #c1c6cc);opacity:var(--disabled-placeholder-opacity, 1)}.selected-item.svelte-apvs86.svelte-apvs86.svelte-apvs86{position:relative;overflow:var(--selected-item-overflow, hidden);padding:var(--selected-item-padding, 0 20px 0 0);text-overflow:ellipsis;white-space:nowrap;color:var(--selected-item-color, inherit);font-size:var(--font-size, 16px)}.multi.svelte-apvs86 .selected-item.svelte-apvs86.svelte-apvs86{position:absolute;line-height:var(--height, 42px);height:var(--height, 42px)}.selected-item.svelte-apvs86.svelte-apvs86.svelte-apvs86:focus{outline:none}.hide-selected-item.svelte-apvs86.svelte-apvs86.svelte-apvs86{opacity:0}.icon.svelte-apvs86.svelte-apvs86.svelte-apvs86{display:flex;align-items:center;justify-content:center}.clear-select.svelte-apvs86.svelte-apvs86.svelte-apvs86{all:unset;display:flex;align-items:center;justify-content:center;width:var(--clear-select-width, 40px);height:var(--clear-select-height, 100%);color:var(--clear-select-color, var(--icons-color));margin:var(--clear-select-margin, 0);pointer-events:all;flex-shrink:0}.clear-select.svelte-apvs86.svelte-apvs86.svelte-apvs86:focus{outline:var(--clear-select-focus-outline, 1px solid #006fe8)}.loading.svelte-apvs86.svelte-apvs86.svelte-apvs86{width:var(--loading-width, 40px);height:var(--loading-height);color:var(--loading-color, var(--icons-color));margin:var(--loading--margin, 0);flex-shrink:0}.chevron.svelte-apvs86.svelte-apvs86.svelte-apvs86{width:var(--chevron-width, 40px);height:var(--chevron-height, 40px);background:var(--chevron-background, transparent);pointer-events:var(--chevron-pointer-events, none);color:var(--chevron-color, var(--icons-color));border:var(--chevron-border, 0 0 0 1px solid #d8dbdf);flex-shrink:0}.multi.svelte-apvs86.svelte-apvs86.svelte-apvs86{padding:var(--multi-select-padding, var(--internal-padding))}.multi.svelte-apvs86 input.svelte-apvs86.svelte-apvs86{padding:var(--multi-select-input-padding, 0);position:relative;margin:var(--multi-select-input-margin, 5px 0);flex:1 1 40px}.svelte-select.error.svelte-apvs86.svelte-apvs86.svelte-apvs86{border:var(--error-border, 1px solid #ff2d55);background:var(--error-background, #fff)}.a11y-text.svelte-apvs86.svelte-apvs86.svelte-apvs86{z-index:9999;border:0px;clip:rect(1px, 1px, 1px, 1px);height:1px;width:1px;position:absolute;overflow:hidden;padding:0px;white-space:nowrap}.multi-item.svelte-apvs86.svelte-apvs86.svelte-apvs86{background:var(--multi-item-bg, #ebedef);margin:var(--multi-item-margin, 0);outline:var(--multi-item-outline, 1px solid #ddd);border-radius:var(--multi-item-border-radius, 4px);height:var(--multi-item-height, 25px);line-height:var(--multi-item-height, 25px);display:flex;cursor:default;padding:var(--multi-item-padding, 0 5px);overflow:hidden;gap:var(--multi-item-gap, 4px);outline-offset:-1px;max-width:var(--multi-max-width, none);color:var(--multi-item-color, var(--item-color))}.multi-item.disabled.svelte-apvs86.svelte-apvs86.svelte-apvs86:hover{background:var(--multi-item-disabled-hover-bg, #ebedef);color:var(--multi-item-disabled-hover-color, #c1c6cc)}.multi-item-text.svelte-apvs86.svelte-apvs86.svelte-apvs86{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.multi-item-clear.svelte-apvs86.svelte-apvs86.svelte-apvs86{display:flex;align-items:center;justify-content:center;--clear-icon-color:var(--multi-item-clear-icon-color, #000)}.multi-item.active.svelte-apvs86.svelte-apvs86.svelte-apvs86{outline:var(--multi-item-active-outline, 1px solid #006fe8)}.svelte-select-list.svelte-apvs86.svelte-apvs86.svelte-apvs86{box-shadow:var(--list-shadow, 0 2px 3px 0 rgba(44, 62, 80, 0.24));border-radius:var(--list-border-radius, 4px);max-height:var(--list-max-height, 252px);overflow-y:auto;background:var(--list-background, #fff);position:var(--list-position, absolute);z-index:var(--list-z-index, 2);border:var(--list-border)}.prefloat.svelte-apvs86.svelte-apvs86.svelte-apvs86{opacity:0;pointer-events:none}.list-group-title.svelte-apvs86.svelte-apvs86.svelte-apvs86{color:var(--group-title-color, #8f8f8f);cursor:default;font-size:var(--group-title-font-size, 16px);font-weight:var(--group-title-font-weight, 600);height:var(--height, 42px);line-height:var(--height, 42px);padding:var(--group-title-padding, 0 20px);text-overflow:ellipsis;overflow-x:hidden;white-space:nowrap;text-transform:var(--group-title-text-transform, uppercase)}.empty.svelte-apvs86.svelte-apvs86.svelte-apvs86{text-align:var(--list-empty-text-align, center);padding:var(--list-empty-padding, 20px 0);color:var(--list-empty-color, #78848f)}.item.svelte-apvs86.svelte-apvs86.svelte-apvs86{cursor:default;height:var(--item-height, var(--height, 42px));line-height:var(--item-line-height, var(--height, 42px));padding:var(--item-padding, 0 20px);color:var(--item-color, inherit);text-overflow:ellipsis;overflow:hidden;white-space:nowrap;transition:var(--item-transition, all 0.2s);align-items:center;width:100%}.item.group-item.svelte-apvs86.svelte-apvs86.svelte-apvs86{padding-left:var(--group-item-padding-left, 40px)}.item.svelte-apvs86.svelte-apvs86.svelte-apvs86:active{background:var(--item-active-background, #b9daff)}.item.active.svelte-apvs86.svelte-apvs86.svelte-apvs86{background:var(--item-is-active-bg, #007aff);color:var(--item-is-active-color, #fff)}.item.first.svelte-apvs86.svelte-apvs86.svelte-apvs86{border-radius:var(--item-first-border-radius, 4px 4px 0 0)}.item.hover.svelte-apvs86.svelte-apvs86.svelte-apvs86:not(.active){background:var(--item-hover-bg, #e7f2ff);color:var(--item-hover-color, inherit)}.item.not-selectable.svelte-apvs86.svelte-apvs86.svelte-apvs86,.item.hover.item.not-selectable.svelte-apvs86.svelte-apvs86.svelte-apvs86,.item.active.item.not-selectable.svelte-apvs86.svelte-apvs86.svelte-apvs86,.item.not-selectable.svelte-apvs86.svelte-apvs86.svelte-apvs86:active{color:var(--item-is-not-selectable-color, #999);background:transparent}.required.svelte-apvs86.svelte-apvs86.svelte-apvs86{opacity:0;z-index:-1;position:absolute;top:0;left:0;bottom:0;right:0}",
  map: null
};
function convertStringItemsToObjects(_items) {
  return _items.map((item, index) => {
    return { index, value: item, label: `${item}` };
  });
}
function isItemFirst(itemIndex) {
  return itemIndex === 0;
}
const Select = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let hasValue;
  let hideSelectedItem;
  let showClear;
  let placeholderText;
  let ariaSelection;
  let ariaContext;
  let filteredItems;
  let $$slots = compute_slots(slots);
  const dispatch = createEventDispatcher();
  let { justValue = null } = $$props;
  let { filter: filter$1 = filter } = $$props;
  let { getItems: getItems$1 = getItems } = $$props;
  let { id = null } = $$props;
  let { name = null } = $$props;
  let { container = void 0 } = $$props;
  let { input = void 0 } = $$props;
  let { multiple = false } = $$props;
  let { multiFullItemClearable = false } = $$props;
  let { disabled = false } = $$props;
  let { focused = false } = $$props;
  let { value = null } = $$props;
  let { filterText = "" } = $$props;
  let { placeholder = "Please select" } = $$props;
  let { placeholderAlwaysShow = false } = $$props;
  let { items = null } = $$props;
  let { label = "label" } = $$props;
  let { itemFilter = (label2, filterText2, option) => `${label2}`.toLowerCase().includes(filterText2.toLowerCase()) } = $$props;
  let { groupBy = void 0 } = $$props;
  let { groupFilter = (groups) => groups } = $$props;
  let { groupHeaderSelectable = false } = $$props;
  let { itemId = "value" } = $$props;
  let { loadOptions = void 0 } = $$props;
  let { containerStyles = "" } = $$props;
  let { hasError = false } = $$props;
  let { filterSelectedItems = true } = $$props;
  let { required = false } = $$props;
  let { closeListOnChange = true } = $$props;
  let { createGroupHeaderItem = (groupValue, item) => {
    return { value: groupValue, [label]: groupValue };
  } } = $$props;
  const getFilteredItems = () => {
    return filteredItems;
  };
  let { searchable = true } = $$props;
  let { inputStyles = "" } = $$props;
  let { clearable = true } = $$props;
  let { loading = false } = $$props;
  let { listOpen = false } = $$props;
  let timeout;
  let { debounce = (fn, wait = 1) => {
    clearTimeout(timeout);
    timeout = setTimeout(fn, wait);
  } } = $$props;
  let { debounceWait = 300 } = $$props;
  let { hideEmptyState = false } = $$props;
  let { inputAttributes = {} } = $$props;
  let { listAutoWidth = true } = $$props;
  let { showChevron = false } = $$props;
  let { listOffset = 5 } = $$props;
  let { hoverItemIndex = 0 } = $$props;
  let { floatingConfig = {} } = $$props;
  let { class: containerClasses = "" } = $$props;
  let activeValue;
  let prev_value;
  let prev_filterText;
  function setValue() {
    if (typeof value === "string") {
      let item = (items || []).find((item2) => item2[itemId] === value);
      value = item || { [itemId]: value, label: value };
    } else if (multiple && Array.isArray(value) && value.length > 0) {
      value = value.map((item) => typeof item === "string" ? { value: item, label: item } : item);
    }
  }
  let _inputAttributes;
  function assignInputAttributes() {
    _inputAttributes = Object.assign(
      {
        autocapitalize: "none",
        autocomplete: "off",
        autocorrect: "off",
        spellcheck: false,
        tabindex: 0,
        type: "text",
        "aria-autocomplete": "list"
      },
      inputAttributes
    );
    if (id) {
      _inputAttributes["id"] = id;
    }
    if (!searchable) {
      _inputAttributes["readonly"] = true;
    }
  }
  function filterGroupedItems(_items) {
    const groupValues = [];
    const groups = {};
    _items.forEach((item) => {
      const groupValue = groupBy(item);
      if (!groupValues.includes(groupValue)) {
        groupValues.push(groupValue);
        groups[groupValue] = [];
        if (groupValue) {
          groups[groupValue].push(Object.assign(createGroupHeaderItem(groupValue, item), {
            id: groupValue,
            groupHeader: true,
            selectable: groupHeaderSelectable
          }));
        }
      }
      groups[groupValue].push(Object.assign({ groupItem: !!groupValue }, item));
    });
    const sortedGroupedItems = [];
    groupFilter(groupValues).forEach((groupValue) => {
      if (groups[groupValue])
        sortedGroupedItems.push(...groups[groupValue]);
    });
    return sortedGroupedItems;
  }
  function dispatchSelectedItem() {
    if (multiple) {
      if (JSON.stringify(value) !== JSON.stringify(prev_value)) {
        if (checkValueForDuplicates()) {
          dispatch("input", value);
        }
      }
      return;
    }
    {
      dispatch("input", value);
    }
  }
  function setupMulti() {
    if (value) {
      if (Array.isArray(value)) {
        value = [...value];
      } else {
        value = [value];
      }
    }
  }
  function setValueIndexAsHoverIndex() {
    const valueIndex = filteredItems.findIndex((i) => {
      return i[itemId] === value[itemId];
    });
    checkHoverSelectable(valueIndex, true);
  }
  function dispatchHover(i) {
    dispatch("hoverItem", i);
  }
  function checkHoverSelectable(startingIndex = 0, ignoreGroup) {
    hoverItemIndex = startingIndex < 0 ? 0 : startingIndex;
    if (!ignoreGroup && groupBy && filteredItems[hoverItemIndex] && !filteredItems[hoverItemIndex].selectable) {
      setHoverIndex(1);
    }
  }
  function setupFilterText() {
    if (!loadOptions && filterText.length === 0)
      return;
    if (loadOptions) {
      debounce(
        async function() {
          loading = true;
          let res = await getItems$1({
            dispatch,
            loadOptions,
            convertStringItemsToObjects,
            filterText
          });
          if (res) {
            loading = res.loading;
            listOpen = listOpen ? res.listOpen : filterText.length > 0 ? true : false;
            focused = listOpen && res.focused;
            items = groupBy ? filterGroupedItems(res.filteredItems) : res.filteredItems;
          } else {
            loading = false;
            focused = true;
            listOpen = true;
          }
        },
        debounceWait
      );
    } else {
      listOpen = true;
      if (multiple) {
        activeValue = void 0;
      }
    }
  }
  function handleFilterEvent(items2) {
    if (listOpen)
      dispatch("filter", items2);
  }
  function computeJustValue() {
    if (multiple)
      return value ? value.map((item) => item[itemId]) : null;
    return value ? value[itemId] : value;
  }
  function checkValueForDuplicates() {
    let noDuplicates = true;
    if (value) {
      const ids = [];
      const uniqueValues = [];
      value.forEach((val) => {
        if (!ids.includes(val[itemId])) {
          ids.push(val[itemId]);
          uniqueValues.push(val);
        } else {
          noDuplicates = false;
        }
      });
      if (!noDuplicates)
        value = uniqueValues;
    }
    return noDuplicates;
  }
  function findItem(selection) {
    let matchTo = selection ? selection[itemId] : value[itemId];
    return items.find((item) => item[itemId] === matchTo);
  }
  function updateValueDisplay(items2) {
    if (!items2 || items2.length === 0 || items2.some((item) => typeof item !== "object"))
      return;
    if (!value || (multiple ? value.some((selection) => !selection || !selection[itemId]) : !value[itemId]))
      return;
    if (Array.isArray(value)) {
      value = value.map((selection) => findItem(selection) || selection);
    } else {
      value = findItem() || value;
    }
  }
  function handleFocus(e) {
    if (focused && input === document?.activeElement)
      return;
    if (e)
      dispatch("focus", e);
    input.focus();
    focused = true;
  }
  function handleClear() {
    dispatch("clear", value);
    value = void 0;
    closeList();
    handleFocus();
  }
  function closeList() {
    filterText = "";
    listOpen = false;
  }
  let { ariaValues = (values) => {
    return `Option ${values}, selected.`;
  } } = $$props;
  let { ariaListOpen = (label2, count) => {
    return `You are currently focused on option ${label2}. There are ${count} results available.`;
  } } = $$props;
  let { ariaFocused = () => {
    return `Select is focused, type to refine list, press down to open the menu.`;
  } } = $$props;
  function handleAriaSelection(_multiple) {
    let selected = void 0;
    if (_multiple && value.length > 0) {
      selected = value.map((v) => v[label]).join(", ");
    } else {
      selected = value[label];
    }
    return ariaValues(selected);
  }
  function handleAriaContent() {
    if (!filteredItems || filteredItems.length === 0)
      return "";
    let _item = filteredItems[hoverItemIndex];
    if (listOpen && _item) {
      let count = filteredItems ? filteredItems.length : 0;
      return ariaListOpen(_item[label], count);
    } else {
      return ariaFocused();
    }
  }
  let list = null;
  onDestroy(() => {
  });
  function setHoverIndex(increment) {
    let selectableFilteredItems = filteredItems.filter((item) => !Object.hasOwn(item, "selectable") || item.selectable === true);
    if (selectableFilteredItems.length === 0) {
      return hoverItemIndex = 0;
    }
    if (increment > 0 && hoverItemIndex === filteredItems.length - 1) {
      hoverItemIndex = 0;
    } else if (increment < 0 && hoverItemIndex === 0) {
      hoverItemIndex = filteredItems.length - 1;
    } else {
      hoverItemIndex = hoverItemIndex + increment;
    }
    const hover = filteredItems[hoverItemIndex];
    if (hover && hover.selectable === false) {
      if (increment === 1 || increment === -1)
        setHoverIndex(increment);
      return;
    }
  }
  function isItemActive(item, value2, itemId2) {
    if (multiple)
      return;
    return value2 && value2[itemId2] === item[itemId2];
  }
  function setListWidth() {
    const { width } = container.getBoundingClientRect();
    list.style.width = listAutoWidth ? width + "px" : "auto";
  }
  let _floatingConfig = {
    strategy: "absolute",
    placement: "bottom-start",
    middleware: [offset(listOffset), flip(), shift()],
    autoUpdate: false
  };
  const [floatingRef, floatingContent, floatingUpdate] = createFloatingActions(_floatingConfig);
  let prefloat = true;
  function listMounted(list2, listOpen2) {
    if (!list2 || !listOpen2)
      return prefloat = true;
    setTimeout(
      () => {
        prefloat = false;
      },
      0
    );
  }
  if ($$props.justValue === void 0 && $$bindings.justValue && justValue !== void 0)
    $$bindings.justValue(justValue);
  if ($$props.filter === void 0 && $$bindings.filter && filter$1 !== void 0)
    $$bindings.filter(filter$1);
  if ($$props.getItems === void 0 && $$bindings.getItems && getItems$1 !== void 0)
    $$bindings.getItems(getItems$1);
  if ($$props.id === void 0 && $$bindings.id && id !== void 0)
    $$bindings.id(id);
  if ($$props.name === void 0 && $$bindings.name && name !== void 0)
    $$bindings.name(name);
  if ($$props.container === void 0 && $$bindings.container && container !== void 0)
    $$bindings.container(container);
  if ($$props.input === void 0 && $$bindings.input && input !== void 0)
    $$bindings.input(input);
  if ($$props.multiple === void 0 && $$bindings.multiple && multiple !== void 0)
    $$bindings.multiple(multiple);
  if ($$props.multiFullItemClearable === void 0 && $$bindings.multiFullItemClearable && multiFullItemClearable !== void 0)
    $$bindings.multiFullItemClearable(multiFullItemClearable);
  if ($$props.disabled === void 0 && $$bindings.disabled && disabled !== void 0)
    $$bindings.disabled(disabled);
  if ($$props.focused === void 0 && $$bindings.focused && focused !== void 0)
    $$bindings.focused(focused);
  if ($$props.value === void 0 && $$bindings.value && value !== void 0)
    $$bindings.value(value);
  if ($$props.filterText === void 0 && $$bindings.filterText && filterText !== void 0)
    $$bindings.filterText(filterText);
  if ($$props.placeholder === void 0 && $$bindings.placeholder && placeholder !== void 0)
    $$bindings.placeholder(placeholder);
  if ($$props.placeholderAlwaysShow === void 0 && $$bindings.placeholderAlwaysShow && placeholderAlwaysShow !== void 0)
    $$bindings.placeholderAlwaysShow(placeholderAlwaysShow);
  if ($$props.items === void 0 && $$bindings.items && items !== void 0)
    $$bindings.items(items);
  if ($$props.label === void 0 && $$bindings.label && label !== void 0)
    $$bindings.label(label);
  if ($$props.itemFilter === void 0 && $$bindings.itemFilter && itemFilter !== void 0)
    $$bindings.itemFilter(itemFilter);
  if ($$props.groupBy === void 0 && $$bindings.groupBy && groupBy !== void 0)
    $$bindings.groupBy(groupBy);
  if ($$props.groupFilter === void 0 && $$bindings.groupFilter && groupFilter !== void 0)
    $$bindings.groupFilter(groupFilter);
  if ($$props.groupHeaderSelectable === void 0 && $$bindings.groupHeaderSelectable && groupHeaderSelectable !== void 0)
    $$bindings.groupHeaderSelectable(groupHeaderSelectable);
  if ($$props.itemId === void 0 && $$bindings.itemId && itemId !== void 0)
    $$bindings.itemId(itemId);
  if ($$props.loadOptions === void 0 && $$bindings.loadOptions && loadOptions !== void 0)
    $$bindings.loadOptions(loadOptions);
  if ($$props.containerStyles === void 0 && $$bindings.containerStyles && containerStyles !== void 0)
    $$bindings.containerStyles(containerStyles);
  if ($$props.hasError === void 0 && $$bindings.hasError && hasError !== void 0)
    $$bindings.hasError(hasError);
  if ($$props.filterSelectedItems === void 0 && $$bindings.filterSelectedItems && filterSelectedItems !== void 0)
    $$bindings.filterSelectedItems(filterSelectedItems);
  if ($$props.required === void 0 && $$bindings.required && required !== void 0)
    $$bindings.required(required);
  if ($$props.closeListOnChange === void 0 && $$bindings.closeListOnChange && closeListOnChange !== void 0)
    $$bindings.closeListOnChange(closeListOnChange);
  if ($$props.createGroupHeaderItem === void 0 && $$bindings.createGroupHeaderItem && createGroupHeaderItem !== void 0)
    $$bindings.createGroupHeaderItem(createGroupHeaderItem);
  if ($$props.getFilteredItems === void 0 && $$bindings.getFilteredItems && getFilteredItems !== void 0)
    $$bindings.getFilteredItems(getFilteredItems);
  if ($$props.searchable === void 0 && $$bindings.searchable && searchable !== void 0)
    $$bindings.searchable(searchable);
  if ($$props.inputStyles === void 0 && $$bindings.inputStyles && inputStyles !== void 0)
    $$bindings.inputStyles(inputStyles);
  if ($$props.clearable === void 0 && $$bindings.clearable && clearable !== void 0)
    $$bindings.clearable(clearable);
  if ($$props.loading === void 0 && $$bindings.loading && loading !== void 0)
    $$bindings.loading(loading);
  if ($$props.listOpen === void 0 && $$bindings.listOpen && listOpen !== void 0)
    $$bindings.listOpen(listOpen);
  if ($$props.debounce === void 0 && $$bindings.debounce && debounce !== void 0)
    $$bindings.debounce(debounce);
  if ($$props.debounceWait === void 0 && $$bindings.debounceWait && debounceWait !== void 0)
    $$bindings.debounceWait(debounceWait);
  if ($$props.hideEmptyState === void 0 && $$bindings.hideEmptyState && hideEmptyState !== void 0)
    $$bindings.hideEmptyState(hideEmptyState);
  if ($$props.inputAttributes === void 0 && $$bindings.inputAttributes && inputAttributes !== void 0)
    $$bindings.inputAttributes(inputAttributes);
  if ($$props.listAutoWidth === void 0 && $$bindings.listAutoWidth && listAutoWidth !== void 0)
    $$bindings.listAutoWidth(listAutoWidth);
  if ($$props.showChevron === void 0 && $$bindings.showChevron && showChevron !== void 0)
    $$bindings.showChevron(showChevron);
  if ($$props.listOffset === void 0 && $$bindings.listOffset && listOffset !== void 0)
    $$bindings.listOffset(listOffset);
  if ($$props.hoverItemIndex === void 0 && $$bindings.hoverItemIndex && hoverItemIndex !== void 0)
    $$bindings.hoverItemIndex(hoverItemIndex);
  if ($$props.floatingConfig === void 0 && $$bindings.floatingConfig && floatingConfig !== void 0)
    $$bindings.floatingConfig(floatingConfig);
  if ($$props.class === void 0 && $$bindings.class && containerClasses !== void 0)
    $$bindings.class(containerClasses);
  if ($$props.handleClear === void 0 && $$bindings.handleClear && handleClear !== void 0)
    $$bindings.handleClear(handleClear);
  if ($$props.ariaValues === void 0 && $$bindings.ariaValues && ariaValues !== void 0)
    $$bindings.ariaValues(ariaValues);
  if ($$props.ariaListOpen === void 0 && $$bindings.ariaListOpen && ariaListOpen !== void 0)
    $$bindings.ariaListOpen(ariaListOpen);
  if ($$props.ariaFocused === void 0 && $$bindings.ariaFocused && ariaFocused !== void 0)
    $$bindings.ariaFocused(ariaFocused);
  $$result.css.add(css$d);
  {
    if (value)
      setValue();
  }
  {
    if (inputAttributes || !searchable)
      assignInputAttributes();
  }
  {
    if (multiple)
      setupMulti();
  }
  {
    if (multiple && value && value.length > 1)
      checkValueForDuplicates();
  }
  {
    if (value)
      dispatchSelectedItem();
  }
  {
    if (!value && multiple && prev_value)
      dispatch("input", value);
  }
  {
    if (!focused && input)
      closeList();
  }
  {
    if (filterText !== prev_filterText)
      setupFilterText();
  }
  filteredItems = filter$1({
    loadOptions,
    filterText,
    items,
    multiple,
    value,
    itemId,
    groupBy,
    label,
    filterSelectedItems,
    itemFilter,
    convertStringItemsToObjects,
    filterGroupedItems
  });
  {
    if (!multiple && listOpen && value && filteredItems)
      setValueIndexAsHoverIndex();
  }
  {
    if (listOpen && multiple)
      hoverItemIndex = 0;
  }
  {
    if (filterText)
      hoverItemIndex = 0;
  }
  {
    dispatchHover(hoverItemIndex);
  }
  hasValue = multiple ? value && value.length > 0 : value;
  hideSelectedItem = hasValue && filterText.length > 0;
  showClear = hasValue && clearable && !disabled && !loading;
  placeholderText = placeholderAlwaysShow && multiple ? placeholder : multiple && value?.length === 0 ? placeholder : value ? "" : placeholder;
  ariaSelection = value ? handleAriaSelection(multiple) : "";
  ariaContext = handleAriaContent();
  {
    updateValueDisplay(items);
  }
  justValue = computeJustValue();
  {
    if (!multiple && prev_value && !value)
      dispatch("input", value);
  }
  {
    if (listOpen && filteredItems && !multiple && !value)
      checkHoverSelectable();
  }
  {
    handleFilterEvent(filteredItems);
  }
  {
    if (container && floatingConfig?.autoUpdate === void 0) {
      _floatingConfig.autoUpdate = true;
    }
  }
  {
    if (container && floatingConfig)
      floatingUpdate(Object.assign(_floatingConfig, floatingConfig));
  }
  {
    listMounted(list, listOpen);
  }
  {
    if (listOpen && container && list)
      setListWidth();
  }
  {
    if (input && listOpen && !focused)
      handleFocus();
  }
  return ` <div class="${[
    "svelte-select " + escape(containerClasses, true) + " svelte-apvs86",
    (multiple ? "multi" : "") + " " + (disabled ? "disabled" : "") + " " + (focused ? "focused" : "") + " " + (listOpen ? "list-open" : "") + " " + (showChevron ? "show-chevron" : "") + " " + (hasError ? "error" : "")
  ].join(" ").trim()}"${add_attribute("style", containerStyles, 0)}${add_attribute("this", container, 0)}>${listOpen ? `<div class="${["svelte-select-list svelte-apvs86", prefloat ? "prefloat" : ""].join(" ").trim()}"${add_attribute("this", list, 0)}>${$$slots["list-prepend"] ? `${slots["list-prepend"] ? slots["list-prepend"]({}) : ``}` : ``} ${$$slots.list ? `${slots.list ? slots.list({ filteredItems }) : ``}` : `${filteredItems.length > 0 ? `${each(filteredItems, (item, i) => {
    return `<div class="list-item svelte-apvs86" tabindex="-1"><div class="${[
      "item svelte-apvs86",
      (item.groupHeader ? "list-group-title" : "") + " " + (isItemActive(item, value, itemId) ? "active" : "") + " " + (isItemFirst(i) ? "first" : "") + " " + (hoverItemIndex === i ? "hover" : "") + " " + (item.groupItem ? "group-item" : "") + " " + (item?.selectable === false ? "not-selectable" : "")
    ].join(" ").trim()}">${slots.item ? slots.item({ item, index: i }) : ` ${escape(item?.[label])} `}</div> </div>`;
  })}` : `${!hideEmptyState ? `${slots.empty ? slots.empty({}) : ` <div class="empty svelte-apvs86" data-svelte-h="svelte-16ffy3h">No options</div> `}` : ``}`}`} ${$$slots["list-append"] ? `${slots["list-append"] ? slots["list-append"]({}) : ``}` : ``}</div>` : ``} <span aria-live="polite" aria-atomic="false" aria-relevant="additions text" class="a11y-text svelte-apvs86">${focused ? `<span id="aria-selection" class="svelte-apvs86">${escape(ariaSelection)}</span> <span id="aria-context" class="svelte-apvs86">${escape(ariaContext)}</span>` : ``}</span> <div class="prepend svelte-apvs86">${slots.prepend ? slots.prepend({}) : ``}</div> <div class="value-container svelte-apvs86">${hasValue ? `${multiple ? `${each(value, (item, i) => {
    return `<div class="${[
      "multi-item svelte-apvs86",
      (activeValue === i ? "active" : "") + " " + (disabled ? "disabled" : "")
    ].join(" ").trim()}"><span class="multi-item-text svelte-apvs86">${slots.selection ? slots.selection({ selection: item, index: i }) : ` ${escape(item[label])} `}</span> ${!disabled && !multiFullItemClearable && ClearIcon ? `<div class="multi-item-clear svelte-apvs86">${slots["multi-clear-icon"] ? slots["multi-clear-icon"]({}) : ` ${validate_component(ClearIcon, "ClearIcon").$$render($$result, {}, {}, {})} `} </div>` : ``} </div>`;
  })}` : `<div class="${[
    "selected-item svelte-apvs86",
    hideSelectedItem ? "hide-selected-item" : ""
  ].join(" ").trim()}">${slots.selection ? slots.selection({ selection: value }) : ` ${escape(value[label])} `}</div>`}` : ``} <input${spread(
    [
      { readonly: !searchable || null },
      escape_object(_inputAttributes),
      {
        placeholder: escape_attribute_value(placeholderText)
      },
      {
        style: escape_attribute_value(inputStyles)
      },
      { disabled: disabled || null }
    ],
    { classes: "svelte-apvs86" }
  )}${add_attribute("this", input, 0)}${add_attribute("value", filterText, 0)}></div> <div class="indicators svelte-apvs86">${loading ? `<div class="icon loading svelte-apvs86" aria-hidden="true">${slots["loading-icon"] ? slots["loading-icon"]({}) : ` ${validate_component(LoadingIcon, "LoadingIcon").$$render($$result, {}, {}, {})} `}</div>` : ``} ${showClear ? `<button type="button" class="icon clear-select svelte-apvs86">${slots["clear-icon"] ? slots["clear-icon"]({}) : ` ${validate_component(ClearIcon, "ClearIcon").$$render($$result, {}, {}, {})} `}</button>` : ``} ${showChevron ? `<div class="icon chevron svelte-apvs86" aria-hidden="true">${slots["chevron-icon"] ? slots["chevron-icon"]({ listOpen }) : ` ${validate_component(ChevronIcon, "ChevronIcon").$$render($$result, {}, {}, {})} `}</div>` : ``}</div> ${slots["input-hidden"] ? slots["input-hidden"]({ value }) : ` <input${add_attribute("name", name, 0)} type="hidden"${add_attribute("value", value ? JSON.stringify(value) : null, 0)} class="svelte-apvs86"> `} ${required && (!value || value.length === 0) ? `${slots.required ? slots.required({ value }) : ` <select class="required svelte-apvs86" required tabindex="-1" aria-hidden="true"></select> `}` : ``} </div>`;
});
const css$c = {
  code: `.tabs.svelte-9chjd7.svelte-9chjd7{align-items:flex-end;display:flex;gap:.25rem}.tabs.svelte-9chjd7 .tab.svelte-9chjd7{background:var(--color-blue-spielbrett);border-radius:var(--radius-md);border-bottom-left-radius:0;border-bottom-right-radius:0;display:flex;font-family:var(--font-display);font-size:var(--scale-2);gap:.5rem;line-height:1.875rem;padding:.125rem 1.5rem;white-space:nowrap}.tabs.svelte-9chjd7 .tab.svelte-9chjd7:after{background:url('data:image/svg+xml;utf8,<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12ZM12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18Z" fill="#1B253A"/></svg>');content:"";display:block;height:1.5rem;width:1.5rem}.tabs.svelte-9chjd7 .tab.active.svelte-9chjd7{font-size:var(--scale-3);line-height:2.25rem}.content.svelte-9chjd7.svelte-9chjd7,.tabs.svelte-9chjd7 .tab.active.svelte-9chjd7{background:var(--color-bg-strong-secondary);color:var(--color-text-onstrong-secondary)}.content.svelte-9chjd7.svelte-9chjd7{border-radius:var(--radius-md);border-top-left-radius:0;border-top-right-radius:0;padding:1rem 1.5rem}`,
  map: null
};
const PlayerConfiguratorCharacter = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let side;
  let characters;
  let activeCharacter;
  let { player } = $$props;
  getGameContext();
  if ($$props.player === void 0 && $$bindings.player && player !== void 0)
    $$bindings.player(player);
  $$result.css.add(css$c);
  side = player.id === "attacker" ? "attack" : "defense";
  characters = CHARACTERS.filter((character) => character.side === side);
  activeCharacter = characters.find((character) => character.id === player.character);
  return `<div class="roles"><div class="tabs svelte-9chjd7">${each(characters, (character) => {
    return ` <button class="${[
      "unstyled tab svelte-9chjd7",
      player.character === character.id ? "active" : ""
    ].join(" ").trim()}">${escape(character.name)} </button>`;
  })}</div> <div class="content svelte-9chjd7">${validate_component(Paragraph, "Paragraph").$$render($$result, {}, {}, {
    default: () => {
      return `${activeCharacter ? `${escape(activeCharacter.description)}` : ``}`;
    }
  })}</div> </div>`;
});
const css$b = {
  code: ".configurator.svelte-1yc9tjz.svelte-1yc9tjz{grid-gap:1rem;align-content:center;display:grid;gap:1rem;justify-content:center;place-content:center}.user-select.svelte-1yc9tjz.svelte-1yc9tjz{width:36rem}.faces.svelte-1yc9tjz.svelte-1yc9tjz{display:flex;gap:1rem}.faces.svelte-1yc9tjz .face.svelte-1yc9tjz{background:var(--color-blue-spielbrett);border:1px solid transparent;border-radius:var(--radius-md);height:5rem;padding:.25rem;width:5rem}.faces.svelte-1yc9tjz .face.svelte-1yc9tjz svg{height:100%;width:100%}.faces.svelte-1yc9tjz .face.active.svelte-1yc9tjz{background:var(--color-bg-strong);color:var(--color-text-onstrong)}",
  map: null
};
const PlayerConfigurator = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let userId;
  let faceId;
  let character;
  let userItems;
  let $usersOnThisSide, $$unsubscribe_usersOnThisSide;
  let $player, $$unsubscribe_player;
  let $canUpdate, $$unsubscribe_canUpdate;
  let { playerId } = $$props;
  const side = isDefenderId(playerId) ? "defense" : "attack";
  const { machine: machine2 } = getGameContext();
  const player = useSelector(machine2.service, ({ context }) => getPlayer(playerId, context));
  $$unsubscribe_player = subscribe(player, (value) => $player = value);
  const usersOnThisSide = useSelector(machine2.service, ({ context }) => context.users.filter((user) => user.side === side));
  $$unsubscribe_usersOnThisSide = subscribe(usersOnThisSide, (value) => $usersOnThisSide = value);
  const canUpdate = useSelector(machine2.service, (snapshot) => snapshot.can({
    type: "assign role",
    character,
    playerId,
    playingUserId: userId,
    faceId
  }));
  $$unsubscribe_canUpdate = subscribe(canUpdate, (value) => $canUpdate = value);
  if ($$props.playerId === void 0 && $$bindings.playerId && playerId !== void 0)
    $$bindings.playerId(playerId);
  $$result.css.add(css$b);
  userId = $player.userId;
  faceId = $player.faceId;
  character = $player.character;
  userItems = $usersOnThisSide.map((user) => ({ value: user.id, label: user.name }));
  $$unsubscribe_usersOnThisSide();
  $$unsubscribe_player();
  $$unsubscribe_canUpdate();
  return `${validate_component(Dialog, "Dialog").$$render($$result, { title: "Rolle bestimmen", open: true }, {}, {
    default: () => {
      return `<div class="configurator svelte-1yc9tjz">${validate_component(Heading, "Heading").$$render($$result, { size: "md", spacing: "none" }, {}, {
        default: () => {
          return `1. Bestimme eine:n Spieler:in`;
        }
      })} <div class="user-select svelte-1yc9tjz">${validate_component(Select, "Select").$$render(
        $$result,
        {
          items: userItems,
          value: userId,
          required: true
        },
        {},
        {}
      )}</div> <div class="spacer"></div> ${validate_component(Heading, "Heading").$$render($$result, { size: "md", spacing: "none" }, {}, {
        default: () => {
          return `2. Wähle einen Charakter aus`;
        }
      })} ${validate_component(PlayerConfiguratorCharacter, "PlayerConfiguratorCharacter").$$render($$result, { player: $player }, {}, {})} <div class="spacer"></div> ${validate_component(Heading, "Heading").$$render($$result, { size: "md", spacing: "none" }, {}, {
        default: () => {
          return `3. Wähle einen Avatar für deinen Charakter`;
        }
      })} <div class="faces svelte-1yc9tjz">${each(FACES.slice(0, 3), (face) => {
        return `<button ${!$canUpdate ? "disabled" : ""} class="${["unstyled face svelte-1yc9tjz", face.id === faceId ? "active" : ""].join(" ").trim()}">${validate_component(Face, "Face").$$render($$result, { faceId: face.id }, {}, {})} </button>`;
      })}</div> ${validate_component(Actions$1, "Actions").$$render($$result, {}, {}, {
        default: () => {
          return `${validate_component(Button, "Button").$$render($$result, { primary: true, disabled: !$canUpdate }, {}, {
            default: () => {
              return `Bestätigen und weiter`;
            }
          })}`;
        }
      })}</div>`;
    }
  })}`;
});
const css$a = {
  code: "section.svelte-qevcdl.svelte-qevcdl{background:var(--color-bg-secondary);border-radius:var(--radius-md);margin-top:1.5rem;padding:1rem 1.25rem}.players.svelte-qevcdl.svelte-qevcdl{grid-gap:1rem;align-items:start;display:grid;grid-template-columns:repeat(4,1fr);margin-top:1.25rem}.players.svelte-qevcdl .player.svelte-qevcdl{grid-gap:1rem;background:var(--color-bg);border-radius:var(--radius-md);display:grid;gap:1rem;justify-items:center;padding:1.25rem}.players.svelte-qevcdl .player .face.svelte-qevcdl{height:6rem;width:6rem}",
  map: null
};
const AssigningRoles = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $user, $$unsubscribe_user;
  let $players, $$unsubscribe_players;
  let $users, $$unsubscribe_users;
  let $canEdit, $$unsubscribe_canEdit;
  let $canContinue, $$unsubscribe_canContinue;
  let $editingPlayerId, $$unsubscribe_editingPlayerId;
  const { machine: machine2, user } = getGameContext();
  $$unsubscribe_user = subscribe(user, (value) => $user = value);
  const editingPlayerId = useSelector(machine2.service, ({ context }) => ($user.side === "attack" ? context.attack : context.defense).editingPlayerId);
  $$unsubscribe_editingPlayerId = subscribe(editingPlayerId, (value) => $editingPlayerId = value);
  const players = useSelector(machine2.service, ({ context }) => $user.side === "attack" ? [context.attack.attacker] : context.defense.defenders);
  $$unsubscribe_players = subscribe(players, (value) => $players = value);
  const canEdit = useSelector(machine2.service, (snapshot) => snapshot.can({
    type: "start editing player",
    playerId: "attacker"
  }));
  $$unsubscribe_canEdit = subscribe(canEdit, (value) => $canEdit = value);
  const canContinue = useSelector(machine2.service, (snapshot) => snapshot.can({ type: "next step" }));
  $$unsubscribe_canContinue = subscribe(canContinue, (value) => $canContinue = value);
  const users = useSelector(machine2.service, ({ context }) => context.users);
  $$unsubscribe_users = subscribe(users, (value) => $users = value);
  $$result.css.add(css$a);
  $$unsubscribe_user();
  $$unsubscribe_players();
  $$unsubscribe_users();
  $$unsubscribe_canEdit();
  $$unsubscribe_canContinue();
  $$unsubscribe_editingPlayerId();
  return `${validate_component(Heading, "Heading").$$render($$result, { separator: true }, {}, {
    info: () => {
      return `Schritt 3 von 3`;
    },
    default: () => {
      return `Rollenverteilung`;
    }
  })} <section class="svelte-qevcdl">${validate_component(Heading, "Heading").$$render($$result, { centered: true }, {}, {
    default: () => {
      return `${escape($user.side === "attack" ? "Angriff" : "Verteidigung")}`;
    }
  })} ${validate_component(Paragraph, "Paragraph").$$render($$result, { width: "full" }, {}, {
    default: () => {
      return `Die Rollenverteilung wird von der Spielleitung übernommen. Es müssen für jede Rolle ein:e
    Spieler:in bestimmt und bestätigt werden. Die restlichen Teilnehmenden können das Spielgeschehen
    beobachten und das Team beraten.`;
    }
  })} <div class="players svelte-qevcdl">${each($players, (player, i) => {
    return `<div class="player svelte-qevcdl">${player.isConfigured ? `${validate_component(Heading, "Heading").$$render(
      $$result,
      {
        centered: true,
        spacing: "none",
        size: "sm"
      },
      {},
      {
        default: () => {
          return `${escape(player.character)}`;
        }
      }
    )} ${escape($users.find((user2) => user2.id === player.userId)?.name)} <div class="face svelte-qevcdl">${validate_component(Face, "Face").$$render($$result, { faceId: player.faceId }, {}, {})} </div>` : ``} ${validate_component(Button, "Button").$$render($$result, { size: "small", disabled: !$canEdit }, {}, {
      default: () => {
        return `Rolle ${escape(player.isConfigured ? "wechseln" : `${i + 1} bestimmen`)} `;
      }
    })} </div>`;
  })}</div></section> ${validate_component(Actions$1, "Actions").$$render($$result, {}, {}, {
    default: () => {
      return `${validate_component(Button, "Button").$$render(
        $$result,
        {
          primary: true,
          disabled: !$canContinue,
          disabledReason: $user.isAdmin ? "Alle Rollen müssen zugewiesen sein" : "Nur Administrator:innen dürfen bestätigen"
        },
        {},
        {
          default: () => {
            return `Bestätigen und weiter`;
          }
        }
      )}`;
    }
  })} ${$editingPlayerId !== void 0 ? ` ${validate_component(PlayerConfigurator, "PlayerConfigurator").$$render($$result, { playerId: $editingPlayerId }, {}, {})}` : ``}`;
});
const css$9 = {
  code: ".lobby.svelte-qtul5v{padding:4rem 7rem}",
  map: null
};
const Lobby = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $section, $$unsubscribe_section;
  const { machine: machine2 } = getGameContext();
  const section = useSelector(machine2.service, (snapshot) => {
    let section2 = void 0;
    if (snapshot.matches("Lobby.Assigning sides")) {
      section2 = "Assigning sides";
    } else if (snapshot.matches("Lobby.Assigning roles")) {
      section2 = "Assigning roles";
    } else if (snapshot.matches("Lobby.Waiting for other side")) {
      section2 = "Waiting for other side";
    }
    return section2;
  });
  $$unsubscribe_section = subscribe(section, (value) => $section = value);
  $$result.css.add(css$9);
  $$unsubscribe_section();
  return `<div class="lobby svelte-qtul5v">${$section === "Assigning sides" ? `${validate_component(AssigningSides, "AssigningSides").$$render($$result, {}, {}, {})}` : `${$section === "Assigning roles" ? `${validate_component(AssigningRoles, "AssigningRoles").$$render($$result, {}, {}, {})}` : `${$section === "Waiting for other side" ? `Waiting for other side` : `Unknown lobby state`}`}`} </div>`;
});
const CollectItem = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $startedCollecting, $$unsubscribe_startedCollecting;
  let $collectableItems, $$unsubscribe_collectableItems;
  const { machine: machine2 } = getGameContext();
  const collectableItems = useSelector(machine2.service, ({ context }) => {
    const gameState = GameState.fromContext(context);
    const playerPosition = gameState.activePlayerPosition;
    return gameState.getItemsForCoordinate(playerPosition).filter((item) => isItemIdOfSide(item.item.id, gameState.activeSide));
  });
  $$unsubscribe_collectableItems = subscribe(collectableItems, (value) => $collectableItems = value);
  const startedCollecting = useSelector(machine2.service, ({ context }) => {
    const gameState = GameState.fromContext(context);
    return isActionEventOf(gameState.lastEvent, "collect");
  });
  $$unsubscribe_startedCollecting = subscribe(startedCollecting, (value) => $startedCollecting = value);
  $$unsubscribe_startedCollecting();
  $$unsubscribe_collectableItems();
  return `${!$startedCollecting ? `${validate_component(Button, "Button").$$render($$result, { disabled: $collectableItems.length === 0 }, {}, {
    default: () => {
      return `Gegenstand einsammeln`;
    }
  })}` : `${validate_component(Button, "Button").$$render($$result, {}, {}, {
    default: () => {
      return `Abbrechen`;
    }
  })} ${each($collectableItems, (collectableItem) => {
    return `${validate_component(Button, "Button").$$render($$result, {}, {}, {
      default: () => {
        return `${escape(collectableItem.item.id)}`;
      }
    })}`;
  })}`}`;
});
const css$8 = {
  code: ".actions.svelte-wm8yo3.svelte-wm8yo3{left:calc(11.11111%*(var(--x)));position:absolute;top:calc(12.5%*(var(--y)))}.actions.svelte-wm8yo3 ul.svelte-wm8yo3{background:var(--color-bg);list-style-type:none;padding:1rem;position:absolute}.actions.svelte-wm8yo3 ul.svelte-wm8yo3:not(.on-left){left:calc(var(--board-square-size) + .3rem)}.actions.svelte-wm8yo3 ul.on-left.svelte-wm8yo3{right:.3rem}.actions.svelte-wm8yo3 ul.svelte-wm8yo3:not(.on-top){top:.3rem}.actions.svelte-wm8yo3 ul.on-top.svelte-wm8yo3{bottom:calc(0px - var(--board-square-size) + .3rem)}",
  map: null
};
const Actions = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $canPerformAction, $$unsubscribe_canPerformAction;
  let $activePlayerPosition, $$unsubscribe_activePlayerPosition;
  const { machine: machine2 } = getGameContext();
  const canPerformAction = useSelector(machine2.service, (state) => state.matches("Playing.Gameloop.Playing.Ready for action"));
  $$unsubscribe_canPerformAction = subscribe(canPerformAction, (value) => $canPerformAction = value);
  const activePlayerPosition = useSelector(machine2.service, ({ context }) => {
    const gameState = GameState.fromContext(context);
    return gameState.activePlayerPosition;
  });
  $$unsubscribe_activePlayerPosition = subscribe(activePlayerPosition, (value) => $activePlayerPosition = value);
  $$result.css.add(css$8);
  $$unsubscribe_canPerformAction();
  $$unsubscribe_activePlayerPosition();
  return `${$canPerformAction ? `<div class="actions svelte-wm8yo3"${add_styles({
    "--x": $activePlayerPosition[0],
    "--y": $activePlayerPosition[1]
  })}><ul class="${[
    "svelte-wm8yo3",
    ($activePlayerPosition[0] > 5 ? "on-left" : "") + " " + ($activePlayerPosition[1] > 4 ? "on-top" : "")
  ].join(" ").trim()}"><li>${validate_component(CollectItem, "CollectItem").$$render($$result, {}, {}, {})}</li></ul></div>` : ``}`;
});
const css$7 = {
  code: "svg.svelte-1fqtuea{grid-column:1/-1;grid-row:1/-1}",
  map: null
};
const Backdrop = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$7);
  return `<svg viewBox="0 0 804 715" fill="none" xmlns="http://www.w3.org/2000/svg" class="svelte-1fqtuea"><g clip-path="url(#a)"><path d="M804 0H0v715h804V0Z" fill="#1B253A"></path><mask id="b" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="0" y="0" width="804" height="715"><path d="M804 0H0v715h804V0Z" fill="#fff"></path></mask><g mask="url(#b)"><path d="M291 651 78 822l264 19-51-190Z" fill="#747D4A"></path><path d="m52 154 99 41 13-295L52 154Z" fill="#257A86"></path><path d="m-163 10 113 211L6 28l-169-18Z" fill="#247771"></path><path d="m6 28-56 193 102-67L6 28Z" fill="#297877"></path><path d="m52 154-102 67 201-26-99-41Z" fill="#227776"></path><path d="m-50 221 66 228 135-254-201 26Z" fill="#2C7871"></path><path d="m-50 221-28 271 94-43-66-228Z" fill="#317865"></path><path d="m-78 492 48 148 46-191-94 43Z" fill="#37785E"></path><path d="m6 28 46 126 112-254L6 28Z" fill="#2F7B85"></path><path d="m-30 640-112 90 220 92-108-182Z" fill="#4A7A50"></path><path d="M-163 10 6 28l158-128-327 110Z" fill="#2D7A7E"></path><path d="m-221-59 58 69 327-110-385 41Z" fill="#246E4C"></path><path d="m708 634 141 73 105-178-246 105Z" fill="#934038"></path><path d="m16 449-46 191 265-149-219-42Z" fill="#37785E"></path><path d="M235 491-30 640l321 11-56-160Z" fill="#436D56"></path><path d="M151 195 16 449l219 42-84-296Z" fill="#2D726B"></path><path d="M-30 640 78 822l213-171-321-11Z" fill="#4C764F"></path><path d="m164-100-13 295L300 62 164-100Z" fill="#2B7B8D"></path><path d="m355 309 124 182 16-252-140 70Z" fill="#585E60"></path><path d="m300 62 55 247 140-70L300 62Z" fill="#3C597F"></path><path d="M300 62 151 195l204 114-55-247Z" fill="#336882"></path><path d="m151 195 84 296 120-182-204-114Z" fill="#3C6671"></path><path d="m235 491 56 160 188-160H235Z" fill="#67715B"></path><path d="M355 309 235 491h244L355 309Z" fill="#56655E"></path><path d="m300 62 195 177 26-157-221-20Z" fill="#3A5584"></path><path d="M164-100 300 62l221 20-357-182Z" fill="#34638D"></path><path d="m495 239 178 250 20-306-198 56Z" fill="#856865"></path><path d="m291 651 51 190 210-58-261-132Z" fill="#8B674A"></path><path d="M479 491 291 651l261 132-73-292Z" fill="#8F6E4D"></path><path d="m708 634-44 143 54 34-10-177Z" fill="#853F33"></path><path d="M849 707 718 811l150 94-19-198Z" fill="#8E3D35"></path><path d="m683-20 10 203 53-107-63-96Z" fill="#725981"></path><path d="m495 239-16 252 194-2-178-250Z" fill="#886D5F"></path><path d="M683-20 521 82l172 101-10-203Z" fill="#554C76"></path><path d="M829 378 673 489l281 40-125-151Z" fill="#945050"></path><path d="M164-100 521 82 683-20l-519-80Z" fill="#3F5684"></path><path d="m521 82-26 157 198-56L521 82Z" fill="#524F7F"></path><path d="m552 783 112-6 44-143-156 149Z" fill="#914134"></path><path d="m479 491 73 292 156-149-229-143Z" fill="#9A5C4E"></path><path d="m673 489-194 2 229 143-35-145Z" fill="#9A6556"></path><path d="m693 183 136 195 41-242-177 47Z" fill="#8A5F6E"></path><path d="m693 183-20 306 156-111-136-195Z" fill="#936360"></path><path d="m708 634 10 177 131-104-141-73Z" fill="#994B3A"></path><path d="m746 76 124 60 243-236L746 76Z" fill="#765076"></path><path d="m683-20 63 96 367-176-430 80Z" fill="#644B7B"></path><path d="m746 76-53 107 177-47-124-60Z" fill="#7A5A6F"></path><path d="m673 489 35 145 246-105-281-40Z" fill="#924E4C"></path></g><mask id="c" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="0" y="0" width="804" height="715"><path d="M804 0H0v715h804V0Z" fill="#fff"></path></mask><g opacity=".1" stroke="#272D2E" stroke-width="1.2" stroke-miterlimit="10" mask="url(#c)"><path d="m1145 285-1-1-3 1-2 1-2 2-5 6h-4a122 122 0 0 1-8 0h-9l-3-6-3-4 3-3-1-2v-1l-1-1c-3-1-9-6-9-7h-4l-5-2h-6c-1 0-4 0-5-3l-1-3v-2l-3-3-1-3v-1c1-2 2-4 0-5h-1c-3-1-4-2-4-4v-4l-2-3-1-2v-4l-1-1h-1v-3l1-1-1-1h-2l-1-1v-4l-2-1-3-2c0-2-1-3-2-3h-7a59 59 0 0 0-15-7 253 253 0 0 0-26 8l-5 5v5h1l3 1 1 2v7h1l-1 2-4 4-8 22h-1l1 2 1 1 1 2-3 2-5 3-3 2-4 1-1-1-8-1-2 4-1 1-1 4-4 9-2 3-2 3 1 4 5 3h14l2-1 3-2c2-2 3 0 5 1a22 22 0 0 0 6 4c3 1 5 2 6 4l2 3 2 3-1 2c-3 2-5 3-8 2l-2-1c-1-1-1-2-2-1l-7 2h-4l-2 5h-5c0 1-4 9-6 10l-7 5v1h-8v1c0 2 0 4-2 6l-5 1-8 1-5-1c-1-1-5 0-7 1l-3 5 5 10s-8 5-9 8l-5 6-3 2-7 4-17 2a312 312 0 0 0-28 14l-2-2v-2h-17l-10-5-8-2h-8l-3 1h-6a608 608 0 0 0-12 0h-6l-6-1-2 1h-2l-1 1v1h-1l-2-2-7-10v-3l-2-3-1-2 1-2h-8c-2 0-3-1-5-3-3-2-6-4-11-5h-20c-3 0-4-1-5-4l-1-2v-2l2-5-1-3 1-5-1-2-1-1c-2-4-4-10-6-11l-4-3-1 1-1-1-1-2-2-1h-5l-3-2-4-3-1-1-2-3-5 3h-1l-2 2c0 1-1 2-3 1l-6-1-6-1-5-1-6 23c1 1 3 3 2 4v1l-1 1h-6v-2l-3 1-4 2-6 3h-5c-1-1-1-1-2 1l-1 2v1l1 1 3 2 2 2v6l3 6 1 2 1 2c0 1 1 2-1 3l-2 1v2l1 1-1 1h-1l-1 2v5h-1l2 3v2h-4l-1 1-5 3-7 5-3 2-5 4c-1 2-2 2-3 1l-2-1c-2 0-5 1-7 4l-2 3-4 4-5 1-1-5-1 2-5 1h-1l-1 1-1 1-2 2-4 2-2 1-1 1 1 2v4l-1 1h-3l2 4 1 4 1 2 4 2h2c3 1 4 1 5 3v2l1 2 1 1 1 1v6l-2 2v1l-2-1h-2l-1 1v1l1 1v2h-10l-3 2c-1 1-2 1-2 3l-2 4h-1l-2 1h-1l2 2c2 3 4 4 7 4l2 1h3l2 2-1 4-1 2-1 1-1 2-1 1 1 2 1 3 1 1v10c-1 2-1 3 1 4h2l3 1 5 3v2h6c1 2 3 2 3 2l1 2 2 1 2-1 3-1 4-3 4-3 1-2-1-2c1-2 2-3 5-3l1-1 2-1 6 1 2 1 1 1h2l2-1h2l1 1v1l1 3 2-1 1-1 1 1-1 3 1 2 2 4 1 1 1 1 1 3v5c0 1 0 2 2 2h5l2 1c2 0 3 0 3 2v1c1 2 1 3 3 3l1-1h2l1 2 3 3h1l1 1 1-1v-2l2-1h7l1 2v1l-1 1 1 1h1l3 1 3 2 4 2 1 2 2 3h2l2-1h4v2l1 3 2 1 2 2h1l3-1 1 3v1h3l2-1 3 4 1 1h2v1l1 1h1l1-2 1-1h1l7 3h9v2l-1 4 3-2 2 2 2 1 3-1 2-2 2-2h13l3-1h5l1 1 3 2 1 2 1 1v6h1l1 1-1 1h13l2-1v-1l2-2 1-1 3-1h2l4-4 3-2 3-2c1-2 2-2 3-1l2 1 5 1 1 1 3 1 3 2 1-1v-4l-2-1-3-3-1-2v-1l-1-2-3-3-2-1-3 1-3 1-5 1-3-1-2-1-1 1-1 2-1 1-1 1-2 1-2 2-4 1-2 1-2 1-1 1-2 2-1 3h-4v-1l2 1 1-1 2-2 2-2 1-1 2-2h2l4-1 2-2 2-2 1-2 1-1 2-1 2 1h8l3-1 2-1 1-1 2 2 3 3 1 2h1l1 3 2 3 2 1 3-3 1-1v1l3 2 2 5v3l-1 1h1l1-1 1-1 2 1 1 6a101 101 0 0 0 0 8l-1 2v5l-1 1-2 1h-1l-1 1-1 1-1 1c-2 1-2 1-2 3l-1 2-1 1-1 1v2h2l1 1v2l-2 2v1h4l2-2 3-1h5v1l-1 3c-1 1 0 2 1 3v4h-1l2 1 2-1 2 1h1l-3 9 1-1c2 0 3 1 4 3l3 3c2 4 3 5 4 4l4-1 3-2 2 1v1l1 2 2 1 2-1-1-6v-6h4v1l3-4 3 1 2 2 3 1 1-1v-1l1-3 2 2 1-3 1 1v1l2 2 1-2v-1l1-1v1l-1 1h2l3-3 4-2 2-1h2l2 2 3 3 2-1 4-1 2 1h1l1 1-1 1-1 2-1 2v2c2 2 3 3 5 3h1l1 1c2 0 2-1 3-4 1-2 3-1 4-2 2-1 2 0 4 1 2 2 4 1 7 0 2 0 3 3 2 4-1 2 0 5 1 8s5 3 7 2 1-3-1-4l-2-4c0-1 3-4 4-3l10-2c4-1 2-3 3-3h5c2-1 2-4 5-4s3-1 3-6c1-6 2-4 5-1 2 3 3 4 4 2l2-2 4-1 6-1 6-2c5-1 6-2 7-6l1-3h5l2-3 4-2 1-2-4-1c-1-1 1-2 2-3h6c3 0 0-2 0-3 0-2 1-3 2-3v-4l2-1h3l1-5-2-2v-2l3-1-1-2-3-2 1-4c2-1 2 2 4 2l5-7 3-12c2-3 4-1 5-2 2-2-1-3-1-5s2-2 2-3l-5-2c-1-1 2-1 5-1 2 0 2-1 2-3 0-1-1-3-2-2s-4 3-6 2c-3 0 0-1 2-2 2 0 3-2 3-4 1-2-2-2-3-3l-6-2c-4 0-2 3-4 2-3 0-3-3-1-4l4-1 3-3 4-2c1-1-1-5-3-6-1-2-4-2-7-4-3-1-5-3-4-4l3 2 4-1 6 1c3 0 0 0 0-3l-5-5-6-3c-2-1-1-5-2-6l-5-5c-1-2-1-10-9-12-7-2-8-7-9-9-1-1 0-5 1-8 1-2 3-2 5-3 2 0 1-2 0-4s1-3 4-3 3-3 7-5 8-2 11-1c2 0 2-6 2-9 1-4-3-3-8-3s-8 0-11-2c-4-2-6-3-10 5-4 7-10 4-11 2-2-3-2-7-5-7s-4-1-9-4c-5-4-4-14-1-13 4 0 11-1 11-3l1-9c1-2 9-5 9-8 1-3 1-11 10-10s4 12 3 14v7c2 1 3 2 3 5 1 4-4 2-5 3-2 2 0 4 3 4 2 0 4-1 7-7s10-9 14-10c3 0 4-1 8 1v-1l3-3 1-3v-3l1-1 2-4 3-2 1-1 3-3a98 98 0 0 0 1-6l1-5 3-2 2 4 8-1 1-4-3-4 6-2 2-4 6-2-3-9 5 1 2 2 4 3s1-1 2 1h1c2-1 3-2 3-4 0-1 0-4 2-6l2-2v-2l1-5c-1-3 1-4 2-4l2-1 3-5v-1l3-1h1l2-6 3-2v-2l2-5 1-1 2-1v-8h1l3-2 4-4 2-3 2-3-2-2Z"></path><path d="M559 469h-2l-7 1c-2 0-3 0-3 2l-3 4-2 2-1-1v-1l-3 5 3 4 2 2-1 3-1 1 2 1v1l-6 8-1 2c1 0 2 3 0 5l-5 1-3-1-3 1 1 1 3 5 1 4-5 1-3 4-1 2h1v1c1 0 1 0 0 0l-4 2 1 1 1 1-1 5-1 1-1 1c-1 1-1 2-3 2l-1-2-1-1-4 1-4 2-3 1v1l3 3-1 1h-5l-4 1-3 1-4 4c-1 1 0 2 1 3l1 1v6h-10l-3-1-2-1-3 2-2 2h-3a8 8 0 0 1-3 0l-5-1h-10l2 5c0 2 1 4 4 5h9-1v10l3 2 4 2-1 2-2 5h-2v-1l-2 1c-2 0-4 2-5 3l-3 2h-1v12l11-1 6-1 6 1 9-2c3-1 10-1 13 2l5 4c4 2 4 9 5 11s7 5 10 2l4-1a10 10 0 0 1 4-2l1-2 1-2h3l2 1 3 1 2-1c1-1 2-2 3-1l3-1h1l1 1h4v-4l-3-8v-4h-3c-1-1-4-2-3-3l1-8h-5l-2-1c-1-3-1-9 4-12 4-3 6-4 7-3h1v1c1 1 1 2 3 1l3-1 5-1c3-1 3-2 5-5a423 423 0 0 1 9-13c1-3 2-6 5-8l4-3v-2l2-2 3-3 2-4h1v-6l-2-2h1l-3-1-1-1-3-3h-5l-1-1v-1l-4-3h-3l-3-1-1-4v-4l1-2c0-1 1-2-1-4l-1-1-1-3v-3l1-2 1-2 1-1c1-1 2-2 1-4l-2-1-2-1-3-1c-2 0-5-1-7-4l-1-3h3v-1l2-3 2-3 4-2h-3ZM339 618l4 2h1l1-4-1-10c-1-6-2-5-4-6s-2 2-3 3 0 4 1 6v5h-1l2 3v1Z"></path><path d="m382 645-25-3-8-18v-1l-4-1v-1h-3l-3-3a75 75 0 0 0-4-6l-2-5-2-3-2-7-1-4-2-2-3-4-2-2-4-3-3-2-1-3a17 17 0 0 0-5 1l-2-5-10-2-6 1c-5 0-10 1-12-1-1-2-20-19-30-25l-25-11h-2l-3 2-19 5 4 5 5 8v1c-1 1-3 4-5 4l-3 1c-2-1-3-1-5 2l-1 2c-1 2-2 4-5 4l-15-3-1 8c-1 4-2 5-1 6l6 3 8 11c2 4 3 9 7 12 5 4 5 8 6 11 0 4 4 5 10 8 5 4 8 12 9 23 1 10 8 16 13 18 4 3 7 6 10 13 3 8 6 12 9 15 4 3 3 5 5 8l5 6 2-5h1l1 1 1 1h12l7-3 8-1 4 2 3 2c1-1 3-4 4-9 0-5 16-8 20-8l24-3 30-12 6-21-1-7ZM31 248l-1-1 1-2 2-2v-3l-1-1-1 1h-3l-1 1-4 1 1 1c5 2 0 5-2 6l-16-1 3 2h7l3 1h7l2-1 2-1h1v-1Z"></path><path d="m55 235-2-1-1-1 1-1v-1l1-1-1-1h-1l-2-3-1-2-5-2h-1l-2-2v-1l-2 2h-3c-1 0-4 0-5-2h-2l-1 1h-6c-3-1-4 0-8 3l-4 2-2 2c1 3 6 10 8 11l6 3a22 22 0 0 0 6-1l3-1h2v4l-1 2-1 1v5h7l2-2h2l1-1 1-1v-1l1 1 1 1h1v-1h-1v-5l1-1 1-1v-1l1-1 1-1 1-1 1-1h4-1Zm1346-451c-2-5-5-4-4-7 2-4 1-8-2-10-3-1-8-10-6-13 3-3 7-6 5-11s-5-3-5-8c0-4-1-6-5-7l-15-4c-2-1-9 0-10 1 0 1-4-1-11 8-6 8-7 0-13-4-5-4-14-1-18-2-4 0-11 0-21-2l-18-1c-5 0-9-3-19-6s-15-2-25-3c-10-2-30 7-38 8s-18 1-15 3 4 7 7 12c3 6 8 2 16 14s-7 11-11 8c-3-3-2-5-6-5-3 0-9-1-11-6s2-5 4-10c1-5-8-6-14-6-5 0-1 7-1 14s-6 5-10 6c-3 0-9 5-13 4s-6-2-10 3c-4 4-9 6-19 8s-15 0-20-15-22-13-28-13c-7 0-6 3-10 3l-12 8c-5 3-14 9-19 10s-4-4-5-7c-1-4-12-7-14-6-1 2-5 9-7 7-1-1 2-4-2-6-5-2-5 4-6 3 0-2-6-4-8-4-2-1-2-5 2-6 5-1 1-6-4-9-5-2-17-1-22 2-5 4-9 7-10 6-1-2 4-3 0-3l-31 2h-16c-6-1-7 4 2 5 8 1 1 6-5 7-6 2 0 9 1 11 2 2 3-1 5-1 1 1-1 4 1 5 3 1 1 2 6 5 5 2 3 5 1 7s-3 1-5-2c-3-3-7 2-8 3-1 2-3 4-11 4s-11 1-11 6-4 4-9 4c-4 0-9-2-12-5-4-3-5-5-6-4s2 4 3 8c1 5 1 7 5 13 3 7 1 11-4 11-4 1-3 0-7-3-5-2-9-8-14-10-6-2-10-2-15-5s-7-7 0-5 8-2 7-6-4-5-7-7c-4-1-5-5-11-13-6-7-18-8-24-7-6 0 0 5-3 5-3-1-3-3-16-5-14-2-9 10-3 16s2 7 0 7-4-2-8 1c-3 4-13 5-25 5-11 0-8-6-6-11 1-5-10-1-13 0-2 1-11-1-16 2-5 2-14 12-14 7-1-6-6-2-6-1s-2 3-6 3c-5 1-4 0-6-1s-4-1-3-4c1-2-1-4-2-3s1 6-3 3-8 0-8 1v7c-1 5 4 3 6 1 2-3 4-4 5-3l-1 5-6 8c-3 4-4 5-12 10-7 4-7 0-6-3 0-2 0-8 2-9s4-2 5-5c2-3-1-6 0-9 1-4 3-6 2-8s1-4 3-7l3-7v-7c0-3 4-6 4-9l-2-12c-1-2-4-1-4-2-1-1 1-3 1-5 0-1-3-6-7-8-3-3-4-6-7-7-3 0 1 5 0 6s-5-3-6-6c-2-2-4-4-8-5-5-2-8-1-9-5 0-3-5 0-10 4s-7 4-11 4c-4 1-4 1-3 3 2 2 2 6 0 10-1 4-3 3-7-2-3-6-2-17-7-18-6 0-11 5-13 5-3 0-1-2 0-6 2-4 1-7-1-9s-5-2-10-3c-4-1-7-1-11 2-5 4-2 14-4 18s1 6 1 8c1 3-4 3 4 9 8 7-1 12-4 12-2 1-4 2-4 5 1 3 2 4 0 4l-4 5-4 4c-1 0-1 5-2 4l-2-2c0 1-3 4-3 2v-5c-1-3-6-1-12 1s-11 4-11 7 1 5-2 9c-3 3-19 10-19 13l-4 10c-1 3-3 9-3 14s3 6 5 7c1 1-4 8 4 9 7 0 2 6 1 6l-13 6c-3 0-6 3-10 4l-14 4c-8 3-5 8-2 11 2 3 6 6 7 11 1 4 4 8 10 7 6 0 5 0 10 7s1 10-3 10l-8-5c-2-2-3-4-5-4s-5-1-8-4c-4-3-12-1-14-1-1 1-7 7 1 9 9 2 3 10-3 6-6-3-9-2-10 1-2 2 2 5 9 11s-4 7-5 6c-2-1-6-9-7-10l-3-7c1-3-1-4-1-6 1-3-2-2-2-4 1-3-1-3-4-7-2-3-4-2-2 2 2 3 3 8 3 12 0 5-4 6-6 9-1 3 2 3 0 10-1 7-8 2-9 0v-7c1-2-1-14-2-18-1-3-3-3-6-5s-7-2-10-1h-12c-3-1-3 2-3 5l2 13c2 8-1 17-6 24-4 7 2 13 5 15s1 6 3 9 0 4 1 9 3 4 9 5c5 1 4 1 4 5 1 3 5 4 11 7 5 3 3 11 1 13-3 1-7-2-9-4l-7-7-11-4-9-3-6-6c-4-2-12-2-21-2l-11 1-1 1c-2-4-6-5-10-8l-6-5-2 1c-2 2-3 4 0 8s6 5 8 6l5 2c1 0 5-1 5-3v2l2 7c2 3 6 4 7 7s-1 4-2 6c0 2-3 0-5 0l1 4c1 2-1 5-4 5s-1-7-2-11c0-4-4-2-8 1s-7 7-10 7-10 0-13 2-5 7-7 7c-3 0-3-2-3-3l-1-5c-1-2-4-3-3-4 2-1 5-3 4-4l-7 2c-4 2-4 4-6 5s-1 4-7 5-7 3-9 5l-6 7c-2 2-3 5-4 3-1-1-3 0-2 1 2 2 3 4-1 4-5 0-6 1-5 3l-2 11c-2 3-6 2-9 2-2 0-5-1-7-4l-5-6c-1-1 1-2 2-4 0-2 1-2 2-2l7-2c2-1-2-4-4-6-2-3-3-2-4-5s-2-4-7-3h-12c-6-2-3 2 1 4s5 7 4 14c0 7 0 9 4 11s3 3 4 10c2 7-4 6-7 5l-12-2c-4 0-7 7-12 13-5 5-4 8 0 15 5 7-2 11-5 11s-2-3-4-5l-9-3-6-4c-2-1-4-1-5 1-1 1 0 3-2 5-1 1 0 3 2 5s3 3 7 4c4 2 8 0 6 6-1 6-11 3-15-1-5-4-10-4-12-6-2-3 0-7-2-9-1-2-3-6-2-13s-9-9-11-10c-3-2-2-5-2-7 1-2 4-2 5 0s1 3 4 3 4-1 7 1l7 3 15 2c9 1 14-2 21-11 8-8 2-16 1-18l-6-6c-2-1-8-3-21-12-12-9-27-14-30-14L88-4c-2 1-3-1-7-3-4-1-4-3-7-4-3 0-6 2-7 1l-2-1-1 2-1 4v3c-1 1-4-2-5-2v-1 2l-2 4c-2 0-3 2-4 3l-1 1-1 2-1 2V8l-1 1-1 2v3l-1 2c-1 2-1 2 1 4l1 4 3 4 5 9-6 13a734 734 0 0 1 6 24l-2 4c-1 3 0 5 1 7v2l1 2 1 3 1 1 1 4 1 2v1c1 1 2 2 0 4l-1 1c-2 2-2 2-1 4l3 3c2 1 5 4 6 7 2 5 1 7-10 21a248 248 0 0 1-17 21l5-1c2 0 2-3 5-2l13-2c2 1 3 0 5-2h2c1 1-1 3-1 5-1 1 1 3 2 2s1-3 7-1c5 3-1 4-3 6l-5 1c-2 1-4 1-4 3l-2 3a60 60 0 0 1 0 4c1 1 0 3-2 5h-1l-1 6v5l1 2 1 3v1l-1 1-2 1-1 1 1 1v1h2v2c2 0 2 3 1 3v5l2-1h1l-1 1v2l1 2v4l1 1h1l2 1v1h4l1 1v2h2c2-1 4-2 5-1h1l3 3v8l-1 1v1l3 1 1 1-1 1v1l1 3c2 0 3 1 3 2l2 3h2l2 1 2 2h1l4 2v1c0 1 0 2-2 3v5l3 2 3 3 6 7 1-1 1-1v-1l2 1h2l1-1h3l1 1c1 0 0 0 0 0h3l1-1v-4l1 1 4 1 2-1v-1h3l1 1 2-1 3 4 2 3 1 1 1 1v1h-3l-1 1 2 2h1l-1 2 1 1-1 1h4l1 1h1l2-1 1 3v1l1-1h1v3l1 2v1h-1v2l1 1a11 11 0 0 1 1 2h1v-1h4l1 2h1l1-1 1 1v1l1-1h1l3-1c2 0 3-2 3-2h1v2l1 1v2h1l2 2 1 1 1-1v-2h1l1 2h3l1 1 1 2 2-2 2 1v1l1 1h1l1 1 1 1v1l1-1 1-1h1v1a7 7 0 0 0 1 3l1 2-1 1h-1l-1 1-2 1v1h3v3h-4l1 1v1h1v3l1 2h1v1l-1 2-1 3h-10c1 1-2 2-4 3v1h-1l-1 2 1 1 1 1h-1v1l1 2c1 1-3 3-6 6-4 3 1 3 1 4v5c0 1-1 5-5 5-5 1-2 3-1 6s2 3 6 5c4 3 6 3 13 5s6 5 12 9l5-4c4-2 17 6 19 6a324 324 0 0 0 6 0c2 0 2 0 5 3 2 3 4 3 4 3h1v2l4-1 5-1 2 1 2-1h2l1 2 2 1h2l1 1v1l-2 2v1l2 1h1l4 2 2 1h3l6 6 2 3h2l3-4 2-3 1-1 3-3-1-1c-3-6-8-7-12-11s-3-10-3-13c-1-3-6-7-7-14-2-6 4-9 7-11l10-6 7-6-2-1-2-2-4-2v-2l2-1h1v-1l-2-3-1-2-2-3-3-4-4-3h-4l-1 3-2-3v-6l-3-2-6-2 6-11-2-2-1-1v-8l3-2 2-5 3-4h1l9 11 4-4-4-9h-1 1l4-3c2 0 4-2 5-3v-4l-1-1h3l1-1c6-1 7-4 7-6 1-2 2-1 3-1v-1l-1-1 1-1h6l1 3v1h3l1 1v-1l1-1c0-2 0-3 2-3h1l1-1c2 1 3 2 3 4h7c3 0 4 1 4 2l1 1 3 2 3 3 2 1 1 1 1 2-1 2v1h1l2-1v-4l-1-1h-1l1-1h2l2 1c1 0 2 0 2 2l1 1 2 1 3 1h1c1 1 2 1 3-1l-1-2 1-2 3-1 1-1 1-1h1v1l1-1 2-1h1l3 1 2 2h1l1-1v-2l1-1h4v-1l2 1 2 1v1l1 1c2 2 4 2 5 2l1 1 4 2v1h1l2-1 2-2v-1l1-2h1c0 1 1 2 4 2l8-1 1-3 1-1v-2c1-1 2-2 0-3l-3-2h-1l-2-2-1-1h-6 1v-2l-1-1h-2l-1-1-1-1-1-1 1-1 3-1 2-2c2 0 3-1 3-2v-3l-1-3v-1c-1-2 1-3 2-4l2-2h8l1 1v-2l-1-2s-8 0-9-2l1-2 1-1 3-1h-6v-5h1l-1-2 2-1v-1h1l2-1 3 1h2l1-1h3v1l1 1 1-1v-1l3-1 3-1h-1l1-1h1l7-1 1-1 1-1 2-1h2a4 4 0 0 0 3 0l2-1 1 1v-2l-1-1h5v-2l1-1h3v-2l1 1 3 1 12-4 8-4h1v-3h3l1-2 1-1h2v-3l2 1 6 1 5 1h3l2-1h1l1 1 1 3 2 3 1 2 2 2v4l-2 2v1l-1 2v1h5l1 1 2-2v-1l3 1v-3h1l3 1 1 4-1 2h4-1v-3l1-1 2 1h1l4 1h3l2 2-1 1h-1l-2 2h-1v5c1-1 3-3 5-3 3-1 3 0 4 1v1l3-2c0-2 1-3 3-3l3-1 2-1 1-2v-1c0-1 0-2 2-3l4-1h1l1-1 3-2h1l6-3v1l-2 3-2 2-2 2h1v1l1 2 2 3 11 9 26 41a19 19 0 0 1 3-3v-4l3-2 2-1 1-1 1 2v4h3l1 3v1h12l3-3 8-2h1c1 0 2 0 4 5l3 5 1 1c0 1 1 3 3 3 3 1 5 3 5 4v1l2 2c4 2 6 2 9 2h1l2-3 1-2h1l1 3 2 2 4 3 1 1 1 1 2 2-2 1-2-1-2 1-2 4-1 2c-1 2-3 4-6 5h-2c-1 0-2 0-2 2v5h8l3-2 3-2v-1c1-1 0-1-1-2l-1-1 3-2h2l7-2 1-2 3-3 2 1h2l1-1 2-3 2-3 1-1 2-2h1c1 2 1 2 4 2v-1l2 1c3 2 6 2 9 2h1l3-1 2-1 1 2v2c0 2 1 4 3 4l8 1 3 1 3 1h8l4 1c1 1 1 1 2-1l1-2h1c2 0 4-3 4-5l1-3c1-1 1-2-1-3l-3-1-1-4h-1v-2l2-3a23 23 0 0 1 2-4l3-6v-2l1-4 2 1 8 5h2l4 1 5-1 6 1 5 1c2 0 3 0 4 2l-1 4v4l4 3 4 3 2 1 3 1 3 1c3 2 3 2 6 1l5-2c1-2 2-3 4-3l6 2c4 1 8 2 10 1l3 1 4 1 2 1c4 0 6 1 8 3l1 2c1 2 2 2 5 3h2l8 1h4c8 1 11 1 15-1l4-2 9-6 5-5c2-2 3-4 5-4l9 1 10 1 6-1h3v3l8 1h5l2-2 6-4 2-1-1-2-1-1v-3l9-22 3-3 2-2h-1v-5l-1-2-1-2-2-1h-2v-5l6-6 7-2 2-1a256 256 0 0 1 17-4c4 0 14 6 15 6h2l2 1h3c2 0 2 1 2 3l3 1 2 2v4l1 1h2l1 1v1l-1 1v1h2l1 1-1 2v3a54 54 0 0 1 3 5l1 3v1c0 2 1 2 3 3l1 1c2 1 1 3 1 5l-1 1 1 2 3 4 1 2v3c2 3 3 3 5 2h6l5 2h4s6 7 9 7l2 2v3l-2 3 2 4c2 1 3 5 4 6h16l3-1h1l5-5 2-3 1-1h5l2 3-1 3-3 4-4 3-3 2v8l-3 2-1 1-1 4-1 2-3 2c0 1 0 5-2 6l-1 1h-2v1h-1c0 2-1 4-3 5l-2 1c-1 1-3 1-2 4v5l-1 2h3c2 1 2 6 9 7 6 1 8-4 13-9 5-4 4-8 6-12l5-13 4-12 5-10c1-2-1-4 1-6l1-6 1-9 4-16c2-3 1-12 0-14l-2-11c0-2 0-11-4-15-4-3-4-2-3-13 1-10 2-11 7-4l12 17c6 8 3 10 3 20 0 9 1 7 6 14s4 7 1 12c-4 5-4 9 0 10s6 6 8 9 0 8 3 10c2 1 3-4 3-7 0-2 1-4 3-5s6 0 6 2c1 2 4 6 4 4l-1-7-4-4c-2 0-4-2-4-3 0-2 0-4-4-7s-3-3-5-7c-1-4-2-7-2-17 0-9-1-6 2-8 2-2 5 1 8 4 2 3 5 6 5 4s-2-3-3-5l-5-6-7-19c-4-14-17-28-22-31-5-4-1-5-1-8s-2-3-4-5c-2-1-2-4-1-3l4 4-5-8-5-5-3-4-1-4c-1-1-2 0-3-2-1-1-1-2-3-2s0 3-1 3c0 0-2-2-3-1l3 4 4 3 2 5c0 2 2 2 1 3-1 2-3 0-6 0s-1 3-4 3-13-6-15-8c-2-3-5-4-9-4-4 1-3 2-5 1-1-2-3-1-3 0v6c0 3-4 7-6 6-2 0 0-4 0-6 1-2-4 0-6 1-2 2-4 2-5-2l-2-8c-1-3-3-4-6-2-4 2-5 4-9 3-5-1-3-4 0-9l7-14c3-9 3-12 3-17s2-9 4-12c3-4 3-8 5-11s1-10 2-15c0-5 4-7 4-12 1-5 6-12 13-15 7-2 10-4 13-2 3 3 7 3 8 1s-4-5 2-5c6-1 22-4 21-9-2-6 4-5 9-5 6 0 13 1 17 3 4 3 8 7 12 7 4 1 6-6 6-8s8 0 10 0 4-5 1-7c-3-3-8-2-10-4s-1-7 0-11c0-5 2-5 2-23 0-19 6-16 9-17 2-1 7-6 10-5s6 5 7 3c1-3 1-5 4-3 3 3 0 9 0 12-1 2 2 3 6 3 4 1 3 4 5 7 3 2 4-3 5-7s2-15 4-18c1-3 4-4-1-16-5-11-1-12 5-13s8 5 6 5c-3 1-4 3-3 9 0 6 6 8 6 9 0 2-3 6 0 8 2 2 2 3 2 7s3 6 1 8c-1 2-6 5-7 11-2 6 3 11 1 14s-3 9-3 17l-1 19c-1 8-3 3-5 9s-3 5-7 6c-5 0 0 3 3 5s1 8 1 12c-1 5-5 11-3 18l4 14c1 6 18 28 19 32s8 8 9 13c0 5 8 8 11 10 3 3 4 10 4 14 1 4 3 11 6 11 4 1 3 8 4 8l3-6 5-8c2-3 2-14-2-18-4-3-1-9 0-12s10-3 8-5l-6-12c-3-5 1-14 7-16 7-2 6-6 4-10-3-5-9-11-10-16s0-12 4-10c4 1 4-2 4-6 1-5-3-5-4-9-1-5-4-1-7 0-2 1-2-3-4-7-1-4 1-6 1-10s-7-7-10-8c-4-1 2 8 0 8-3-1-5-5-8-11-3-7-1-25-3-30-2-4-3-6-2-10 1-5 3-2 7-1 3 1 3-2 3-6 1-5 3-7 6-6 3 0 2 10 6 11 3 1 2-7 1-14-1-8 8-7 13-9 6-2 8 1 10 3 2 3 9 6 13 7 4 0-1-6-2-15s4-18 5-25 6-13 10-23c4-11 11-14 19-14 7 0 11 0 12-4 0-4-1-8-3-10l-6-8c-2-4-4-3-9-4-5-2-7-5-7-10 0-4-3-2-6-2-2 0-3-3-2-6 0-3-7-6-7-4s-1 4-7 1c-7-4-5-7 4-8 8 0 6-9 5-13v-18c-1-3-4-7 0-11 4-3 4-6 4-10s11-8 15-1c5 6 5 7 12 5s4-2 13-2c8 0 5-6 3-10Z"></path><path d="M48 6V2l2-2v-4l-3-3-3-2-3-6-1 1c0 1-1 2-4 2h-4l-2 1-2 5-1 4c-2 3-3 8-3 10l-2 3-1 1-1 1-1 4h-1l-2-2c-1-1-2-3-4-3l-3 2-4 2H2c-1 0-3 1-4-3l-1-4c-1-2-1-5-3-6-3-1-3 0-5 3v1l-2 1 1 2 6 6c5 3 10 5 10 7l2 3 1 1v7c0 3 0 4 2 6v6l1 9a76 76 0 0 0 0 11l10 1c3 0 7 2 10 5 2 4-2 9-3 10l-9 12-7 8-3 5c-1 3-2 4-4 5s-5 5-5 10c0 4 2 4 2 5l1 7 1 16c0 7 3 6 6 6s3 2 4 3l6 1c2 2 4 7 6 7 1 0 4 0 8-4l6-2 7-9 10-12c12-15 12-17 10-21-1-3-3-5-6-7l-3-2c-1-3 0-4 2-6h1v-4l-1-1v-2a14 14 0 0 1-2-5c0-2 0-2-2-3l-1-2v-2l-1-7 3-4 1-2-8-22 7-13c0-1-3-6-6-8l-2-5-2-4-1-4 2-2v-3l1-3V6ZM16 406h-3c0 1 0 0 0 0v3l1 1 1 1v1h1l1 1 1 2v2h2v-1l1-1 1-1 1-1 1 1 1 1v-1l2-1v-2h1v-4h-2l-1-2-2-1v-2h-1l-1-1-1-1-2 2 1 1-3 3v-1 1Zm0-1Z"></path><path d="m40 400-1-1-1-2-2-3-1-1v-3l1-1 1-1 1-1-2-1v-2l1-1h1l-1-1h-2l-1 1-1 1-2-2h-2l-2-1v-1l-2-1v-1h1l-1-1v-1h1v-2h-2v-1l-3-1-1-1-1-1 1-1v-2h-2v-2h-1l-1-2-1-1h-1l-1-1-1 1H8l-1 1-2 1-1-1-1 1-1 1v2h1v1H2v1l1 1v1l1 1 1 1 2 2H5l-1 1v2h2v3l-1 1v1l-1 3h1l4 4v1H6l-1-1 1 1 2 4v1l-1 1v-1H6l1 2 1 1 1 2 3 1 1 1 2 1 1 1c2 0 2-1 2-2v-2l2-1 1 1h1l1 1 1 1 1 2 2 1 1 1h1v2l-1 2v1l-1 1 3-1h2l2-1 1 1 1-1v-2l-1-1v-2l1-2h1l2-1 2-2-1-1Z"></path><path d="m-10 403-1-1-2-3v-1l-1-1-10-9v-3l-1-1v-2l-1-1-1-1h-1v-6h3l2 3h1l1-3h3l1-1 2 1 1 1v-1l1 1h4l1 1 1-1h2v1h2v-1l1 1h3v2l1 1h2a6 6 0 0 1-1-2v-1l2-2h1-1l-1-1H3v-3l-1-1v-1h1-1v-3H1l-2 1-2 1h-6l-2-2h-2l-1-3-1-1h-2l-1-2-1-1-1-1h-1 1l-2-1-1 1v1h1-3v1l-1 1h-1v1h-2v1h1v4h-3v1a25 25 0 0 1-1 0l1 1-1 1 1 1v1h-3l-1-1h-1l-1 1-1-1-1-1v-1 1l-2 2h-2l-1-1v1h-2l-3 1-3 1v4c0 4 4 5 6 4 2-2 1-5 3-6 1-1 3 2 4 5l3 7c1 2 0 5 2 7 2 1 6 4 10 4 5 1 6 1 9 4l2 2h3v-1Zm27-217 7-1c1 0 3-2 0-3l-6-1c-3 2-2 2-3 4-1 1 0 2 2 1Zm60 313-9-3c-6-2-4 2-7 1-2 0-3-2-7 0-2 2 0 5 1 5h7c2 0 4 4 6 4l6-2c4-1 7-1 8-3 2-2-2-2-5-2Zm71 8c3 0 5-2 7-3 2 0 5 1 5-1 0-1 0-4 2-5l3-4-6 3c-2 1-4 2-5 1l-3-1c-4 1-4 3-7 4-3 0-5 2-3 4 2 1 4 3 7 2Zm69-528c-7 0-10-2-12 2-4 8 0 12 3 15 3 2 1 5 5 4 5-2 7-5 9-6 3 0 7-5 5-8s-3-6-10-7Zm-40 538c2 0 2-1 3-2l1-1 1-3 3-2h1l1-1v-3l1-2-1-1c0-2-1-2-3-2h-7c1 1 2 2 1 3a119 119 0 0 1-5 15h2l2-1Zm0 1h-2l-2 1-3 5c-2 2-1 5-2 9l-2 4 6 23c2-3 7-22 7-43l-2 1ZM50 295l1-1h-1v-2l-2-2-1-1-6-6 1-1 1-3 1-1v-2c1-1 0-2-1-3l-2-3c0-2-2-3-4-5l-2-3-4-10a59 59 0 0 0-1-3l-1 1-3 1H16l-7-1-4-2-5 1c-4 0-5 2-7 3-1 0-5-1-5-4-1-4-4-4-6-3l-9 1c-2 0-1 2-2 3-2 1-4 0-5 2 0 1-1 3-4 3l-3 1v7l-2 2 2 2 2 2v4l2 2v3l-1 3 1 2-1 1v1l2 1 1 1 1 1-1 2-1 3v2h1v-2h2a221 221 0 0 0 2 3h2l1 1h1l1 1h1v1-1h2l1 1h1v1l-1 1h-1v1l1 1 1 1 1 2h2l1-1 1-1h-1v-1l-1-1 2-1 1 1 1 1 2 1h2l1-1 1 1-1 1a7 7 0 0 1-1 1l2 2h1l1-1 2 2h1c2 0 2 1 2 2l1 1 1 2 1 1h1v1h1l1-2h1l1-1 2 3 2 1v2h1l1 1v-1l1-1 1-1h5l1 1 1-1h1l4-1h2c2 0 3 2 3 3l4 1v1l3 1v-1l-1-1-1-5 5-6 3-5 4-1 1-2v-5Z"></path><path d="m-38 295-1-1v-2h-2v2h-1l-2 1h-1v1h-3l-1 1-1 1h-1l-1 1-1 1h-1l-1 1h-2l-2 1v1l-1 2-1-1-1-1v2l3 2 1 1-1 2v2l1 1 1 2 1 2h2l2 3h1l1 1 1 1h1l2 3 2 1v1l2 1 1-1h3l1-2h1l1-3h3l3 1h1l2 1h1l1 1h2l2-1 1 1h1l1 1v1l2-4 3 1h2l1-1h1v-1l1-1h1v-1l1-2 1-1 2-3h3v-1l-1-2-1-1-2-2h-1l-2-1h-3l-1-2s-1 0 0 0v-1h1v-1h-4l-1-1-2-1h-1v1h1v2h-1l-1 1-1 1h-1v-1l-1-1-1-2h-1v-2l1-1h1l-1-1h-3l-1-1-1-1h-4l-1-1-1-3-2 1v2h-3Zm20 63v1l1 1h2v1l1 1 2 2h2l1 2h3l2 1 3-1 2-1h1v-1l2-1h2l2-2a56 56 0 0 1 4 0h7v-1h2l2-1 1-2h1v-1h-1 1v-2h1v-1l2-3v-1l1-1 1-1 1-3 1-2 1-1 2-2h1l1-1 2-1v-1h1v-1h-3v-1l-1-1-1-1-1-1-2-1-1 1h-2l-1-1-1-1-2-1-3 1-2-1-3 1-1 3-2 1H7v1l-2 1-2-1-2 1v1l1 2v1l-3 1h-1l-8-1-3-3h-2v1l-1 1 1 1s1 0 0 0l-1 1h-3l-1-1-1 1 1 1 1 1v1l-2 1a20 20 0 0 1 0 3l1 1v1l-1 1h-2l-1 2h2v2l1 1 1 1v1l2 1Zm110 12 1-1v-2l1-1h1v-3h1l1-1 1-1h-1v-2l-1-1v-1l1-1h1l2 1 1-1v1h1l1 1 1-1 2 1h2v-1l-2-1h-1l1-2v-2h-1l-1-1h-1v-3h-1v-1l1-1-1-1h-1l-1-1-1-1-1-1 1-1v-4h-2l-2-3h-2l-1 1v-1h-2l1-1h-2v-1l-3-2h-4l-1 1-1-1h-4v1h1l-1 1 2 1 1 1a14 14 0 0 1 2 5l1 2v1l1 1h1l1 2h-1 1l1 1v1l1 1 2 1 1 4v6l-1 1v10h3Zm135 50h3l4-1 1-1 3 1 1 1 1 1 1 2 2 1 13-2h3v-1l1-2 3 1 6 3 4 1h2v-2l-2-2-1-2h-1v-2l2-2-1-1-4-1-1-1-2-1v-1l1-2 1-1h-3l-3-2-1-1v-1h-1l-2 1-2-1-5 2h-4v-2h-1s-2 0-5-3l-4-2h-7s-14-8-18-6l-5 3h1c6 4 9 5 15 12 6 6 4 9 2 13l3 1Z"></path><path d="M103 372h-3l-1 1-2 1-1-1-1 1h-2l-2-1-1-1-1-1-1-2 1-2v-9l1-2v-2l-1-1-1-3-1-1v-1l-1-1v-1h-1l-1-1v-1l-1-1h-1v-2h-1l-1-2v-2l-1-2-2-2-1-1h-2l-1 1-1 1-1 2-8 1c-1 1-2 3-4 3l-1-1-1-1-2-1h-7l-2-1v1h-1l-3-3-1 2h-1l-1 1-1 2h-2l-1 1-2 1-1 1-1 2-1 3-1 1-1 1v1l-1 3v1h-1l-1 2a4 4 0 0 1 0 1l-1 2-1 1h-2l-1 1h-1v1h-3a11 11 0 0 0-1 0l1 1 2 2 1 1 1 1v4l2 1 2 1h1l1 1 1 1v1l-1 1 1 1v1h-1l-1-1 1 1 1 1h1v1h1l3 1 1 2v-1l2-2h2l1 1v1l-2 1v1l2 2h1l2 2h1l-1 1-2 1 1 1h6l2 1 2 1h12l2 1h1l2-1 4-3 4-2 4-1 2 1 2 1h3l1-1 1 1 1 3h1l6 1 2-8c2-4-1-4 0-6l6-3v-3l-1-2Zm582-56 1 2 4 3 3 1h5l2 2 1 1 1 1v-1l6 3a93 93 0 0 1 7 16l-1 3 1 4v1l-2 4 1 2 1 2c1 3 1 3 4 4h20c5 1 8 3 11 5l5 3h3l4-1 2 1-1 1-1 1 1 2c2 0 2 1 2 3l1 3a43 43 0 0 0 8 11v-1h2l2-1h9l5 1h12l6-1 3-1h5l3 1 8 1c1 1 4 4 10 5l3 1v-1h13l2 1-1 1v1c1 1 2 2 6 0l24-12 17-3c3 0 4-1 6-3l3-3 6-5c1-3 7-7 8-8l-5-10 4-6h20l5-2 1-5v-2h8l8-6 6-10h5l2-4h4l6-3 3 1 3 2 7-3 1-1-2-3-3-2-5-5-3-1-3-2c-2-2-3-3-5-2l-3 2-2 1h-14l-5-2v-1l-1-4 2-4 1-2 4-9 2-4 1-2c1-2 3-5 2-6h-3l-6 1-10-1h-9l-5 3-5 5-9 6-4 2c-4 3-7 2-15 2l-4-1h-8l-2-1c-4 0-4-1-5-3l-1-1c-2-3-4-3-8-4h-2l-4-2h-3l-10-2-6-1-4 2c-1 1-2 3-5 3l-6-1-3-1-3-1-3-2-3-3-4-3v-8l-2-1-6-1c-3-2-4-2-6-1h-9l-2-1c-4-1-4-2-8-5l-2-1-1 4v2l-2 6-2 2v2l-2 3-1 2h2l1 3 3 2c2 1 1 2 1 3l-1 3c0 2-2 5-5 5h-1v3l-3 1-4-1h-8l-3-1-2-1-9-1c-3-1-3-3-3-5v-2l-1-1h-1l-4 1h-1c-3 0-6 0-9-2h-2l-4-1-1-1-2 3-1 1-1 2-2 3-2 2-2-1h-2l-2 2-2 2a170 170 0 0 0-11 4l1 1 1 2v2h-1l-2 2-4 1c-2 2-4 1-5 1l-3-1 1 1v10l2 3Z"></path><path d="M203 316h-1v-3h-1l-2 1-1-2-1-1h-2l-1-1-1-1-2 1-1-1-2-1h-1l-1-1-1-1h-1v1l-1 2-1-1v-1l-2-1-1-1v-2l-1-1-1-1-3 1-3 1-2 1-1-1h-2l-1-2h-3v1h-2l-1-1-1-1v-4l-1-1v-3h-1v-1l-1-2h-2l-1 1-1-1h-4v-5l-2-2 1-1h2v-1l-1-2-2-3-3-3h-3l-1-1-2 1c0 1 0 2-2 1l-4-1-1 3-1 1-1 1-2-1h-2l-2-1-1 1h-4v2l-3 3h-1v3l1 2-1 2h-1v-1h-1l-1-1-1-1h-1l-1 1h-1l-1-1v-1l-1 1-2 2-2-4-3 1-1 2-1-1v-1h-3v-1l-1-1v1l-2 1-1-1-1 1-1 1v-1l-1-1-1 1-3-1v-2h-2l-3-1-1 1v-1l-3-1h-1l-1-1h-2l-2 1v-1h-4l-4 1h-3l-1 1-2 3h-1v1l-2-2-1 1v5h1v1l2 3 1 1v2h-1l1 1v3l-1 1-1 2-3 1a123 123 0 0 1-8 11v5h1l1 1v1l-1 1h-1l-2-1v1l-1 2-1 2-1 2v2h1l1 2 1 1 2 1v1h2v1l1-1 1-1 3 2v-1l3 1h2l3 1 1-1 2 1 1 1 1 1 1 1 3-3 8-2 2-1 1-1 1-1h1l1-1v-1h3l1-1 1 1 1-1 1 1v-1h3l3 3h2v2l1-1v1h4l1 2h3v5l-1 1v1h1l1 1v1h1l1 1v1l-1 1h1v2h1l1 1h1v5l2 1v1h-1l-1 1-2-2v1l-1 1-1-1v-1l-1 1v-1l-2 1-1-2h-1v3l1 1v1l-1 1v2h-1v1l-1 1-1 1v1l-1 1v1l-1 1h-2v1h2l1 1h2l1-1v1h1l1-1 1-1c2-1 3 0 4 1l1 2 1 2c2-3 0-4 0-6l4-2c2-1 3-6 6-10 4-4 4-2 9 0 4 3 2 3 5 3 4 0 9 2 9 4 0 3-2 2-5 4s-2 4 0 4c1 0 6 3 5 6-2 3 4 4 9 4 5 1 4-3 5-4l6-1 4-4h9c4-1 0-3 0-4s-2-2-5-1h-7c-3-1-3-4-4-6-2-2-2-2 0-3 1 0 0-6 2-5 7 1 11-2 15-5 5-3 5-4 8-4l4 1 1-1-1-1v-2l1-1a2 2 0 0 1 0-1l1-1c3 0 4-1 4-2h-1l1-1h6l1 1 2-1 1-2 1-2v-1c-1 0-2-1-1-2l-1-2v-1c-1-1-2-1-1-2l2-1h1l1-1h-3l-1-1v-1l2-1 2-2 1 1v-3Z"></path><path d="m34 325 1-2 1-1v-2l-5-2c0-1 0-2-2-2l-1-1-2 1h-3l-1 1h-1l-1-1h-4l-1 1-1 1v2l-2-1h-2v-3l-2-1-1-2H6l-1 1v1l-2 1v-1h-4l-2 2h-1l-1 1v2l-1 1-1 1-1 1-1 1h-1l-2 1-3-1-1 4-1 2v1l1 2 1 3v-1l2 1 3 2 8 1h3v-4l2-1h3l1-1h7l1-1 2-4 3-1 2 1h3l3 1 1 2 2-1h1l1-2 1-3ZM14 222c4-3 5-3 8-3h1l4 1h1l1-1h3l4 2h3v-1l2-2 1 1v1l1 1 1 1 5 2 1 2 2 2h2l2-1h4l2-1v-2l3-2v-4l-1-2-1-1v-1h-2l1-4v-1l-1-3-1-1v-1h-5l-3-1c-1-1-3-2-3-4-1-1-6-3-7-2l-2 1-4 2v8c-1 6-5 5-7 4l-1-2-4-5c-1-2-3-3-6-3-2 0-6 4-8 6-3 2-2 3-1 4l-1 4-1 11a98 98 0 0 0 7-5Z"></path><path d="M42 196c1 0 6 1 7 3l3 3 3 1h2l2 1-1-1v-1l1-1 2-1 1-1-1-1-1-3v-2l-1-5c0-2 0-4 2-6l1-1 2-4v-2l-1-2-2 1-5-1-6-2c-3 0-5-2-6-1l-3 3-9 2-5 4v9l-3-2-5 2-2 1-2 1-2 2 1 3v5l2 1c2 1 1-2 1-2l1-2 2-2 2-1 1-1v-4h2l2 1 2 2 4 3 3 2v2l3-2 3-1Zm735 465c0-3-1-6 1-7l1-1 1-3v-3l2-1h1l1 1 1 1v-1l1-3v-1l-1-2-1-4-1-2v-3l-2-3-1-3-1-6h-2l-2 3v5l-1 1v1l-1-1-1-3h-1l-1 1v1-4l-1-2v-5h1v-1l2-1h1l1-1 1-2h1l1-2v-1h-6a12 12 0 0 1-2 1l-2 1h-2l-2-1-4 1h-4v-1l-3-3-1-2-1-3v-3l-1 1-2 1-3-2-1-2-1-1h-2l-4-3v4l-2 2v8l1-2h1l6 5v1h-6l1 1 1 2-1 1 2 4 1 2-1 1-2 1v1l1 2 2 3 1 2 2 3 2 6 1-2c2-1 1-3 1-5 1-3 3-1 5 1 1 1 2 2 4 1 1-2 3 2 4 5 1 2 2 4 2 9 0 4 4 8 8 13 2 3 6 4 9 4l-2-4v-1ZM267 446l-1-1h-3l-3-1-1-1h-2l-1 1v3h2l4 3 3 2 3 1 1 1a110 110 0 0 0-2-8Zm261-20-2-2v-2l3-4-2-3-2 1-2 1-2 2-2 1-1 1-1-1-1-1-1-1-1 2v1l1 4v1l-2 1h-7l1 1 2 2-1 1-1 3-1 1h-8l-3 1h1l-1 3-1 1 1 1 1 1h2v1l2 1h3l1 2-1 1 1 5v1l1 1v3l-3 7-1 3-1 1s1 3 3 3h1l1-1 2-1 4-3h2c1 0 0 0 0 0l1 1 2 1h1v-4l2-1h3l2 1h1v-2l1-2v-1l1-1a53 53 0 0 1 1-3l1-2 1-2 1-1 1-1h2l1-1 1 1 1 1v2l1 2v2l1 2v3c-1 2 0 4 1 8l1 2h3v-1l1-1 4-1h2l1-1 1-1 1-1 1-1 3-2c3-2 5-1 6-1l-1 3 3-1 6-2c2 0 3 1 3 2h1l1-2v-6l-1-1-1-2-1-2c0-2-2-2-4-3h-2c-2 0-4 0-5-2v-2l-1-4-2-4h-4l-7 1-2 2-1 1-1-1-1-1h-1l-2-1v-1l-2-1h-3l-1 1c-2 1-4 2-5 1l-2-1v-1l-2 1-2 1h-5l-3-1c-2-1-2-2-2-4l1-3 1-1 1-1v1a20 20 0 0 1 6-2l2 2 1 1h2l2-1 1-1 1 1 2 2h1l-1-2-1-1v-1a44 44 0 0 0-5 1Z"></path><path d="M382 414v-5l1-2 1-1h2l3-1 1-1h1v-1l1-2h3l1 1-2-3 4-2v-2l2 1 2 2 3 3h5l3 3 1 2c-1 0-1 1 1 1l2 1h1l-1 2-2 3-1 1v1l5 2h9l2-1h2c1 0 2 0 3 2l1 2 1 3 5 11 35 21h3l2 1 3 1 2 3v6l5 1 6 1h1l1-1 1-4 3-6v-4l-1-1v-8h-3l-2-1-1-1h-2l-2-2 2-2v-3h11l1-2 1-2v-1l-2-2v-1l2-1h6v-1l-1-4 1-1 1-2h1l2 2h1l1-2 3-1 1-2h3c2 1 3 2 2 3l-3 4v1l1 1 1 1h5v-1h3c2-1 2 0 2 1l1 1 1-1 1-2 2-2h3l1-1 2-1 2-1 1-1 1-2h-4l-3-1h-2v-2h-3l-1-2a4 4 0 0 0-1-2c0 2-3 4-5 4l-2 1-2-1c-2 0-2-1-2-2v-2l-2 2-1 1-2-4c-1-1 0-2 1-2l1-1 3-1h1v-1l1-2 3-2-3-2-4 5-1-1v-1s-8 11-11 11h-3l-1 1-1 3h-1l-2 2v6h-2l-1-1c-2 0-3-1-3-2v-1l-1-2v-3h-2l-12 1h-1 1s0-9-3-10h-4l-1-2v-3l1-9h-4s-4-10-8-10h-2c-1 1-2 2-4 1h-1a63 63 0 0 0-22 2l-3 1-2-3c-2-4-5-9-10-10l-13-8c-5-4-10-8-13-8l-27 10 3 53 10-1v-3Zm-293-9c0-6 3-5 5-8l2-2-6-1-1-1-2-2v-1l-2 1-1-1h-2l-2-1h-5l-4 2-3 3-3 2h-1l-2-1h-5l-2-1h-5l-2-1h-8l-1-1v-1l1-1 1-1-2-2h-1v1l-2 1-1 2 1 2v1l2 3 2 2v1l1 1c1 1 0 2-1 2l-1 1h-2l-1 1v6l-1 1 2 2 3 2v2l1 1-1 1v2l1 1v1l2 1 1-1h2l1-1h4-1v-1h3l2-1 1 2v1h2v-1l1 1 4 1h4v-1h4l-1-2v-1l1-2h1v-1h2v-1l1-1h1l3-1h3l1 1 1 1 1-1h1v1-1h6l-1-2c-2-4-2-4-2-9Zm185 45h1l-1-2v-2h-1l-1-1-2-1-3-2-1-1-1-1v-1h3l1-1v-1l-2-1-2-1-1-3v-5l-2-1-2-1v-2l-1-1h-3l-13 3h1v7l1 2v2l3 2a50 50 0 0 0 5 1l3 3v1h1l2-1 1 1 3 2h3l1 1 1 1a121 121 0 0 1 3 7l3-2v-2Z"></path><path d="M499 469h-1l-6-2a71 71 0 0 1-15-3l-2 2-2 2-2 1c-1 0-2 0-2 2l-1 3-1 4c-1 4-4 6-6 6h-4l-1-1v1l-2 2h-6v2l-1 2-4 3c-2 2 0 4 0 4v3l-1 1-2-1-1 9h5l-4 3 1 6v10c0 4-1 5 2 7s8 0 9 0l2 1-2 3c-3 2-4 5-5 7l-1 3c-2 1-3 4-3 7l2 4 2 2 8 1h3a14 14 0 0 1 6 0h4l3-1c1-2 2-3 3-2l2 1 3 1 1-1 4 1h4v-7c-1-1-2-2-1-4l3-4 4-1h4l2-1h2l1 1v-1l-2-3v-1l2-1 5-2c2-1 4-2 5-1v1l1 1 3-1 1-1 1-1v-4l-1-2-1-2h1l4-1-1-1v-2c1-3 2-4 4-4l4-1-1-4-2-5-1-2h11v-5l1-2 5-8-1-1v-2c1-2 2-2 1-3l-1-2-3-4h-1l4-5 1 1v1l2-2 2-4c1-2 1-3 4-2l7-1 2-1 3 1a48 48 0 0 1 5 0h5v-1l-1-2v-2h4v-1l-3-1c-2-1-5 0-6 1l-4 2-1 1 1-1 2-3h-5a41 41 0 0 0-5 3l-1 1-1 1v1l-3 1-4 1v1h-2l-1 1h-1v-1l-1-2c-2-3-2-6-2-8v-1l1-2-2-2v-4l-1-2v-1h-3l-2 2-2 2v2l-1 2-1 1v1l-1 1v3l-1 1h-1l-2-1h-3l-2 1v5h-1l-2-1h-1v-2l-2 1-4 2-2 2h-1l-2 1-2-4-1 1ZM27 430l5-4 1 1h4l1-1 1-1 1-1v-6l-1-2-2-2c-2 0-2-1-3-2h-4l-2 1-2 1-1 1-2-1h-1l-1 1-1 1v2h-2v3l-1 1v1l1 1-1 1v1l1 1 1 1v1h1v1h7Zm714 158h1-1l-1 3 5 3 2 1h4l2-1 1-1 3-1h1l5 2 2 1 3-1h1l5-1 2-1h-1l-1-1v-6l-1-1-2-2-2-1-2-1-2-1-2 1h-16l-2 2-2 2-3 1v2l1 1ZM346 406a456 456 0 0 0 9-1l3 3c6 3 8 9 9 11l5-1-3-53v-1l27-10 14 8c5 4 9 7 13 8 4 2 7 7 9 10l3 3h2l9-2h14l3-1 3-1c4 1 8 9 8 11l4-1v15h4c3 1 3 8 3 10a147 147 0 0 0 14-1v1l1 1v4l3 2a77 77 0 0 1 3 0v-2l-1-3 3-2 2-3v-1l2-1h2c2 0 9-8 10-10h1l1 1 3-5 3-5c2-2 4-2 8-2h3c4 0 7 1 9 3l3 1h1v-5l2-4 3-2c1-2 2-2 3-2l1 1 2 1 3 1 6 2 5-1h31c4 0 5 2 5 2l5 3h1l6 2v-3l-1-2 1-2 2-1h1-1l-1-1 1-2 2-1v-3l-1-2-1-2-2-6-1-5 1-1-2-2-3-2-2-2h1l1-2c1-2 1-2 3-2h4c3 0 4-1 5-2l5-2 3-1v1l1 1h4l2-1v-2l-3-3 7-24 5 2h6l6 2h1l2-1 1-2 2-1 4-3v-2l1-6-1-2-1-6c1-3 1-3 3-3h2a10 10 0 0 0 7-7l2-3 2-1h4l-2-2h-1l-2-2c0-1-1-2-3-2-2-1-2-2-2-3l-1-2-1-1-1 2-2 4h-1c-3 0-5 0-9-2l-3-3 1-1c-1-1-3-3-5-3-3-1-3-3-3-4l-1-1-3-5c-2-4-3-4-4-4h-1l-7 1-4 3-9 1h-1l-2-1v-1l-1-2h-3v-5l-1-1-1 1-2 1-2 2-1 1v2l-3 4h-1l-25-42a155 155 0 0 1-13-12l-1-2h-1v-2l2-2 2-1 2-3-6 2-1 1-2 1-2 1-4 2c-2 0-2 1-3 2v1l-1 2-2 1-2 1-4 3c0 2-1 2-3 2l-1-1-2-1-6 4-1-5 1-1c0-1 0 0 0 0l1-1 2-1h1v-1l-1-2h-2l-1 1-4-1h-1l-2-1v3l-3 1-2-1 1-1v-4l-3-1h-1l1 2v1h-1v-1h-3l-1 2h-3v-1h-4v-3l1-1 1-2v-4l-1-2-2-2-1-3-1-3-1-1-1 1h-2l-1 1h-2l-5-1c-2 0-4 0-7-2h-1l1 1v1h-3l-1 2v1h-3v3l-1 1-9 3-12 5-3-2v1l-1 1h-4l1 2h-5v1l1 2-1 1-1-1h-2l-1 1h-4l-2 1-2 1-6 1-1 1-4 1-2 1-1 1-1 1h-1v-1h-12v1l-1 1v1l1 1-2 1v3h4l2 1v1l-2 1h-2v2l8 2 1 2 1 1v1h-10l-2 1v1l-2 2 1 2 1 3v3l-4 3-2 1-3 1-1 1 1 1 1 1h1l2 1 2 1-1 2h5l2 1 1 1 1 1 3 1c2 1 2 3 1 5a19 19 0 0 0-1 2l-2 3c-1 1-3 2-8 2-3 0-4-1-5-3v3l-3 3h-3l-1-1-3-2-2-1-4-1c-2-1-2-2-1-2v-1l-2-1a89 89 0 0 0-1 0l-1 1h-5l1 2-2 2h-1l-2-2-1-1-2-1h-1l-2 1v1h-2v-1l-1 1v1h-1l-3 1v5c-1 2-2 1-4 1s-2-1-3-2h-1l-1-1-2-1-1-2-3-1-1 1h1v6l-2 1h-1v-5l-2-2-1-1-3-3-3-2-1-1-4-1h-7v-1c0-2-2-3-3-3h-2c-1 1-2 1-2 3v1l-1 1h-1l-2-1-1 1-1-1 1-1-1-2h-6v1l1 1h-1l-2 1c-1 3-2 6-8 7h-3v6l-4 3-5 2a74 74 0 0 0 5 9l-5 5-10-12-3 4-2 5-3 3v1l1 3-1 3h1v1l2 2-6 11 6 2 3 1v7l2 2v-2h5l5 3 2 3 3 4 1 1 2 4v1l-2 1h-1v2l4 2 1 1 2 2 6-4c2-2 9-2 11-1s5-2 8-3c4-1 6 7 7 12 1 4-1 9-5 9-3 0-9 2-12 5-2 2 3 8-1 8s-7 3-5 4c2 0 5 5 7 7l4 8c1 2 8 3 13 4 4 1 2 6 0 13v5l4-4c5-5 5-5 12-7Zm309 145-3 3c-2 1-2 1-2 3v5l-1 2-2 3 3 2 2-1h1l7 4v1l1 2 1 1a42 42 0 0 1 10 4h3l1 1-1 1 2 1h1l3 1 1-1a163 163 0 0 0 6 1l1-1 3 1h1l3 2v3h1l1 1 4 1h4l2-1v1l1 2c1 1 1 0 2-1h2l4 2h3a23 23 0 0 1 1 0l1-1h1l-1 1 2 2c1 1 1 0 2-1l2-1h3l1-1 1-1v-1h1v-1l-1-2v-10h-2l-6 1-7-3-1-1-1 1-1 2h-2v-2l-2 1-2-2-2-3h-2l-1 1-2-1v-1l-2-2h-3l-3-2-1-1c-2-1-2-2-2-3l1-1h-5l-3 1c-2 0-2-2-3-4l-1-2-3-2-3-1-3-1-1-1-1-1v-1l1-1-1-1-1-1h-6l-1 1v1l-1 1-1 1h-1l-1-1-1 1h-1ZM271 416l1 1v1l1 2 2 2 1 2-1 1-2-1-4-1-6-2-1-1-1-1-1 2v2l1 1v1l1 1 2 1v5l2 2 1 1 2 1 1 2h-1l-1 1-2 1v1l2 1 2 2h2l1 1h1v2l1 1v2l-1 2 5-3 3-2 4-3h3l2 1v1l2 1v1l-1 2v2l-1 1v2c1 1 2 3 5 4 2 2 3 1 4 1h1v-1c-2-3 0-8 0-11s3 3 3 3l1-6 1-9c1-2 6-3 8-4 1-1-4-4-7-5-3-2-8-9-11-15l-2 3-2 2-1 2c-1 2-2 4-4 4h-2l-2-2-6-6h-3l-1-1-2 2Z"></path><path d="m361 458 5 2c2 1 3 1 6-2 3-2 4-4 4-6 1-2 1-3 3-3l3-1h8c1 0 4-4 6-3h6l4 4 4 2 3 1 3 2 3 2 2-1c1 0 3-1 5 1l2 2 1 3 6 3 5 2h7v18l1 2 4-1 1 1 1-1 1-2h6c2 0 5-1 5-5l1-4 1-3c1-3 2-3 3-3h2l1-2c1-1 1-2 3-2l6 1 4 1-1-3v-2l1-1-2-2-3-1-3-2h-3l-34-21-5-11-2-3-1-2-2-1h-4v1h-1l-2-1h-2l-2 1h-2c-2 0-4-2-5-3l-1-1 2-2 2-2 1-2h-4l-1-2v-1c0-2-2-3-3-3h-6l-3-3a72 72 0 0 0-2-3l-1 1-3 2 1 3v1l-2-1-2-1-1 2v1l-1 1h-1l-3 1-1 1-2 1-1 1v3l1 1v1l-1 3-10 2h-6s-2-7-8-10l-3-4c-1-1-1-1-6 1h-3c-6 3-7 3-11 7l-4 5 5 4c3 4 1 4-1 7-1 4 3 10 5 10 1 0 2-3 5-1 3 1 1 3 0 6-1 2 1 3 4 5 2 3 3 5 2 10v1l3-1 7-1Zm382 177-2-3-2-3-1-3-1-2v-1l2-2 1-1-1-1-2-4h-1 1v-2l-1-2 1-1h4l-5-5v1l-2 1v-8l2-3v-4l5 3 1 1c1-1 1 0 1 1l2 2 2 2 2-2 1-1 1 1v3l1 3 1 2 3 3 3 1 3-1h4v1l2-1h1l2-1h6l-1 3v1l-2 1-1 1v1l-2 1h-2v4l1 3v3l1-2h1v1l2 2v1-3l1-1v-2l2-3 1-1 1 1c1 0 2 2 2 6l1 3 1 3v1l1 2v2h2v-12h1s1 2 3 2v-1l2 1 2 1 6-14-2-1s0-3 2-4l1-1 1-1 2-9v-1l8-6c3-2 6-3 8-2l2 1 1 1-1-2-1-1 1-1 2-3-3-1-2-1-2-1-4-2-3-1-2 1a261 261 0 0 1-12 9l-2 1-2 1-1 1-1 1-2 1h-9l-4 1h-1l-5 1h-6l-6-2-2 1h-1l-3 1h-4l-2-1-6-3a144 144 0 0 1 1-3v-3l-2-1-2-1-3 2 1 3v4a34 34 0 0 0-1 1v1h-5l-1 2-2 1h-1l-2-3v-1 1l-1 1h-2l-2-1-4-1-1-1-3 2-1-3-2 1h-4l-4-2h-1l-1-1v-3l-3-2h-1l-3-1-1 1h-3l-3-1-1 1h-3l-1-1-2-1v-1h-2l-1-1c-1 1-1 0-2-1l-8-3h-1l-2-3v-1l-7-4-2 2a28 28 0 0 0-4-3l1-1 2-2v-2l1-5c-1-2-1-2 1-3l3-3 1-1h1l-2-3-1-2-1 1-2 1h-1l-2-4-1-1c0-2-1-2-2-2l-2-1h-3l-2 1c-2 0-2-2-3-3v-5l-1-3-1-1v-1l-3-4v-5c-1 1-2 2-3 1-2 0-2-1-2-3v-2l-2 1-2 1-2-1-2-1h-1l-6-2-2 1-1 1c-2 0-3 1-4 3v4c-1 2-4 3-5 3l-4 3-3 1-2 1v1l1 1v7l-3 4-2 3a37 37 0 0 1-3 3l-4 4c-2 1-3 4-4 7l-2 5-4 5-2 3-1 1-6 4-4 1-4 1c-2 1-3 1-3-1l-1-1-7 3c-6 4-3 12-3 12l1 1 5-1h1l-2 9 3 2h3v4l4 9v4h-10l-3 1-2 1-3-1-2-1h-3v2l-2 2a9 9 0 0 0-4 2v1c0 1-3 3-1 6s8 4 13 3c6-1 5 1 2 3-3 1-10 1-5 10s16 11 17 11l9-2c3-1 3-5 4-7s0-4-1-7c-2-3 1-3 2-3h4c1 1-1 1-2 2v5l3 2c-1 1-2 1-2 3 0 3 2 4 2 10s-1 7 1 10l3 13c0 5 3 10 5 14 1 4 0 8 3 13s9 13 11 21 5 15 9 18c5 4 11 20 12 24s1 12 9 19c7 7 10-2 10-4s2-3 6-4c5-1 3-3 4-7 1-3 4-4 7-6s1-6 0-11l1-9c2-3 4-9 4-13s-3-5-4-12c-2-8 2-10 8-17 7-7 11-5 13-7l3-8c1-2 5-3 7-5l8-8c3-1 2-3 4-6l5-7c2-3 5 0 11-5 7-5 5-8 5-11s2-5 4-6l8-4c3 0 5 1 5 2l7 1 6-3 3-4v-1l-2-5Zm-437-91h-3v-5c0-3 1-3-1-9-2-5-5-6-8-8h-2l-3-1-3-2-1-2 2-1a71 71 0 0 1-7-9l-1-1h1v-3l-1-1v-1l1-1h1l1-1v-2l2-3h1l1-1 1-1-1-2v-3l1-2-5-1-3-2-1-1v-3l-2-1-2-2v-3l-1-3v-2l-1-1-2 1-2 1-1-1-3-1h-9l-3-1v1l-4 2c0 1-4 5-8 7l-3 1v2l1 1v10c0 6-2 11-3 12l-23 14c0 2 3 10 5 12l2 2 2 2v4h2c4 0 15 5 25 11s29 23 31 25h17l10 2 2 4h5v-2l-4-4-2-5v-7l1-4c1-1 2 1 3 2h2l-7-8v-5ZM72 427v-1l1-1 1-1v-3h-1v-1h-2l-1 1 1 1v2l-1 1-2-1h-1v1h-3l-2 1-3-2h-1v1l1 1-1-1-2-1-1-1v-1h-4v2l-1-1h-1l-1 1h-4l-1 1h-4l-1 2h-6l-5 4-2-1-3 1v4l-2 1v1l-1 3h-2l-1 1v2s1 0 0 0v1a3 3 0 0 1-1 0v1h-5l2 5c2 2 6 1 9 4 2 3 1 5 3 6 3 1 4 2 5 5 0 4-2 3-2 5 1 3 5 4 6 8s6 7 7 9c2 2 3-1 3-4 1-3 3 2 5 2 3-1 1-3 0-4s-2-2-1-4c2-1 5-2 2-3-2-1-2-2-2-4 1-2 5 1 8 2 3 2 0-2 0-4-1-2 1-3 1-2 1 2 4 5 6 4 3 0 1-3-1-4s-4-2-4-7c-1-4-4-3-7-3-2 0-3 2-4-3 0-4-4-7-5-10-2-3 0-5 4-4 5 1 2 4 5 4 2 0 0-3 1-3 0 0 2 3 4 2 2-2-2-4-2-4h4c0-2-4-3-3-5l3-3c1-1 4 2 5 0 1-1 4 0 8 1l2-2v-2Z"></path><path d="M179 487h1c3-1 5-1 6-3v-2l1-2 2-1v-5l1-3h1l1 1c1 1 1 2 3 2l6-2 1-1c2-1 4-2 5 0l1 2 1 1 5-1 7-2 9-3 4-1 6 1 5-2 1-1h1v2l1 1 4-3v-1l1 1h2l4 1h5l-5-4-2-3-1-2-1-3-1-1v-3h1l2-1-1-2v-2l-1-2-2-3-3-1h-2c-1-1-3-1-3-3l-1-2v-8h-1c0-2-1-3-2-3l-1-2-1-1h-1l-3-1h-1l-4 1h-6l-1 1c-1 5-7 5-12 6-6 1-13-1-23-2-10-2-11-4-14-6-2-2-5-2-10-4s-8-1-21-1c-12 1-12 4-15 7s-6 5-9 5c-4 1-5-1-10-1l-10-2c-4-1-5-4-6-7h-6v2l-1-1-1-1v1h-1c-1 1-1 0-1-1l-1-1h-3l-3 1h-1v2h-2v2l2 1v4h-2l-1 1v3l-1 2 3 1c6 1 5 4 3 8s1 8 4 8c3 1 4 9 1 11-2 1-3 5-2 6s4 1 5 3c2 2 2 10 5 11 4 2 12 2 15 7 2 4 13 6 17 2s3-8 6-7c4 0 8 2 11 5 4 4 10 3 15 2s5-2 6-5c2-3 4-3 6-3 2 1 3 3 8 1 5-1 2 2 1 3v3h4Z"></path><path d="m452 610 1-6-1-2 1-3h1l2-2 6-4h2c1 0 0 0 0 0v1h2l2-6v-1l-3-2-3-1v-11h-9c-3-1-3-3-4-5l-1-4-2-2-1-2c-2-1-3-2-3-4 0-3 2-6 3-8l1-2c1-2 2-5 5-7l2-3-1-1c-1 0-6 2-9 0s-3-3-2-7v-9l-1-7 2-3h-3l1-9h2l1-3c-1 0-2-2-1-4l5-4v-1c1-2-1-4-1-4v-17l-6-1-5-1s-4-1-6-4l-1-3-2-2h-7l-3-1-4-3h-2l-5-3-3-4h-6c-2 0-5 3-6 4l-4-1-4 1h-3c-1 0-2 1-2 3l-4 7c-3 3-5 2-7 1l-5-1h-7l-3 1c1 5 5 11 5 11 2 6-2 5-5 5l-17 2c-4 0-12-4-16-7-5-4-7-2-13-4-5-2-3-4-4-7h-1l-2 1-2-1-6-5v-2h1v-2l1-2 1-1-1-1-1-1-2-1h-3l-4 3-3 2-8 4v1l-4-2-3-1-3-1-3-3-1-1v3h-3l1 2v2l1 3 1 2 2 3 5 4c3-1 3 0 3 1l1 1 2-1 3-1v1l1 2v6l2 1c1 0 2 0 2 2v3l1 1 3 1 5 2h1l-1 1-1 1 1 3 1 3-2 1h-1v1l-2 2v2l-2 2h-1v6l1 1 7 8-2 2 1 1 3 1a64 64 0 0 1 4 2c3 1 6 2 8 7 2 7 2 7 1 10l1 5h2v5l7 8 2-1c2-1 4 0 8 1 3 0 3 0 5 3 1 2 3 8 7 12 3 5 2 8 4 9l12 2c5 2 3 4 5 6l8 4 8 1c5 1 4 3 9-1s12-5 15-3c4 3 5 11 6 14s8 3 10 2h5c1 2 7 2 12 3 5 0 12 6 18 4l5-2v-1ZM-84 180v1l1 3h1l2-5v-9l3-2v-1c3-2 4-3 3-7l-4-8h1s3 0 3-2c1-2 1-5-3-8h-1v-21c0-1-4-11 4-17 5-3 6-2 7-1h2c2-2 2-5 2-6v-2l-2-1h-1l-1-1 2-3 2-4 1-3 2-18s6 0 7-3v-2l2-5 5-8v-4l-1-2-1-2 1-1 1-1a54 54 0 0 0 5-9c1-2 3-1 3-1l3 2v-2c1-5 1-9 3-9 1-1 5 1 10 2l3 1 2-2-1-1v-2l1-3V7l2-1 2 2 1-2 1-1c1-2 2-3 5-2 2 1 3 3 3 6l1 4c2 3 3 3 4 3l3-1 3-2c2-1 3-2 4-1 2 0 3 2 4 3l2 1 2-3 1-1 1-1 2-3 2-10 2-5 2-4 2-2 4 1c3 0 3-2 4-2l1-1 4 5v1l2 1 3 4c2 3 2 3 0 4l-1 2c-2 2-2 3-1 3l1 2v1l1-1 1-2 1-1 3-4c2 0 2-2 2-3l1-2c2 1 4 3 5 2v-2c-1-2 0-3 1-5l1-2h-5c-2 2-4 1-5 1-1-1 2-3-1-4l-5-3h8c2 0 4-3 5-4 2-1 5-1 5-3 1-2-2-2-4-3-2 0-6-1-10-4-5-2-6-3-8 0s-4 4-5 3c-2-1-7-3-8-1s-3 5-6 3-7-2-10-1-10 3-12 5c-2 3-6 5-13 3-6-2-5 3-2 5 3 3 1 5-3 4-4 0-3 0-5 4s-5 5-7 4c-1-1-3-4-4-3-2 1-1 4-1 4h-3l-1 4-3-1c-1 1 1 3-1 4-1 1-3 1-3 3l-2 4c-1 1-3 1-4 4 0 3 0 6-2 7l-10 4c-4 2-5 5-4 7v9c0 3-3 4-5 4s-1 3-2 5c0 2-2 3-3 5v4l-3-1c-2 1-1 3 0 4s3 1 2 4-3 2-3 6-2 7-3 8l-4 6c-2 2-1 4-2 5s-2-2-4-1l-3 5-5 10-7 6c-3 2-5 7-7 10l-7 4c-2 1-4-2-5-1-1 2 1 3-4 6-4 3-5 8-6 14-1 7-3 5-4 7-1 3 2 7 3 6s3-1 3 1v5c0 1 3 1 4 8s-1 11-2 12-4 1-4 4 2 4 6 6c3 1 3 5 9 7 7 2 10-3 12-3 2-1 7-5 13-13l9-5 2-1Zm931 579v-1l2-2h1v-1l-1-1-1-1-1-4-1-1v-1l-2-4v-1l1-5c1-2-2-4-6-7-3-2-4-7-3-9v-1c2-1 2-2 2-5v-3l2-2 1-1-1-1-2-1v-5l-2-2-2-2-3-4-1-3-4-6v-2l1 1h3l1-1-1-1v-1c2-1 1-1 1-2v-2l1-2v-1l2-2h8v-2c0-2 1-2 3-2h3l-1-1v-1h1l2-1h4v-1s0-2 2-3l1-1 2-1 1-1 1-3 3-2h1l1-1h-2l-3 1-3 2c-3 0-4-1-6-4l-2-4-4-2-1 1h-1l3-10h-6v-5l-1-3 1-3h-4l-2 1-3 1-4 1v-1h-1l1-1 2-3v-1h-1l-2-1h-1l1-2v-1l1-1 2-2 1-4h2v-1l2-2h2l1-2 1-2-1-1 1-2v-1l1-5-1-3-1-6h-1l-2 1h-1v-2l1-2c0-3-1-4-2-4l-3-3-4 3v4l-2 2-2 2v1l1 1v2h-2l-2-1c-1-1-4 0-6 1l-9 7-1 9-2 2h-1l-2 4 2 1-6 14-2-1h-2l-3-1v9l-1 2h-1l1 4v7h-1l-1-1-1-1-1 1-1 1-1 1v4l-1 1-1 1v7l2 5h2l5 9 6 13 1 7c0 1-2 3-2 10-1 6 2 5 6 6 4 0 10-1 16-8 6-6 7-3 8-2 1 2 4 4 5 8 0 3 2 4 2 9 0 4 4 7 4 10s0 6 3 8 2 3 4 8l1 9c1 5 1 9-1 11v3l3-4 4-5Z"></path><path d="M9 55v-9c-2-2-1-3 0-4v-2c-2-2-3-3-2-6v-6l-1-2-2-2c0-3-8-6-10-7-3-1-5-4-6-7l-2-2-1-1h-1l-1 2v4l-1 3v1l1 1v1l-2 2-4-1-9-2-2 9-1 3-4-3-1 1-2 3-3 6-2 2v2l1 1v5c0 3-3 6-4 8h-1l-1 5-1 2c-1 3-5 3-7 3l-2 18v3l-3 5-1 2v1h1l2 1 1 2-3 6h-2c-1-1-2-2-7 2-8 5-3 15-3 15v21c5 4 4 7 4 9-1 2-3 2-4 2l3 8c2 4 0 5-2 8a54 54 0 0 0-3 3l-1 3v5l-2 5h-1l1 1c2 3 0 6 1 10s2 9 5 12 5 12 8 13c2 2 3 3 2 4-1 2-3 3-1 4s2 4 3 8c1 5 7 3 11 0 3-4 7-7 14-8 6 0 4-6 4-9l2-16 1-9c0-3 1-7 9-10 7-3 6-11 6-16s-9-9-13-12c-4-4-3-8-3-11l2-7v-10c1-6 4-6 5-7l3-2c0-1-1-5 3-5 3-1 3-3 4-4l5-1c2-1 5-3 6-8 1-6 3-6 4-7v-5l-2-4c-1-2 0-4 1-6l2-6 4-6 5-1a56 56 0 0 1 0-11Zm525 343-1 1-3 1v2l-1 1h-1l-2 1-1 1-2 2c0 2 1 3 2 3l3-2 1 1v1c-1 1-1 2 1 2h4l5-4v-1h1v1l1 2v1h2l1 1v1h2l3 2h4v3l-2 1-2 1-2 1-2 1h-2l-2 1v2l-2 1-1-1-2-1h-3l1 2v1l1 2-1 1-2-2-1-1-1 1a4 4 0 0 1-2 1l-2-1-1-1-2-1-4 1h-3v1l-1 1v2l1 3 1 1h9l2-1 3 1 4-1h4l3 1v1l1 1h1l1 1h2c0-1 0-2 2-2l7-1h1l3-1h3l1-1-1-3v-2l1-2 2-1 4-2 1-1 2-2 2-1c2 1 3 1 4-1l1-1v-1l1 1 1 4 5-1c2 0 3-2 4-4l2-3c3-3 5-4 7-3h5l4-5 4-2 7-4 4-3 2-1h3v-2l-1-3-5-1-1-1c-4-1-5-3-5-3s-1-2-5-2h-11l-20 1-5 1-7-2-2-1-2-2-1-1-3 2-3 2-2 3 1 3v3l-2 1-3-2c-2-1-5-3-9-3h-3c-4 0-6 0-7 2l-3 5 4 3Zm-536 9v-3l1-1 1-1v-2l1-1 1-1 1 1v1-2H2v-2h3l1-1h1v1a326 326 0 0 0-1-5l-1-1h2l1 1v-1l-4-3v-4l1-1 1-2v-2l-1 1H1v-1l-1-1-1-1h-6l-1 1-1-1h-2l-2-1h-2l-2-1h-1v1l-2-1-2 3h-1l-2-3h-2a4 4 0 0 1-1 2v1l1 1v1h-1l1 1 1 1 1 1v2h1v1h1v3a108 108 0 0 0 10 10v1l2 2 1 1 1 1v1h-1l-3 1h1l3-1 2 1 2 2 1 1 2 2 1 1v-4h-1Z"></path><path d="m6 416 1-1H6v-1l-1-1 5-6v1l1 2 1-1h1v-1l-1-1v-1h4v-1h-1v-1h-1l-1-1-2-1-2-1-2-2-1-1-1-1H3v-1H2l1 1v1l1 1-1 1H2v-1l-1 1H0v3h-1l-1 1v2l1 1v4l5 5 2 3v-3Zm341 270-24 3c-5 0-19 2-20 7 0 5-3 8-4 9l-3-1-4-2c-2-1-5 0-8 1a52 52 0 0 1-8 2h-4l-4 1h-3l-1-2-1-1-2 5c1 4-1 8-1 11s3 2 4 4v8c0 2 4 3 3 6 0 4 0 3 2 6s-1 5 8 5c9 1 9-4 13-8 3-3 3-1 8 1 4 2 9-1 11-3 3-1 2-4 5-4 4 0 8 0 10-3 3-3 6-3 10-5l15-4c5-2 6-2 9-8s8-7 11-8l-9-26-13 6Z"></path><path d="M13 445a12 12 0 0 1 2 0v-1l1-1-1-1v-1l1-1h2l1-3 1-1 2-1v-2l-1-2v-1h-1l-1-1v-1h-1l-1-1v-8l1-2-1-2v-2h-2l-1-2v-1l-1-1-1 1h-1l-1-2-4 5v1h1v3l-1 2 1 5c0 3 0 13 2 16 1 3 3 4 2 5h-1 3Zm377 171-1 1 1 2 1 4-2 3-3 2-2 1v3l-2 12 1 8-6 21-16 7 8 26c3 0 5-1 8-3s5-1 9-1c3 0 2-3 2-5 1-3 3-4 5-4 3 0 5-1 9-4 3-2 2-6 4-8s5 0 9 0c5-1-1-6-2-9-2-3 0-3 2-7 1-3 2-4 3-2 2 2 2 1 3-1l4-7c4-4 4-5 6-11s-1-4-3-5l-5-7c-2-2-2-5-4-5h-11c-6-1-7-5-9-7l-3-5-1-4-3 1-2 4Z"></path><path d="m381 644 3-12v-3l2-2 3-2 1-2-1-3v-4l2-4h1l3-1-2-4c-2-6-8-2-9 0l-3 5c-2 1-4 1-4 3 0 1-1 5-3 6-1 2-4 1-7 2l-8-1c-2-1-5 1-6 2h-3l8 18 23 2ZM47 286l-1-1 1-1-1-1v-1h2l2 1 1-1 2-2v-1h4l4-1 1-1 3 1h4l1 1h1l3 1 1-1 3 2 2-1 1 3h3s0-1 0 0h1v1h1v-2 1h2l2-1 1 1 1 1 1-1 1 1 1 1 1-1 3-2 2 4 1-1 2-1 1 1h1l2-1 2 2 1 1v1l1-1v-3l-1-2 1-1h1l1-3c-2 0-5-5-6-7l-3-2-3-3v-5l2-3-1-1-3-2h-1l-2-2-2-1h-2l-3-3-2-2-1-3v-2l-4-2 1-1 1-2v-1l-1-2 1-1v-3l-3-2-1-1-5 1h-2v-2l-1-1h-4v-1h-2l-1-1-1-1-2 3-1 1-2 1h-4l-2 1v2l-1 1v2l3 2-2 1h-3l-1 1-1 2-1 1s-1 0 0 0l-1 2v1l-1 2v1l1 1 1 1h-2l-1-1h-1l-1 1-1 1h-2l-2 2-2 1-3-1h-1v1l3 10 3 3c1 1 3 3 3 5l2 3 2 3-1 3-2 3v2l5 4v-2Zm-96 83h2v-2h-1v-3h-1v-1l1-1v-1h-2v-2l1-1h1v-1l-8-2-3-1-2-1v-1l-1-1v-2l-3 1h-6v1h-1v1l-2 1h-1l-1-1h-2v1l-1 1h1v3l-1-1-1-1h-1v4l1 1h-1v1h-1v-1l-1-1h-2l-1 1-1-2-1-2v2l-1 2-1 2-2 1 1 1v2h-2v-2h-1l1-1h-1l-1-1-2-1v-3l-3 2v2l-1 1-1 1v1h-2l-2-1-2 1-1 1-1-1-1 1h-1v2h1l1 1c-1 1-1 1 1 2v1c1 1 0 2-1 2l-2 1-1 1v1l1 1v1l2 2v1h-1l-1 2h1v1l1 2 3 1v1l2-1h1v3l-1 1-1 2 4-2c1-2 3-3 10-3 8 0 9 6 12 13 4 7 8 8 10 11s7 10 13 11c6 0 14 9 15 10 2 1 4-1 6 2l5 6c2 1 4 1 5 4l3 8c1 3 0 4-2 9-3 5-1 6 1 7 1 1 8-1 8-4l3-11c2-4 0-5-2-7-2-3-1-2 0-8 0-6 5-2 6-1l6 6c2 1 3-2 3-4s-1-6-3-7l-7-3-9-6c-3 0-6 0-6-2v-5c-2 0-7 0-11-2-4-1-5-4-7-6-2-3-3-7-6-10l-9-8c-3-2-4-7-5-10s1-8 6-11c2-2 4-1 5-1h1l2-1Zm268 161-3-3-5-11a1190 1190 0 0 1-20 11h-2l-2-1-4-2-4-1v-1c-1 20-5 36-7 39l1 4 1-1v2l15 3 5-5 1-2c2-2 3-2 5-2h3c2 0 3-3 4-5l1-1-6-7-4-5h1s14-3 19-6l3-1v-4l-2-1Z"></path><path d="M247 467v-1h-1l-1 1-5 1h-10l-9 3a257 257 0 0 0-13 3v-1l-1-2c-1-1-2-1-5 1h-1l-6 2-4-1-1-1v-1 3l-1 2v3l-2 1v2l-1 2c0 3-2 3-6 3h-4v10l1 2h7c2 0 3 1 4 3v4l-1 2-1 1-1 1-2 1-2 4-1 1-1 1v5l4 2 4 2h7a1235 1235 0 0 0 40-25c2-1 4-7 4-12a358 358 0 0 1 0-10l-1-1-1-2 3-2c5-1 8-5 9-6l-1-1Zm84 121 1 6v3c0 2-2 0 0 2 1 2 0 3 1 2 1 0 1 1 2-1v-2l1-3 1-1v-5l-2-1-2-1-1 1h-1ZM79 671h-9v45H60s-2 2-1 4-1 4-3 6l-1 1-1 5c1 1-1 2-2 3l-1 1v3c1 2 2 3-1 5l-3 4 1 1 3-1h2l1 3v3l1 2c1 2 1 4 3 5v5l2 2 2 2 4 6 1 3c3 1 7 0 10-1l2-2 2-3c2-2 4-2 6-2l3 3 2 3c0 2 1 4 5 4h14c3 2 5 2 8 0l5-2h1v-2l1-3h1c0-1 1-2 3 0l8 4 6 1 11-14-1-5-1-2-1-1v-1l5-1v-2h6l-1 5v3c0 4 0 7 2 9l3 2c2 2 4 4 4 6v2l1-1 1-4 1-2 1-5v-1h1l1-1 1 1c1 0 1 1 2-1 2-1 1-6 0-8 0-2 7-9 7-10h5l4-16-1-3c-1-1 1-10 2-13l2-2 1-3v-8h4l1-2c0-2 1-2 3-2 2-1 4-1 5-3l2-3 3-3c-3-3-14-5-15-13l-1-12-2-8-1-8H79v22Zm119-24c-1-2-6-7-9-8s-7-6-6-9c0-4-1-8-3-11-3-2-14-15-14-23-1-8-5-9-5-12l-4-6-7-8-3-7c1-1 1-1 4 3l8 11 6 5c2 0 4 2 5-5l2-10 1-2-7-28-3 5-8 2-8 1c-3-1-5 0-7-2s-7-3-11-2-3-1-8 2c-5 4-9 5-21 1-11-3-15-2-19-3h-2v3l-1 8v2c-1 3-2 7 2 14v81h119l-1-2Z"></path><path d="M259 751c2 0 3-2 4-4v-1l-10-14-13-9c-3-2-12-7-14-12-2-4-2-7-2-10-1-3-3-8-6-11l-2 4-3 2c-1 2-3 3-5 3l-3 2v2h-5v8l-1 3-2 3c-1 2-2 11-1 12l1 3h4l3-2 1 1 2 1 2-6 1-1 5 5v1l4-2 2-1h2l1 1v-1h3l5 1 7 4 3 2 4 5 10 11h3ZM-21 639v1l2 9 1 9 1 3 4 4 1 2-1 3-1 3v16l-1 8-1 7-6 7-9 11c-1 4-3 5-5 6l-1 2 1 3 1 4 1 2 4 5 3-1 3 4 2 5 2 8c0 7 1 11 3 13l4 4h1l-17-1-2 4 1 1 2 2c3 2 8 5 10 10l1 8c4 0 7-1 9-3h2l2 2 1 1 1-1c1-1 3-3 9-3 8 0 12-2 12-5l-1-3v-2l4-1c6-1 10-2 17-7 6-5 8-6 8-8v-4l6-1h5c0-1 1-2-1-4l-2-6-1-2v-3l-1-3h-2c-1 1-2 2-3 1h-1c-1-2 2-4 3-5 2-2 2-3 1-5v-1h-1l1-3h1l2-3c-1-1 0-4 1-6l1-1c1-1 3-3 2-5l2-4h9v-39l-81-43-9 5Z"></path><path d="m-56 531-5 4-5 3c-2 2-4 5-4 8 1 4-2 9-4 10l-1 1c-2 0-3 0-3 2l3 6 1 1v9h1l1 1-1 10v1l-1 1v12l-4 4 2 2 5 7 1 3c0 4 1 6 3 6l4 2a11 11 0 0 0 5 1c2 1 4 1 5 3v3l1 2h3c3 0 8 1 12 4l3 2c3 3 4 4 9 1l13-7h1l80 43v-6h10v-21h1l-1-81c-4-7-3-11-2-14l1-2v-8l1-3-8-4c-1-3-14-1-17-4-2-3 0-4-4-5s-24-4-26 2c-3 7-5 10-3 13 1 4 2 11-4 13-5 2-13 0-18-7-6-7-20-3-21-5s1-7-4-11c-5-3-17-6-21-6h-9v4Z"></path></g><path d="M96 394v1l-2 2c-2 3-5 2-5 7 0 6 0 5 2 10l1 2c2 3 3 6 7 7l10 2c5 0 6 2 10 1 3 0 6-2 9-5s3-6 15-7c13-1 16-1 20 1 5 2 9 1 11 4 2 2 4 4 14 5 10 2 17 3 23 2 5-1 11 0 12-5l1-1v-1c2-4 3-7-2-13-6-7-9-8-15-12h-1c-6-4-5-7-12-9s-9-2-13-5-5-2-6-5-4-6 0-6c5-1 6-4 6-5v-5c0-1-5-1-2-4 4-3 8-5 7-6l-1-2h-1l-4-1c-3 0-3 1-8 4-4 3-8 6-15 5-2-1-1 5-3 5v3c2 2 2 5 5 6h7c3-1 5 0 5 1s4 3 0 4h-9l-4 4-6 1c-1 1 0 5-5 4-5 0-11-1-9-4 1-3-4-6-5-6-2 0-3-2 0-4 2-2 5-1 5-4 0-2-5-4-9-4-3 0-1 0-6-3-5-2-4-4-8 0-3 4-4 9-6 10s-4 0-4 2 2 3 0 6l-1 1-6 3c-1 1 2 2 0 6l-2 8Zm210 42-1 8-1 6s-3-5-3-2c-1 3-2 7-1 11l1 1c1 3-1 5 4 7 6 2 8 0 13 4 4 3 12 7 16 7l17-2c3 0 7 1 5-5 0 0-5-6-5-11v-1c1-5 0-7-3-10-2-2-4-3-3-5 1-3 3-5 0-6-3-2-4 0-5 0-2 0-6-6-5-9 2-3 4-3 1-7l-5-4-1-1v-5c2-7 4-12 0-13-5-1-12-2-13-4l-4-8-7-7c-2-1 1-4 5-4s-1-6 1-8c3-3 9-5 12-5 4 0 6-5 5-10-1-4-3-12-7-11-3 1-6 4-8 3s-9-1-11 1l-6 4-7 6-10 6c-3 2-9 5-7 11 1 7 6 11 7 14 0 3-1 8 3 13 4 4 9 5 12 11l1 1c3 6 8 13 11 14 3 2 8 5 6 6-1 1-6 2-7 4Zm499 274c-2 2-5 2-7 2-4-1-7 0-7-6 1-7 3-9 3-10l-1-7-6-13c-1-2-4-8-6-9l-2-1c-3 0-7-1-10-4-4-5-7-9-7-13l-2-9c-1-3-3-7-4-6-2 2-3 1-4 0-2-2-5-4-5-1 0 2 1 4-1 5l-1 2v1l-3 4c-1 1-4 3-6 2h-7c-1-1-2-3-5-2l-8 4c-2 1-4 3-4 6s2 6-5 11c-6 4-9 2-11 5l-5 7c-2 3-1 5-4 6l-8 8c-3 2-6 2-7 5l-4 7c-1 2-6 1-12 8l-4 4h153v-6ZM261-1c0 1 0 3 3 3l3-3h-6Zm-46 0-2 1c-2 1-3 0-3-1h-95l15 9c13 9 18 11 21 12l6 6c1 2 7 10-1 18-7 9-12 12-21 11l-15-2c-4-1-5-1-7-3-3-2-4-1-7-1s-3-2-4-3c-1-2-5-3-5 0 0 2-1 5 2 7 2 1 12 3 11 10s1 11 2 12c2 2 0 7 2 10 2 2 7 2 12 6 4 4 14 7 15 1 2-6-2-5-6-6s-5-2-7-4-3-4-2-5c2-2 1-4 2-6h5l6 4c3 1 6 0 9 3 2 2 1 5 4 5s10-4 5-11-5-10 0-15c5-6 8-13 12-13l12 2c3 1 8 2 7-5s0-8-4-10c-4-3-4-4-4-11s0-13-4-14c-4-2-7-6-1-4h12c5-1 6 0 7 3s2 2 4 5c2 2 6 4 3 6l-6 2c-1 0-2 0-3 2 0 2-2 2-1 4l5 6c2 3 5 4 7 4 3 0 7 1 9-2l2-11c-1-2 0-4 5-3 4 0 3-2 1-4-1-2 1-2 2-1 1 2 2-1 4-3l6-7c1-1 2-3 5-4h-22Zm-38 501v-1l-1-2v-8l-1-2v-3c0-1 4-4-1-3-5 2-6 0-8-1-2 0-4 0-6 3-1 3-1 4-6 5s-11 2-15-2c-3-3-7-5-11-6-3 0-2 4-6 8s-15 2-17-2c-3-5-11-6-15-7-3-1-3-9-5-11-1-2-4-2-5-3s-1-5 2-6c3-2 2-10-1-11s-6-4-4-8 2-7-3-8l-3-1h-1c-4-1-7-2-8-1-1 2-4-1-5 0l-4 3c0 2 4 3 4 4 1 2-3 1-4 1 0 0 4 2 2 3-3 2-4-1-5-1 0 0 2 3-1 3-2 0 0-3-4-4s-6 1-4 4c1 3 5 6 5 10 1 5 2 3 4 3 3 0 6-1 7 3 0 5 2 5 4 7 1 1 4 4 1 4s-5-2-6-4c-1-1-2 0-1 2 0 2 3 5 0 4s-8-4-8-2c-1 2 0 3 2 4 3 1 0 2-2 3-1 1 0 3 1 4s2 3 0 4c-2 0-5-6-5-2 0 3-1 6-3 4s-6-5-7-9-5-5-6-8c0-2 2-1 1-5 0-3-1-4-4-5-2-1-1-3-3-6-3-3-7-2-9-5l-2-4 1-1c1-1-1-1-2-4-2-3-2-13-2-16l-1-5v-1l-2-2-5-5v25l1 5-1 4v104c5 7 13 9 18 7 5-3 5-10 3-13-1-3 1-6 3-13 3-6 23-4 27-3 3 2 2 3 4 6s16 1 17 3 4 4 7 5h3c4 1 8 0 19 3 11 4 16 3 21-1 5-3 4-2 8-2 4-1 9 0 11 2s3 1 7 1h8c4 0 7-3 8-3v1l3-5 2-4c1-4 0-7 2-9l3-5v-1l1-2 4-13-1-3Zm-95 1c-1 2-4 2-8 2l-6 3c-2 0-4-4-6-4h-7c-1 0-3-4-1-5 4-2 5-1 7 0s1-3 7-1l9 3c3 0 7 0 5 2Zm80-3c-2 1-2 4-2 5 0 2-3 1-5 1-2 1-4 3-7 3l-7-2c-2-2 0-4 3-5 3 0 3-2 7-3l2 1c2 1 3 0 6-1l5-3c1 1-1 2-2 4Z" fill="#1B253A"></path></g><defs><clipPath id="a"><path fill="#fff" d="M0 0h804v715H0z"></path></clipPath></defs></svg>`;
});
const objectEntries = (obj) => {
  return Object.entries(obj);
};
const css$6 = {
  code: '.player.svelte-9z74xo.svelte-9z74xo{--_radius:var(--radius-md);align-items:center;border-radius:var(--radius-md);border-radius:var(--_radius);display:flex;flex-direction:column;gap:.12rem;height:4.875rem;padding-top:.5rem;position:relative;width:4.875rem}.player.playing.svelte-9z74xo.svelte-9z74xo:after{border:2px solid #fff;border-radius:var(--_radius);bottom:calc(0px - var(--px));content:"";left:calc(0px - var(--px));position:absolute;right:calc(0px - var(--px));top:calc(0px - var(--px))}.player.playing.svelte-9z74xo .name.svelte-9z74xo{font-weight:700}.player.side-attack.svelte-9z74xo.svelte-9z74xo{background:var(--color-red-medium)}.player.side-defense.svelte-9z74xo.svelte-9z74xo{background:var(--color-blue-medium)}.player.side-admin.svelte-9z74xo.svelte-9z74xo{background:var(--color-blue-transp-12)}.player.svelte-9z74xo .name.svelte-9z74xo{align-items:center;display:flex;flex-shrink:0;font-size:.5rem;height:1.25rem;justify-content:center}.player.svelte-9z74xo .face.svelte-9z74xo{height:2.625rem;width:2.625rem}.player.svelte-9z74xo .online-status.svelte-9z74xo{background:orange;border-radius:var(--radius-full);height:.5rem;position:absolute;right:.25rem;top:.25rem;width:.5rem;z-index:var(--layer-4)}.player.svelte-9z74xo .online-status.connected.svelte-9z74xo{background:rgba(56,198,0,.467)}',
  map: null
};
const Player = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { name } = $$props;
  let { faceId = void 0 } = $$props;
  let { isConnected = void 0 } = $$props;
  let { isPlaying = false } = $$props;
  let { side } = $$props;
  if ($$props.name === void 0 && $$bindings.name && name !== void 0)
    $$bindings.name(name);
  if ($$props.faceId === void 0 && $$bindings.faceId && faceId !== void 0)
    $$bindings.faceId(faceId);
  if ($$props.isConnected === void 0 && $$bindings.isConnected && isConnected !== void 0)
    $$bindings.isConnected(isConnected);
  if ($$props.isPlaying === void 0 && $$bindings.isPlaying && isPlaying !== void 0)
    $$bindings.isPlaying(isPlaying);
  if ($$props.side === void 0 && $$bindings.side && side !== void 0)
    $$bindings.side(side);
  $$result.css.add(css$6);
  return `<div class="${[
    "player side-" + escape(side, true) + " svelte-9z74xo",
    isPlaying ? "playing" : ""
  ].join(" ").trim()}"><div class="face svelte-9z74xo">${validate_component(Face, "Face").$$render($$result, { faceId: faceId ?? 0 }, {}, {})}</div> <div class="name svelte-9z74xo">${escape(name)}</div> ${isConnected !== void 0 ? `<div class="${["online-status svelte-9z74xo", isConnected ? "connected" : ""].join(" ").trim()}"></div>` : ``} </div>`;
});
const css$5 = {
  code: '.square.svelte-py9bsy.svelte-py9bsy{display:block;grid-column:var(--_column);grid-row:var(--_row);isolation:isolate;margin:calc(var(--px)/2);outline:1px dashed #fff;position:relative}.square.svelte-py9bsy.svelte-py9bsy,.square.svelte-py9bsy>.svelte-py9bsy{min-height:0;min-width:0}.square.impossible-move.svelte-py9bsy.svelte-py9bsy:not(.current-position):after{background:var(--color-bg);bottom:0;content:"";left:0;mix-blend-mode:hard-light;opacity:.8;position:absolute;right:0;top:0;z-index:var(--layer-5)}.player.svelte-py9bsy.svelte-py9bsy{left:50%;top:50%;translate:-50% -50%}.item.svelte-py9bsy.svelte-py9bsy,.player.svelte-py9bsy.svelte-py9bsy{position:absolute}.item.svelte-py9bsy.svelte-py9bsy{height:1.5rem;width:1.5rem}.item.svelte-py9bsy.svelte-py9bsy:first-child{left:.25rem;top:.25rem}.item.svelte-py9bsy.svelte-py9bsy:nth-child(2){bottom:.25rem;right:.25rem}.item.svelte-py9bsy svg,.player.svelte-py9bsy svg{height:100%;width:100%}.move-button.svelte-py9bsy.svelte-py9bsy{background:transparent;bottom:0;cursor:pointer;display:block;left:0;position:absolute;right:0;top:0;transition:background .3s ease-out}.move-button.svelte-py9bsy span.svelte-py9bsy{display:none}.move-button.svelte-py9bsy.svelte-py9bsy:hover{background:hsla(0,0%,100%,.133);transition-duration:0ms}',
  map: null
};
const Square = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $isMoving, $$unsubscribe_isMoving;
  let $isPossibleMove, $$unsubscribe_isPossibleMove;
  let $isCurrentPosition, $$unsubscribe_isCurrentPosition;
  let $items, $$unsubscribe_items;
  let $players, $$unsubscribe_players;
  let $canMove, $$unsubscribe_canMove;
  let { coordinate } = $$props;
  const { machine: machine2 } = getGameContext();
  const items = useSelector(machine2.service, ({ context }) => context.items.filter((item) => isEqual(item.position, coordinate)), isEqual);
  $$unsubscribe_items = subscribe(items, (value) => $items = value);
  const players = useSelector(
    machine2.service,
    ({ context }) => {
      const gameState = GameState.fromContext(context);
      const currentUser = getCurrentUser(context);
      const { playerPositions } = gameState;
      return objectEntries(playerPositions).filter(([_, position]) => isEqual(position, coordinate)).map(([playerId]) => getPlayer(playerId, context)).filter((player) => getPlayerSide(player.id) === currentUser.side).map((player) => {
        const user = getUser(player.userId, context);
        return {
          ...player,
          user,
          side: getPlayerSide(player.id),
          isPlaying: gameState.activePlayer.id === player.id
        };
      });
    },
    isEqual
  );
  $$unsubscribe_players = subscribe(players, (value) => $players = value);
  const isMoving = useSelector(machine2.service, (state) => state.matches("Playing.Gameloop.Playing.Ready to move"));
  $$unsubscribe_isMoving = subscribe(isMoving, (value) => $isMoving = value);
  const isCurrentPosition = useSelector(machine2.service, (state) => {
    const readyToMove = state.matches("Playing.Gameloop.Playing.Ready to move");
    if (!readyToMove)
      return false;
    return isEqual(GameState.fromContext(state.context).activePlayerPosition, coordinate);
  });
  $$unsubscribe_isCurrentPosition = subscribe(isCurrentPosition, (value) => $isCurrentPosition = value);
  const isPossibleMove = useSelector(machine2.service, (state) => {
    const readyToMove = state.matches("Playing.Gameloop.Playing.Ready to move");
    if (!readyToMove)
      return false;
    const gameState = GameState.fromContext(state.context);
    return gameState.isValidMove(coordinate);
  });
  $$unsubscribe_isPossibleMove = subscribe(isPossibleMove, (value) => $isPossibleMove = value);
  const getMoveEvent = (to, context) => {
    return {
      type: "apply game event",
      gameEvent: {
        type: "move",
        finalized: true,
        playerId: GameState.fromContext(context).activePlayer.id,
        to
      }
    };
  };
  const canMove = useSelector(machine2.service, (state) => state.can(getMoveEvent(coordinate, machine2.service.getSnapshot().context)));
  $$unsubscribe_canMove = subscribe(canMove, (value) => $canMove = value);
  if ($$props.coordinate === void 0 && $$bindings.coordinate && coordinate !== void 0)
    $$bindings.coordinate(coordinate);
  $$result.css.add(css$5);
  $$unsubscribe_isMoving();
  $$unsubscribe_isPossibleMove();
  $$unsubscribe_isCurrentPosition();
  $$unsubscribe_items();
  $$unsubscribe_players();
  $$unsubscribe_canMove();
  return `<div class="${[
    "square svelte-py9bsy",
    ($isMoving && $isPossibleMove ? "possible-move" : "") + " " + ($isMoving && !$isPossibleMove ? "impossible-move" : "") + " " + ($isMoving && $isCurrentPosition ? "current-position" : "")
  ].join(" ").trim()}"${add_styles({
    "--_row": coordinate[1] + 1,
    "--_column": coordinate[0] + 1
  })}>${each($items, (item) => {
    return `<div class="item svelte-py9bsy">${validate_component(Item, "Item").$$render($$result, { itemId: item.id }, {}, {})} </div>`;
  })} ${each($players, (player) => {
    return `<div class="player svelte-py9bsy">${validate_component(Player, "Player").$$render(
      $$result,
      {
        name: player.user.name,
        side: player.side,
        faceId: player.faceId,
        isPlaying: player.isPlaying
      },
      {},
      {}
    )} </div>`;
  })} ${$canMove && $isPossibleMove ? `<button class="move-button unstyled svelte-py9bsy" data-svelte-h="svelte-1xw0taw"><span class="svelte-py9bsy">Move</span></button>` : ``} </div>`;
});
const css$4 = {
  code: ".board.svelte-h3xvzy{grid-gap:0;display:grid;gap:0;grid-template-columns:repeat(var(--column-count),1fr);grid-template-rows:repeat(var(--row-count),1fr);height:var(--board-height);margin:0 auto;width:var(--board-width)}",
  map: null
};
const Board = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$4);
  return `<div class="board svelte-h3xvzy">${validate_component(Backdrop, "Backdrop").$$render($$result, {}, {}, {})} ${each([...new Array(ROW_COUNT)], (_, y) => {
    return `${each([...new Array(COLUMN_COUNT)], (_2, x) => {
      return `${validate_component(Square, "Square").$$render($$result, { coordinate: [x, y] }, {}, {})}`;
    })}`;
  })} </div>`;
});
const css$3 = {
  code: ".players-container.svelte-j1ncfg{margin-left:1rem;margin-right:1rem}h3.svelte-j1ncfg{margin-bottom:1rem;margin-top:0}.players.svelte-j1ncfg{display:flex;flex-wrap:wrap;gap:1rem}",
  map: null
};
const Players = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $defensePlayers, $$unsubscribe_defensePlayers;
  let $users, $$unsubscribe_users;
  let $activePlayerId, $$unsubscribe_activePlayerId;
  let $defenseAdmins, $$unsubscribe_defenseAdmins;
  let $attackPlayers, $$unsubscribe_attackPlayers;
  let $attackAdmins, $$unsubscribe_attackAdmins;
  const { machine: machine2 } = getGameContext();
  const attackPlayers = useSelector(machine2.service, ({ context }) => [context.attack.attacker], isEqual);
  $$unsubscribe_attackPlayers = subscribe(attackPlayers, (value) => $attackPlayers = value);
  const defensePlayers = useSelector(machine2.service, ({ context }) => context.defense.defenders, isEqual);
  $$unsubscribe_defensePlayers = subscribe(defensePlayers, (value) => $defensePlayers = value);
  const attackAdmins = useSelector(machine2.service, ({ context }) => context.users.filter((user) => user.side === "attack" && user.isAdmin), isEqual);
  $$unsubscribe_attackAdmins = subscribe(attackAdmins, (value) => $attackAdmins = value);
  const defenseAdmins = useSelector(machine2.service, ({ context }) => context.users.filter((user) => user.side === "defense" && user.isAdmin), isEqual);
  $$unsubscribe_defenseAdmins = subscribe(defenseAdmins, (value) => $defenseAdmins = value);
  const users = useSelector(machine2.service, ({ context }) => context.users, isEqual);
  $$unsubscribe_users = subscribe(users, (value) => $users = value);
  const getUserForPlayer = (player, users2) => {
    const user = users2.find((user2) => user2.id === player.userId);
    return user ?? { name: "Unbekannt", isConnected: false };
  };
  const activePlayerId = useSelector(machine2.service, ({ context }) => GameState.fromContext(context).activePlayer.id);
  $$unsubscribe_activePlayerId = subscribe(activePlayerId, (value) => $activePlayerId = value);
  $$result.css.add(css$3);
  $$unsubscribe_defensePlayers();
  $$unsubscribe_users();
  $$unsubscribe_activePlayerId();
  $$unsubscribe_defenseAdmins();
  $$unsubscribe_attackPlayers();
  $$unsubscribe_attackAdmins();
  return `<div class="players-container svelte-j1ncfg"><h3 class="svelte-j1ncfg" data-svelte-h="svelte-1krh9a0">Verteidiger:innen</h3> <div class="players svelte-j1ncfg">${each($defensePlayers, (player) => {
    let user = getUserForPlayer(player, $users);
    return ` ${validate_component(Player, "Player").$$render(
      $$result,
      {
        faceId: player.faceId,
        name: user.name,
        isConnected: user.isConnected,
        isPlaying: $activePlayerId === player.id,
        side: "defense"
      },
      {},
      {}
    )}`;
  })} ${each($defenseAdmins, (admin) => {
    return `${validate_component(Player, "Player").$$render(
      $$result,
      {
        name: admin.name,
        side: "admin",
        isConnected: admin.isConnected
      },
      {},
      {}
    )}`;
  })}</div> <h3 class="svelte-j1ncfg" data-svelte-h="svelte-1fki2a7">Angreifer:innen</h3> <div class="players svelte-j1ncfg">${each($attackPlayers, (player) => {
    let user = getUserForPlayer(player, $users);
    return ` ${validate_component(Player, "Player").$$render(
      $$result,
      {
        faceId: player.faceId,
        name: user.name,
        isConnected: user.isConnected,
        isPlaying: $activePlayerId === player.id,
        side: "attack"
      },
      {},
      {}
    )}`;
  })} ${each($attackAdmins, (admin) => {
    return `${validate_component(Player, "Player").$$render(
      $$result,
      {
        name: admin.name,
        side: "admin",
        isConnected: admin.isConnected
      },
      {},
      {}
    )}`;
  })}</div> </div>`;
});
const css$2 = {
  code: ".rounds.svelte-190qug7.svelte-190qug7{align-items:flex-end;display:flex;flex-direction:column-reverse;gap:.5rem;width:100%}.rounds.svelte-190qug7 .round.svelte-190qug7{--_base-width:3.5rem;--_min-percent:10%;--_max-percent:65%;--_percent:calc(var(--_min-percent) + (var(--_max-percent) - var(--_min-percent))*var(--round)/12);align-items:center;background-color:#dadcdf;background:color-mix(in oklab,var(--color-blue-spielbrett2) calc(10% + 55%*var(--round)/12),#fff);color:var(--color-blue-transp-10);display:flex;font-size:.875rem;font-weight:500;height:2.125rem;justify-content:flex-end;padding:.3125rem 0;position:relative;width:3.5rem;width:var(--_base-width)}@supports (color:color-mix(in lch,red,blue)) and (top:var(--f )){.rounds.svelte-190qug7 .round.svelte-190qug7{background:color-mix(in oklab,var(--color-blue-spielbrett2) var(--_percent),#fff)}}.rounds.svelte-190qug7 .round span.svelte-190qug7{text-align:center;width:var(--_base-width)}.rounds.svelte-190qug7 .round.current.svelte-190qug7{font-size:1rem;font-weight:700;width:calc(var(--_base-width) + 1.375rem)}.rounds.svelte-190qug7 .round .global-attack.svelte-190qug7{position:absolute;right:-.75rem;top:1.5rem;width:2rem}.rounds.svelte-190qug7 .round .attacker-reveal.svelte-190qug7{left:-1.25rem;position:absolute;top:1.5rem;width:2rem}.rounds.svelte-190qug7 .round .attacker-reveal .eye.svelte-190qug7{left:-.75rem;position:absolute;top:.25rem}",
  map: null
};
const Rounds = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $currentRound, $$unsubscribe_currentRound;
  const { machine: machine2 } = getGameContext();
  const currentRound = useSelector(machine2.service, ({ context }) => GameState.fromContext(context).currentRound);
  $$unsubscribe_currentRound = subscribe(currentRound, (value) => $currentRound = value);
  $$result.css.add(css$2);
  $$unsubscribe_currentRound();
  return `<div class="rounds svelte-190qug7">${each(new Array(TOTAL_ROUNDS), (_, i) => {
    return `<div class="${["round svelte-190qug7", $currentRound === i ? "current" : ""].join(" ").trim()}"${add_styles({ "--round": i })}><span class="svelte-190qug7">${escape(i + 1)}</span> ${NEW_GLOBAL_ATTACK_ROUNDS.includes(i) ? `<div class="global-attack svelte-190qug7">${validate_component(Polygon, "Polygon").$$render($$result, { color: "orange" }, {}, {})}</div>` : ``} ${ATTACKER_REVEAL_ROUNDS.includes(i) ? `<div class="attacker-reveal svelte-190qug7">${validate_component(Polygon, "Polygon").$$render($$result, { color: "red-angriff" }, {}, {})} <svg class="eye svelte-190qug7" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 21"><g clip-path="url(#a)"><path d="M25.5 12.9c.4 0 .7 0 1-.2.3-.3.6-.8.1-1.3-.8-.9-7.9-7.4-16.3-5.1-8.5 2.2-9.8 6-9.8 6s1.7 4.2 10.3 5.4A17.5 17.5 0 0 0 24.9 13s.3-.3.6-.2Z" stroke="#fff" stroke-linecap="round" stroke-linejoin="round"></path><path d="M13 7.3s-2.6.6-3 2.3c-.4 1.7-.7 5.3 2.5 6.4 3.2 1.2 6-3.1 4.8-6.4-1-3.3-4.2-2.3-4.2-2.3Z" fill="#fff"></path><path d="M1.5 5S4 7 5 8.3M13.9.5l-.2 5.3M22 8l3.2-2.5M6.7 1.8 9 6.6m9.7-.2L20.5 2m5.1 12.4s0 2.4-3.3 4m-2.4 1.2s-1 .5-2.4.8" stroke="#fff" stroke-linecap="round" stroke-linejoin="round"></path><path d="M13.5 8.6s-2.4.4-2.3 2.8" stroke="#1F2134" stroke-linecap="round" stroke-linejoin="round"></path><path d="M13.5 10s-1 .3-1.2.9c-.1.6-.3 2 1 2.4 1.2.5 2.2-1.2 1.8-2.4-.4-1.3-1.6-.9-1.6-.9Z" fill="#1F2134"></path></g><defs><clipPath id="a"><path fill="#fff" d="M0 0h27.4v20.9H0z"></path></clipPath></defs></svg> </div>` : ``} </div>`;
  })} </div>`;
});
const Status = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${validate_component(Rounds, "Rounds").$$render($$result, {}, {}, {})}`;
});
const TempActionButton = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $itemInventories, $$unsubscribe_itemInventories;
  const { machine: machine2 } = getGameContext();
  const itemInventories = useSelector(
    machine2.service,
    (state) => {
      const gameState = GameState.fromContext(state.context);
      return {
        attack: gameState.attackInventory,
        defense: gameState.defenseInventory
      };
    },
    isEqual
  );
  $$unsubscribe_itemInventories = subscribe(itemInventories, (value) => $itemInventories = value);
  $$unsubscribe_itemInventories();
  return `Defense:
${each(objectEntries($itemInventories.defense), ([itemId, count]) => {
    return `${count > 0 ? `<div>${validate_component(Item, "Item").$$render($$result, { itemId }, {}, {})}: ${escape(count)}</div>` : ``}`;
  })}

Attack:
${each(objectEntries($itemInventories.attack), ([itemId, count]) => {
    return `${count > 0 ? `<div>${validate_component(Item, "Item").$$render($$result, { itemId }, {}, {})}: ${escape(count)}</div>` : ``}`;
  })}`;
});
const css$1 = {
  code: ".playing.svelte-s1m360{grid-gap:1rem;display:grid;gap:1rem;grid-template-columns:27.75rem auto 1fr}.board.svelte-s1m360,.playing.svelte-s1m360{position:relative}.board.svelte-s1m360{--board-height:45rem;--board-width:calc(var(--board-height)*var(--column-count)/var(--row-count));--board-square-size:calc(var(--board-height)/var(--row-count))}",
  map: null
};
const Playing = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$1);
  return `<div class="playing svelte-s1m360"><div class="actions">${validate_component(Players, "Players").$$render($$result, {}, {}, {})} ${validate_component(TempActionButton, "TempActionButton").$$render($$result, {}, {}, {})}</div> <div class="board svelte-s1m360">${validate_component(Board, "Board").$$render($$result, {}, {}, {})} ${validate_component(Actions, "Actions").$$render($$result, {}, {}, {})}</div> <div class="status">${validate_component(Status, "Status").$$render($$result, {}, {}, {})}</div> </div>`;
});
const css = {
  code: ".game-wrapper.svelte-1j0d4w3{align-content:center;background:#000;display:grid;height:100%;justify-content:center;place-content:center;width:100%}.game.svelte-1j0d4w3{grid-gap:1rem;background-color:var(--color-bg);border-radius:var(--radius-sm);display:grid;gap:1rem;grid-template-rows:auto 1fr;height:50rem;overflow:hidden;position:relative;width:90rem}.game.section-playing.svelte-1j0d4w3{background-image:url(/images/board-backdrop.svg);background-repeat:no-repeat;background-size:cover}@media(max-width:1439.98px) or (max-height:809.98px){.game.svelte-1j0d4w3{scale:.8;transform-origin:center}}@media(max-width:1199.98px) or (max-height:674.98px){.game.svelte-1j0d4w3{scale:.6}}",
  map: null
};
const Game = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $section, $$unsubscribe_section;
  const { machine: machine2 } = getGameContext();
  let { reportMousePosition } = $$props;
  let gameContainer;
  const section = useSelector(machine2.service, (snapshot) => {
    let section2 = void 0;
    if (snapshot.matches("Lobby")) {
      section2 = "Lobby";
    } else if (snapshot.matches("Playing")) {
      section2 = "Playing";
    } else if (snapshot.matches("Finished")) {
      section2 = "Finished";
    }
    return section2;
  });
  $$unsubscribe_section = subscribe(section, (value) => $section = value);
  if ($$props.reportMousePosition === void 0 && $$bindings.reportMousePosition && reportMousePosition !== void 0)
    $$bindings.reportMousePosition(reportMousePosition);
  $$result.css.add(css);
  $$unsubscribe_section();
  return `<div class="game-wrapper svelte-1j0d4w3"> <div class="${"game section-" + escape($section?.toLowerCase(), true) + " svelte-1j0d4w3"}"${add_attribute("this", gameContainer, 0)}>${validate_component(Header, "Header").$$render($$result, {}, {}, {})} <div class="content">${$section === "Lobby" ? `${validate_component(Lobby, "Lobby").$$render($$result, {}, {}, {})}` : `${$section === "Playing" ? `${validate_component(Playing, "Playing").$$render($$result, {}, {}, {})}` : `${$section === "Finished" ? `${validate_component(Finished, "Finished").$$render($$result, {}, {}, {})}` : `Unknown state`}`}`}</div> ${slots.overlays ? slots.overlays({}) : ``}</div> </div>`;
});
let howl;
const sprite = {
  capture: [0, 204],
  move: [704, 316],
  select: [1519, 153],
  silence: [2172, 500]
};
const getHowl = () => {
  if (!howl) {
    const spriteVersion = Object.values(sprite).map((value) => window.btoa(`${value[0]}:${value[1]}`)).join("-");
    howl ??= new howlerExports.Howl({
      src: [`/audio/sprite.mp3?v=${spriteVersion}`],
      sprite
    });
  }
  return howl;
};
const play = (sound) => {
  getHowl().play(sound);
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $socketConnection, $$unsubscribe_socketConnection;
  let $state, $$unsubscribe_state;
  let { data } = $$props;
  const machineInput = data.machineInput;
  const gameId = machineInput.gameId;
  const userId = machineInput.userId;
  const hostUserId = machineInput.hostUserId;
  const mousePositions = {};
  const socketConnection = createWebSocketConnection({
    gameId,
    userId,
    onMessage: (message) => {
      if (message.type === "mouse position") {
        mousePositions[message.userId] = message.position;
      } else {
        machine2.send(message);
      }
    }
  });
  $$unsubscribe_socketConnection = subscribe(socketConnection, (value) => $socketConnection = value);
  const machine2 = useMachine(
    getClientGameMachine({
      send: socketConnection.send,
      actions: {
        playSound: play,
        showEmoji: ({ userId: userId2, emoji }) => showEmoji?.({ userId: userId2, emoji })
      }
    }),
    { input: machineInput }
  );
  const user = useSelector(machine2.service, ({ context }) => getCurrentUser(context), isEqual);
  setGameContext({
    gameId,
    userId,
    user,
    hostUserId,
    machine: machine2
  });
  const state = machine2.state;
  $$unsubscribe_state = subscribe(state, (value) => $state = value);
  const reportMousePosition = throttle(
    (position) => {
      socketConnection.send({ type: "mouse position", position });
    },
    50,
    { leading: true, trailing: true }
  );
  let showEmoji;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    $$rendered = `<div style="display: contents; --row-count:${escape(ROW_COUNT, true)}; --column-count:${escape(COLUMN_COUNT, true)};">${validate_component(Game, "Game").$$render($$result, { reportMousePosition }, {}, {
      overlays: () => {
        return `${validate_component(CursorOverlays, "CursorOverlays").$$render($$result, { mousePositions }, {}, {})} ${validate_component(EmojiOverlays, "EmojiOverlays").$$render(
          $$result,
          { showEmoji },
          {
            showEmoji: ($$value) => {
              showEmoji = $$value;
              $$settled = false;
            }
          },
          {}
        )}`;
      }
    })}</div> <pre>${escape($socketConnection.log.join("\n"))}

${escape(JSON.stringify($state, null, 2))}
</pre>`;
  } while (!$$settled);
  $$unsubscribe_socketConnection();
  $$unsubscribe_state();
  return $$rendered;
});

export { Page as default };
//# sourceMappingURL=_page.svelte-504e45cc.js.map
