import { c as create_ssr_component, a as subscribe, e as escape, v as validate_component, o as onDestroy, s as setContext, g as each, h as add_styles, f as add_attribute, i as getContext, b as spread, d as escape_object, j as compute_slots, k as createEventDispatcher, l as escape_attribute_value } from './ssr-35980408.js';
import { r as readable, w as writable } from './index2-60e1937a.js';
import { g as require_root, J as require_baseGetTag, p as requireIsObjectLike, c as requireIsObject, x as createMachine, H as interpret, y as assign, K as not, G as GameState, L as and, B as sharedGuards, I as isEqual, M as getUser, N as getCharacter, O as getPlayer, P as isActionEventOf, Q as BOARD_SUPPLY_CHAINS, R as CHARACTERS, E as isDefenderId, S as BOARD_ITEMS, T as objectEntries, D as getPlayerSide } from './xstate.esm-cb813247.js';
import { A as Actions$1, P as Paragraph, a as Polygon } from './Polygon-c521e3a7.js';
import { B as Button } from './Button-d4280ae9.js';
import { H as Heading } from './Heading-3f0b5004.js';
import { F as Face } from './Face-609c1abc.js';
import { i as isItemIdOfSide, a as isAttackItemId } from './items-ba2c7988.js';
import { I as Item } from './Item-aeaa28b7.js';
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
              initial: "Initial",
              states: {
                Initial: {
                  always: [
                    {
                      target: "Placing",
                      guard: "requiresPlacement",
                      reenter: false
                    },
                    {
                      target: "Moving",
                      reenter: false
                    }
                  ]
                },
                Placing: {
                  description: "The user sees all possible starting positions",
                  always: {
                    target: "Moving",
                    guard: "requiresMove",
                    reenter: false
                  },
                  on: {
                    "apply game event": {
                      guard: "userControlsPlayer isPlacementEvent",
                      actions: {
                        type: "forwardToServer",
                        params: {}
                      },
                      reenter: true
                    }
                  }
                },
                Moving: {
                  description: "The board displays possible squares to move to",
                  always: {
                    target: "Action",
                    guard: "requiresAction",
                    reenter: false
                  },
                  on: {
                    "apply game event": {
                      target: "Moving",
                      guard: "userControlsPlayer isMoveEvent",
                      actions: {
                        type: "forwardToServer",
                        params: {}
                      },
                      reenter: false
                    }
                  }
                },
                Action: {
                  description: "The user gets presented with a list of possible actions to perform",
                  always: {
                    target: "Moving",
                    guard: "requiresMove",
                    reenter: false
                  },
                  on: {
                    "apply game event": {
                      target: "Action",
                      guard: "userControlsPlayer isActionEvent",
                      actions: {
                        type: "forwardToServer",
                        params: {}
                      },
                      reenter: false
                    },
                    "cancel game event": {
                      target: "Action",
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
      return event.gameEvent.type === "action";
    },
    isPlacementEvent: ({ event: e }) => {
      const event = e;
      return event.gameEvent.type === "placement";
    },
    lastEventIsAction: ({ context }) => {
      const gameState = GameState.fromContext(context);
      return !!gameState.lastEvent && gameState.lastEvent.type === "action";
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
    "userControlsPlayer isPlacementEvent": and(["userControlsPlayer", "isPlacementEvent"]),
    userOnActiveSide: ({ context }) => getCurrentUser(context).side === GameState.fromContext(context).activeSide,
    userNotOnActiveSide: not("userOnActiveSide"),
    requiresPlacement: ({ context }) => GameState.fromContext(context).nextEventType === "placement",
    requiresAction: ({ context }) => GameState.fromContext(context).nextEventType === "action",
    requiresMove: ({ context }) => GameState.fromContext(context).nextEventType === "move",
    userIsDefender: () => false,
    isServerStopped: () => false,
    ...sharedGuards
  }
});
const createWebSocketConnection = ({
  gameId,
  userId,
  onMessage,
  debug
}) => {
  const webSocketConnection = writable({ status: "opening", log: [] });
  const logEvent = (message, consoleData) => {
    if (!debug)
      return;
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
const css$x = {
  code: ".cursor.svelte-7ubvy1.svelte-7ubvy1{height:1px;left:0;position:absolute;top:0;width:1px}.cursor.svelte-7ubvy1 svg.svelte-7ubvy1{display:block;height:1.5rem!important;left:0;max-width:none;position:absolute;top:0;translate:-15% -20%;width:1.5rem!important}.cursor.svelte-7ubvy1 .name.svelte-7ubvy1{background:rgba(0,0,0,.667);border-radius:var(--radius-sm);display:inline-block;font-size:var(--scale-000);left:1.5rem;max-width:7rem;overflow:hidden;padding:.25rem .5rem;position:absolute;text-overflow:ellipsis;top:.5rem;white-space:nowrap}",
  map: null
};
const Cursor = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { position } = $$props;
  let el;
  if ($$props.position === void 0 && $$bindings.position && position !== void 0)
    $$bindings.position(position);
  $$result.css.add(css$x);
  return `<div class="cursor svelte-7ubvy1"${add_attribute("this", el, 0)}><svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2c3e50" fill="white" stroke-linecap="round" stroke-linejoin="round" class="svelte-7ubvy1"><path d="M7.904 17.563a1.2 1.2 0 0 0 2.228 .308l2.09 -3.093l4.907 4.907a1.067 1.067 0 0 0 1.509 0l1.047 -1.047a1.067 1.067 0 0 0 0 -1.509l-4.907 -4.907l3.113 -2.09a1.2 1.2 0 0 0 -.309 -2.228l-13.582 -3.904l3.904 13.563z"></path></svg> <span class="name svelte-7ubvy1">${escape(position.name)}</span> </div>`;
});
const css$w = {
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
  $$result.css.add(css$w);
  userMousePositions = getMousePositions($users, mousePositions);
  $$unsubscribe_users();
  $$unsubscribe_user();
  return `<div class="cursor-overlays svelte-1n4ax7h">${each(userMousePositions, (position) => {
    return `${validate_component(Cursor, "Cursor").$$render($$result, { position }, {}, {})}`;
  })} </div>`;
});
const css$v = {
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
  $$result.css.add(css$v);
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
const css$u = {
  code: ".emojis.svelte-usst85{display:flex;gap:.25rem}.emoji.svelte-usst85{align-content:center;aspect-ratio:1;background:var(--color-bg-secondary);border:none;border-radius:var(--radius-sm);cursor:pointer;display:grid;flex-shrink:0;font-size:var(--scale-3);justify-content:center;opacity:.3;padding:0;place-content:center;width:2.5rem}.emoji.svelte-usst85:hover{opacity:1}",
  map: null
};
const EmojiPicker = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  getGameContext();
  const validEmojis = ["👋", "👍", "👏", "😃", "🧠", "🤔"];
  $$result.css.add(css$u);
  return `<div class="emojis svelte-usst85">${each(validEmojis, (emoji) => {
    return `<button class="emoji svelte-usst85">${escape(emoji)}</button>`;
  })} </div>`;
});
const css$t = {
  code: ".expandable.svelte-1682nhy.svelte-1682nhy{color:#000;isolation:isolate;position:relative;z-index:var(--layer-top)}.expandable.svelte-1682nhy .open-button.svelte-1682nhy{background:#fff;border-radius:var(--radius-full);padding:.25rem}.expandable.svelte-1682nhy .icon.svelte-1682nhy{align-content:center;display:grid;height:1.5rem;justify-content:center;place-content:center;width:1.5rem}.expandable.svelte-1682nhy .icon.svelte-1682nhy svg{display:block;height:100%;width:100%}.expandable.svelte-1682nhy .content.svelte-1682nhy{align-items:center;background:#fff;border-radius:var(--radius-sm);display:flex;gap:1rem;min-width:16rem;padding-bottom:.5rem;padding-top:.5rem;position:absolute;right:0;top:2rem}",
  map: null
};
const Expandable = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$t);
  return `<div class="${["expandable svelte-1682nhy", ""].join(" ").trim()}"><button class="unstyled icon open-button svelte-1682nhy">${slots.icon ? slots.icon({}) : ``}</button> ${``} </div>`;
});
const Undo_2 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<svg${spread(
    [
      { viewBox: "0 0 24 24" },
      { width: "1.2em" },
      { height: "1.2em" },
      escape_object($$props)
    ],
    {}
  )}><!-- HTML_TAG_START -->${`<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M9 14L4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5v0a5.5 5.5 0 0 1-5.5 5.5H11"/></g>`}<!-- HTML_TAG_END --></svg>`;
});
const css$s = {
  code: "button.svelte-1gfj9qz.svelte-1gfj9qz{text-wrap:nowrap;align-items:center;display:flex;gap:1rem;height:1.375rem;justify-content:space-between;padding-left:1rem;padding-right:1rem;width:100%}button.svelte-1gfj9qz.svelte-1gfj9qz:hover{background:rgba(213,217,227,.302)}button.svelte-1gfj9qz .icons.svelte-1gfj9qz{flex-shrink:0}button.svelte-1gfj9qz .icons.svelte-1gfj9qz svg{display:block}",
  map: null
};
const ExpandableButton = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$slots = compute_slots(slots);
  let { disabled = false } = $$props;
  if ($$props.disabled === void 0 && $$bindings.disabled && disabled !== void 0)
    $$bindings.disabled(disabled);
  $$result.css.add(css$s);
  return `<button ${disabled ? "disabled" : ""} class="unstyled svelte-1gfj9qz">${slots.default ? slots.default({}) : ``} ${$$slots.icon ? `<div class="icons svelte-1gfj9qz">${slots.icon ? slots.icon({}) : ``}</div>` : ``} </button>`;
});
const RollbackButton = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $isAdmin, $$unsubscribe_isAdmin;
  let $lastGameEvent, $$unsubscribe_lastGameEvent;
  const { machine: machine2 } = getGameContext();
  const isAdmin = useSelector(machine2.service, ({ context }) => getCurrentUser(context).isAdmin);
  $$unsubscribe_isAdmin = subscribe(isAdmin, (value) => $isAdmin = value);
  const lastGameEvent = useSelector(machine2.service, ({ context }) => {
    const gameState = GameState.fromContext(context);
    return gameState.lastEvent;
  });
  $$unsubscribe_lastGameEvent = subscribe(lastGameEvent, (value) => $lastGameEvent = value);
  $$unsubscribe_isAdmin();
  $$unsubscribe_lastGameEvent();
  return `${$isAdmin ? `${validate_component(ExpandableButton, "ExpandableButton").$$render($$result, { disabled: !$lastGameEvent }, {}, {
    icon: () => {
      return `${validate_component(Undo_2, "BackIcon").$$render($$result, { slot: "icon" }, {}, {})}`;
    },
    default: () => {
      return `Aktion zurücksetzen`;
    }
  })}` : ``}`;
});
const css$r = {
  code: ".header.svelte-10gyhrd{align-items:center;background:linear-gradient(180deg,rgba(43,52,72,0),rgba(43,52,72,.663));display:flex;height:3rem;justify-content:space-between;padding-left:3rem;padding-right:1rem}.title.svelte-10gyhrd{font:var(--display-h2);font-size:var(--scale-4);text-transform:uppercase}.actions.svelte-10gyhrd{display:flex;gap:1rem}",
  map: null
};
const Header = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$r);
  return `<div class="header svelte-10gyhrd"><div class="title svelte-10gyhrd" data-svelte-h="svelte-xbe4by">The hidden threat</div> ${validate_component(EmojiPicker, "EmojiPicker").$$render($$result, {}, {}, {})} <div class="actions svelte-10gyhrd">${validate_component(Expandable, "Expandable").$$render($$result, {}, {}, {
    icon: () => {
      return `${validate_component(Shield_question, "HelpIcon").$$render($$result, { slot: "icon" }, {}, {})}`;
    }
  })} ${validate_component(Expandable, "Expandable").$$render($$result, {}, {}, {
    icon: () => {
      return `${validate_component(Volume_2, "AudioIcon").$$render($$result, { slot: "icon" }, {}, {})}`;
    }
  })} ${validate_component(Expandable, "Expandable").$$render($$result, {}, {}, {
    icon: () => {
      return `${validate_component(Settings, "SettingsIcon").$$render($$result, { slot: "icon" }, {}, {})}`;
    },
    default: () => {
      return `${validate_component(RollbackButton, "RollbackButton").$$render($$result, {}, {}, {})}`;
    }
  })}</div> </div>`;
});
const css$q = {
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
  $$result.css.add(css$q);
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
const css$p = {
  code: ".dialog-wrapper.svelte-1j4618i{align-content:center;display:grid;justify-content:center;place-content:center;position:fixed}.backdrop.svelte-1j4618i,.dialog-wrapper.svelte-1j4618i{bottom:0;left:0;right:0;top:0}.backdrop.svelte-1j4618i{background-color:var(--color-bg);opacity:.85;position:absolute}.dialog.svelte-1j4618i{background-color:var(--color-bg-secondary);border:none;border-radius:var(--radius-md);box-shadow:0 0 30px 0 var(--color-shadow-secondary);margin:auto;padding:1.5rem;position:relative}.close-button.svelte-1j4618i svg{display:block}",
  map: null
};
const Dialog = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { title = "" } = $$props;
  createEventDispatcher();
  if ($$props.title === void 0 && $$bindings.title && title !== void 0)
    $$bindings.title(title);
  $$result.css.add(css$p);
  return `<div class="dialog-wrapper svelte-1j4618i">  <div class="backdrop svelte-1j4618i"></div> <div class="dialog svelte-1j4618i">${validate_component(Heading, "Heading").$$render($$result, { separator: true }, {}, {
    info: () => {
      return `<button class="unstyled close-button svelte-1j4618i" slot="info">${validate_component(Close, "CloseIcon").$$render($$result, {}, {}, {})}</button>`;
    },
    default: () => {
      return `${title ? `${escape(title)}` : ``}`;
    }
  })} ${slots.default ? slots.default({}) : ``}</div></div> `;
});
const FACES = [
  { id: 0 },
  { id: 1 },
  { id: 2 },
  { id: 3 },
  { id: 4 },
  { id: 5 },
  { id: 6 },
  { id: 7 },
  { id: 8 }
];
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
const css$o = {
  code: "svg.svelte-qbd276{width:var(--chevron-icon-width, 20px);height:var(--chevron-icon-width, 20px);color:var(--chevron-icon-colour, currentColor)}",
  map: null
};
const ChevronIcon = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$o);
  return `<svg width="100%" height="100%" viewBox="0 0 20 20" focusable="false" aria-hidden="true" class="svelte-qbd276"><path fill="currentColor" d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747
          3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0
          1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502
          0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0
          0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"></path></svg>`;
});
const css$n = {
  code: "svg.svelte-whdbu1{width:var(--clear-icon-width, 20px);height:var(--clear-icon-width, 20px);color:var(--clear-icon-color, currentColor)}",
  map: null
};
const ClearIcon = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$n);
  return `<svg width="100%" height="100%" viewBox="-2 -2 50 50" focusable="false" aria-hidden="true" role="presentation" class="svelte-whdbu1"><path fill="currentColor" d="M34.923,37.251L24,26.328L13.077,37.251L9.436,33.61l10.923-10.923L9.436,11.765l3.641-3.641L24,19.047L34.923,8.124
    l3.641,3.641L27.641,22.688L38.564,33.61L34.923,37.251z"></path></svg>`;
});
const css$m = {
  code: ".loading.svelte-1p3nqvd{width:var(--spinner-width, 20px);height:var(--spinner-height, 20px);color:var(--spinner-color, var(--icons-color));animation:svelte-1p3nqvd-rotate 0.75s linear infinite;transform-origin:center center;transform:none}.circle_path.svelte-1p3nqvd{stroke-dasharray:90;stroke-linecap:round}@keyframes svelte-1p3nqvd-rotate{100%{transform:rotate(360deg)}}",
  map: null
};
const LoadingIcon = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$m);
  return `<svg class="loading svelte-1p3nqvd" viewBox="25 25 50 50"><circle class="circle_path svelte-1p3nqvd" cx="50" cy="50" r="20" fill="none" stroke="currentColor" stroke-width="5" stroke-miterlimit="10"></circle></svg>`;
});
const css$l = {
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
  $$result.css.add(css$l);
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
const css$k = {
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
  $$result.css.add(css$k);
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
const css$j = {
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
  $$result.css.add(css$j);
  userId = $player.userId;
  faceId = $player.faceId;
  character = $player.character;
  userItems = $usersOnThisSide.map((user) => ({ value: user.id, label: user.name }));
  $$unsubscribe_usersOnThisSide();
  $$unsubscribe_player();
  $$unsubscribe_canUpdate();
  return `${validate_component(Dialog, "Dialog").$$render($$result, { title: "Rolle bestimmen" }, {}, {
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
const css$i = {
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
  $$result.css.add(css$i);
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
const css$h = {
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
  $$result.css.add(css$h);
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
const css$g = {
  code: ".actions.svelte-wm8yo3.svelte-wm8yo3{left:calc(11.11111%*(var(--x)));position:absolute;top:calc(12.5%*(var(--y)))}.actions.svelte-wm8yo3 ul.svelte-wm8yo3{background:var(--color-bg);list-style-type:none;padding:1rem;position:absolute}.actions.svelte-wm8yo3 ul.svelte-wm8yo3:not(.on-left){left:calc(var(--board-square-size) + .3rem)}.actions.svelte-wm8yo3 ul.on-left.svelte-wm8yo3{right:.3rem}.actions.svelte-wm8yo3 ul.svelte-wm8yo3:not(.on-top){top:.3rem}.actions.svelte-wm8yo3 ul.on-top.svelte-wm8yo3{bottom:calc(0px - var(--board-square-size) + .3rem)}",
  map: null
};
const Actions = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $canPerformAction, $$unsubscribe_canPerformAction;
  let $activePlayerPosition, $$unsubscribe_activePlayerPosition;
  const { machine: machine2 } = getGameContext();
  const canPerformAction = useSelector(machine2.service, (state) => state.matches("Playing.Gameloop.Playing.Action"));
  $$unsubscribe_canPerformAction = subscribe(canPerformAction, (value) => $canPerformAction = value);
  const activePlayerPosition = useSelector(machine2.service, ({ context }) => {
    const gameState = GameState.fromContext(context);
    return gameState.activePlayerPosition;
  });
  $$unsubscribe_activePlayerPosition = subscribe(activePlayerPosition, (value) => $activePlayerPosition = value);
  $$result.css.add(css$g);
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
const css$f = {
  code: "svg.svelte-1fqtuea{grid-column:1/-1;grid-row:1/-1}",
  map: null
};
const Backdrop = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$f);
  return `<svg viewBox="0 0 804 715" fill="none" xmlns="http://www.w3.org/2000/svg" class="svelte-1fqtuea"><g clip-path="url(#a1)"><path d="M804 0H0v715h804V0Z" fill="#1B253A"></path><mask id="b" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="0" y="0" width="804" height="715"><path d="M804 0H0v715h804V0Z" fill="#fff"></path></mask><g mask="url(#b)"><path d="M291 651 78 822l264 19-51-190Z" fill="#747D4A"></path><path d="m52 154 99 41 13-295L52 154Z" fill="#257A86"></path><path d="m-163 10 113 211L6 28l-169-18Z" fill="#247771"></path><path d="m6 28-56 193 102-67L6 28Z" fill="#297877"></path><path d="m52 154-102 67 201-26-99-41Z" fill="#227776"></path><path d="m-50 221 66 228 135-254-201 26Z" fill="#2C7871"></path><path d="m-50 221-28 271 94-43-66-228Z" fill="#317865"></path><path d="m-78 492 48 148 46-191-94 43Z" fill="#37785E"></path><path d="m6 28 46 126 112-254L6 28Z" fill="#2F7B85"></path><path d="m-30 640-112 90 220 92-108-182Z" fill="#4A7A50"></path><path d="M-163 10 6 28l158-128-327 110Z" fill="#2D7A7E"></path><path d="m-221-59 58 69 327-110-385 41Z" fill="#246E4C"></path><path d="m708 634 141 73 105-178-246 105Z" fill="#934038"></path><path d="m16 449-46 191 265-149-219-42Z" fill="#37785E"></path><path d="M235 491-30 640l321 11-56-160Z" fill="#436D56"></path><path d="M151 195 16 449l219 42-84-296Z" fill="#2D726B"></path><path d="M-30 640 78 822l213-171-321-11Z" fill="#4C764F"></path><path d="m164-100-13 295L300 62 164-100Z" fill="#2B7B8D"></path><path d="m355 309 124 182 16-252-140 70Z" fill="#585E60"></path><path d="m300 62 55 247 140-70L300 62Z" fill="#3C597F"></path><path d="M300 62 151 195l204 114-55-247Z" fill="#336882"></path><path d="m151 195 84 296 120-182-204-114Z" fill="#3C6671"></path><path d="m235 491 56 160 188-160H235Z" fill="#67715B"></path><path d="M355 309 235 491h244L355 309Z" fill="#56655E"></path><path d="m300 62 195 177 26-157-221-20Z" fill="#3A5584"></path><path d="M164-100 300 62l221 20-357-182Z" fill="#34638D"></path><path d="m495 239 178 250 20-306-198 56Z" fill="#856865"></path><path d="m291 651 51 190 210-58-261-132Z" fill="#8B674A"></path><path d="M479 491 291 651l261 132-73-292Z" fill="#8F6E4D"></path><path d="m708 634-44 143 54 34-10-177Z" fill="#853F33"></path><path d="M849 707 718 811l150 94-19-198Z" fill="#8E3D35"></path><path d="m683-20 10 203 53-107-63-96Z" fill="#725981"></path><path d="m495 239-16 252 194-2-178-250Z" fill="#886D5F"></path><path d="M683-20 521 82l172 101-10-203Z" fill="#554C76"></path><path d="M829 378 673 489l281 40-125-151Z" fill="#945050"></path><path d="M164-100 521 82 683-20l-519-80Z" fill="#3F5684"></path><path d="m521 82-26 157 198-56L521 82Z" fill="#524F7F"></path><path d="m552 783 112-6 44-143-156 149Z" fill="#914134"></path><path d="m479 491 73 292 156-149-229-143Z" fill="#9A5C4E"></path><path d="m673 489-194 2 229 143-35-145Z" fill="#9A6556"></path><path d="m693 183 136 195 41-242-177 47Z" fill="#8A5F6E"></path><path d="m693 183-20 306 156-111-136-195Z" fill="#936360"></path><path d="m708 634 10 177 131-104-141-73Z" fill="#994B3A"></path><path d="m746 76 124 60 243-236L746 76Z" fill="#765076"></path><path d="m683-20 63 96 367-176-430 80Z" fill="#644B7B"></path><path d="m746 76-53 107 177-47-124-60Z" fill="#7A5A6F"></path><path d="m673 489 35 145 246-105-281-40Z" fill="#924E4C"></path></g><mask id="c" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="0" y="0" width="804" height="715"><path d="M804 0H0v715h804V0Z" fill="#fff"></path></mask><g opacity=".1" stroke="#272D2E" stroke-width="1.2" stroke-miterlimit="10" mask="url(#c)"><path d="m1145 285-1-1-3 1-2 1-2 2-5 6h-4a122 122 0 0 1-8 0h-9l-3-6-3-4 3-3-1-2v-1l-1-1c-3-1-9-6-9-7h-4l-5-2h-6c-1 0-4 0-5-3l-1-3v-2l-3-3-1-3v-1c1-2 2-4 0-5h-1c-3-1-4-2-4-4v-4l-2-3-1-2v-4l-1-1h-1v-3l1-1-1-1h-2l-1-1v-4l-2-1-3-2c0-2-1-3-2-3h-7a59 59 0 0 0-15-7 253 253 0 0 0-26 8l-5 5v5h1l3 1 1 2v7h1l-1 2-4 4-8 22h-1l1 2 1 1 1 2-3 2-5 3-3 2-4 1-1-1-8-1-2 4-1 1-1 4-4 9-2 3-2 3 1 4 5 3h14l2-1 3-2c2-2 3 0 5 1a22 22 0 0 0 6 4c3 1 5 2 6 4l2 3 2 3-1 2c-3 2-5 3-8 2l-2-1c-1-1-1-2-2-1l-7 2h-4l-2 5h-5c0 1-4 9-6 10l-7 5v1h-8v1c0 2 0 4-2 6l-5 1-8 1-5-1c-1-1-5 0-7 1l-3 5 5 10s-8 5-9 8l-5 6-3 2-7 4-17 2a312 312 0 0 0-28 14l-2-2v-2h-17l-10-5-8-2h-8l-3 1h-6a608 608 0 0 0-12 0h-6l-6-1-2 1h-2l-1 1v1h-1l-2-2-7-10v-3l-2-3-1-2 1-2h-8c-2 0-3-1-5-3-3-2-6-4-11-5h-20c-3 0-4-1-5-4l-1-2v-2l2-5-1-3 1-5-1-2-1-1c-2-4-4-10-6-11l-4-3-1 1-1-1-1-2-2-1h-5l-3-2-4-3-1-1-2-3-5 3h-1l-2 2c0 1-1 2-3 1l-6-1-6-1-5-1-6 23c1 1 3 3 2 4v1l-1 1h-6v-2l-3 1-4 2-6 3h-5c-1-1-1-1-2 1l-1 2v1l1 1 3 2 2 2v6l3 6 1 2 1 2c0 1 1 2-1 3l-2 1v2l1 1-1 1h-1l-1 2v5h-1l2 3v2h-4l-1 1-5 3-7 5-3 2-5 4c-1 2-2 2-3 1l-2-1c-2 0-5 1-7 4l-2 3-4 4-5 1-1-5-1 2-5 1h-1l-1 1-1 1-2 2-4 2-2 1-1 1 1 2v4l-1 1h-3l2 4 1 4 1 2 4 2h2c3 1 4 1 5 3v2l1 2 1 1 1 1v6l-2 2v1l-2-1h-2l-1 1v1l1 1v2h-10l-3 2c-1 1-2 1-2 3l-2 4h-1l-2 1h-1l2 2c2 3 4 4 7 4l2 1h3l2 2-1 4-1 2-1 1-1 2-1 1 1 2 1 3 1 1v10c-1 2-1 3 1 4h2l3 1 5 3v2h6c1 2 3 2 3 2l1 2 2 1 2-1 3-1 4-3 4-3 1-2-1-2c1-2 2-3 5-3l1-1 2-1 6 1 2 1 1 1h2l2-1h2l1 1v1l1 3 2-1 1-1 1 1-1 3 1 2 2 4 1 1 1 1 1 3v5c0 1 0 2 2 2h5l2 1c2 0 3 0 3 2v1c1 2 1 3 3 3l1-1h2l1 2 3 3h1l1 1 1-1v-2l2-1h7l1 2v1l-1 1 1 1h1l3 1 3 2 4 2 1 2 2 3h2l2-1h4v2l1 3 2 1 2 2h1l3-1 1 3v1h3l2-1 3 4 1 1h2v1l1 1h1l1-2 1-1h1l7 3h9v2l-1 4 3-2 2 2 2 1 3-1 2-2 2-2h13l3-1h5l1 1 3 2 1 2 1 1v6h1l1 1-1 1h13l2-1v-1l2-2 1-1 3-1h2l4-4 3-2 3-2c1-2 2-2 3-1l2 1 5 1 1 1 3 1 3 2 1-1v-4l-2-1-3-3-1-2v-1l-1-2-3-3-2-1-3 1-3 1-5 1-3-1-2-1-1 1-1 2-1 1-1 1-2 1-2 2-4 1-2 1-2 1-1 1-2 2-1 3h-4v-1l2 1 1-1 2-2 2-2 1-1 2-2h2l4-1 2-2 2-2 1-2 1-1 2-1 2 1h8l3-1 2-1 1-1 2 2 3 3 1 2h1l1 3 2 3 2 1 3-3 1-1v1l3 2 2 5v3l-1 1h1l1-1 1-1 2 1 1 6a101 101 0 0 0 0 8l-1 2v5l-1 1-2 1h-1l-1 1-1 1-1 1c-2 1-2 1-2 3l-1 2-1 1-1 1v2h2l1 1v2l-2 2v1h4l2-2 3-1h5v1l-1 3c-1 1 0 2 1 3v4h-1l2 1 2-1 2 1h1l-3 9 1-1c2 0 3 1 4 3l3 3c2 4 3 5 4 4l4-1 3-2 2 1v1l1 2 2 1 2-1-1-6v-6h4v1l3-4 3 1 2 2 3 1 1-1v-1l1-3 2 2 1-3 1 1v1l2 2 1-2v-1l1-1v1l-1 1h2l3-3 4-2 2-1h2l2 2 3 3 2-1 4-1 2 1h1l1 1-1 1-1 2-1 2v2c2 2 3 3 5 3h1l1 1c2 0 2-1 3-4 1-2 3-1 4-2 2-1 2 0 4 1 2 2 4 1 7 0 2 0 3 3 2 4-1 2 0 5 1 8s5 3 7 2 1-3-1-4l-2-4c0-1 3-4 4-3l10-2c4-1 2-3 3-3h5c2-1 2-4 5-4s3-1 3-6c1-6 2-4 5-1 2 3 3 4 4 2l2-2 4-1 6-1 6-2c5-1 6-2 7-6l1-3h5l2-3 4-2 1-2-4-1c-1-1 1-2 2-3h6c3 0 0-2 0-3 0-2 1-3 2-3v-4l2-1h3l1-5-2-2v-2l3-1-1-2-3-2 1-4c2-1 2 2 4 2l5-7 3-12c2-3 4-1 5-2 2-2-1-3-1-5s2-2 2-3l-5-2c-1-1 2-1 5-1 2 0 2-1 2-3 0-1-1-3-2-2s-4 3-6 2c-3 0 0-1 2-2 2 0 3-2 3-4 1-2-2-2-3-3l-6-2c-4 0-2 3-4 2-3 0-3-3-1-4l4-1 3-3 4-2c1-1-1-5-3-6-1-2-4-2-7-4-3-1-5-3-4-4l3 2 4-1 6 1c3 0 0 0 0-3l-5-5-6-3c-2-1-1-5-2-6l-5-5c-1-2-1-10-9-12-7-2-8-7-9-9-1-1 0-5 1-8 1-2 3-2 5-3 2 0 1-2 0-4s1-3 4-3 3-3 7-5 8-2 11-1c2 0 2-6 2-9 1-4-3-3-8-3s-8 0-11-2c-4-2-6-3-10 5-4 7-10 4-11 2-2-3-2-7-5-7s-4-1-9-4c-5-4-4-14-1-13 4 0 11-1 11-3l1-9c1-2 9-5 9-8 1-3 1-11 10-10s4 12 3 14v7c2 1 3 2 3 5 1 4-4 2-5 3-2 2 0 4 3 4 2 0 4-1 7-7s10-9 14-10c3 0 4-1 8 1v-1l3-3 1-3v-3l1-1 2-4 3-2 1-1 3-3a98 98 0 0 0 1-6l1-5 3-2 2 4 8-1 1-4-3-4 6-2 2-4 6-2-3-9 5 1 2 2 4 3s1-1 2 1h1c2-1 3-2 3-4 0-1 0-4 2-6l2-2v-2l1-5c-1-3 1-4 2-4l2-1 3-5v-1l3-1h1l2-6 3-2v-2l2-5 1-1 2-1v-8h1l3-2 4-4 2-3 2-3-2-2Z"></path><path d="M559 469h-2l-7 1c-2 0-3 0-3 2l-3 4-2 2-1-1v-1l-3 5 3 4 2 2-1 3-1 1 2 1v1l-6 8-1 2c1 0 2 3 0 5l-5 1-3-1-3 1 1 1 3 5 1 4-5 1-3 4-1 2h1v1c1 0 1 0 0 0l-4 2 1 1 1 1-1 5-1 1-1 1c-1 1-1 2-3 2l-1-2-1-1-4 1-4 2-3 1v1l3 3-1 1h-5l-4 1-3 1-4 4c-1 1 0 2 1 3l1 1v6h-10l-3-1-2-1-3 2-2 2h-3a8 8 0 0 1-3 0l-5-1h-10l2 5c0 2 1 4 4 5h9-1v10l3 2 4 2-1 2-2 5h-2v-1l-2 1c-2 0-4 2-5 3l-3 2h-1v12l11-1 6-1 6 1 9-2c3-1 10-1 13 2l5 4c4 2 4 9 5 11s7 5 10 2l4-1a10 10 0 0 1 4-2l1-2 1-2h3l2 1 3 1 2-1c1-1 2-2 3-1l3-1h1l1 1h4v-4l-3-8v-4h-3c-1-1-4-2-3-3l1-8h-5l-2-1c-1-3-1-9 4-12 4-3 6-4 7-3h1v1c1 1 1 2 3 1l3-1 5-1c3-1 3-2 5-5a423 423 0 0 1 9-13c1-3 2-6 5-8l4-3v-2l2-2 3-3 2-4h1v-6l-2-2h1l-3-1-1-1-3-3h-5l-1-1v-1l-4-3h-3l-3-1-1-4v-4l1-2c0-1 1-2-1-4l-1-1-1-3v-3l1-2 1-2 1-1c1-1 2-2 1-4l-2-1-2-1-3-1c-2 0-5-1-7-4l-1-3h3v-1l2-3 2-3 4-2h-3ZM339 618l4 2h1l1-4-1-10c-1-6-2-5-4-6s-2 2-3 3 0 4 1 6v5h-1l2 3v1Z"></path><path d="m382 645-25-3-8-18v-1l-4-1v-1h-3l-3-3a75 75 0 0 0-4-6l-2-5-2-3-2-7-1-4-2-2-3-4-2-2-4-3-3-2-1-3a17 17 0 0 0-5 1l-2-5-10-2-6 1c-5 0-10 1-12-1-1-2-20-19-30-25l-25-11h-2l-3 2-19 5 4 5 5 8v1c-1 1-3 4-5 4l-3 1c-2-1-3-1-5 2l-1 2c-1 2-2 4-5 4l-15-3-1 8c-1 4-2 5-1 6l6 3 8 11c2 4 3 9 7 12 5 4 5 8 6 11 0 4 4 5 10 8 5 4 8 12 9 23 1 10 8 16 13 18 4 3 7 6 10 13 3 8 6 12 9 15 4 3 3 5 5 8l5 6 2-5h1l1 1 1 1h12l7-3 8-1 4 2 3 2c1-1 3-4 4-9 0-5 16-8 20-8l24-3 30-12 6-21-1-7ZM31 248l-1-1 1-2 2-2v-3l-1-1-1 1h-3l-1 1-4 1 1 1c5 2 0 5-2 6l-16-1 3 2h7l3 1h7l2-1 2-1h1v-1Z"></path><path d="m55 235-2-1-1-1 1-1v-1l1-1-1-1h-1l-2-3-1-2-5-2h-1l-2-2v-1l-2 2h-3c-1 0-4 0-5-2h-2l-1 1h-6c-3-1-4 0-8 3l-4 2-2 2c1 3 6 10 8 11l6 3a22 22 0 0 0 6-1l3-1h2v4l-1 2-1 1v5h7l2-2h2l1-1 1-1v-1l1 1 1 1h1v-1h-1v-5l1-1 1-1v-1l1-1 1-1 1-1 1-1h4-1Zm1346-451c-2-5-5-4-4-7 2-4 1-8-2-10-3-1-8-10-6-13 3-3 7-6 5-11s-5-3-5-8c0-4-1-6-5-7l-15-4c-2-1-9 0-10 1 0 1-4-1-11 8-6 8-7 0-13-4-5-4-14-1-18-2-4 0-11 0-21-2l-18-1c-5 0-9-3-19-6s-15-2-25-3c-10-2-30 7-38 8s-18 1-15 3 4 7 7 12c3 6 8 2 16 14s-7 11-11 8c-3-3-2-5-6-5-3 0-9-1-11-6s2-5 4-10c1-5-8-6-14-6-5 0-1 7-1 14s-6 5-10 6c-3 0-9 5-13 4s-6-2-10 3c-4 4-9 6-19 8s-15 0-20-15-22-13-28-13c-7 0-6 3-10 3l-12 8c-5 3-14 9-19 10s-4-4-5-7c-1-4-12-7-14-6-1 2-5 9-7 7-1-1 2-4-2-6-5-2-5 4-6 3 0-2-6-4-8-4-2-1-2-5 2-6 5-1 1-6-4-9-5-2-17-1-22 2-5 4-9 7-10 6-1-2 4-3 0-3l-31 2h-16c-6-1-7 4 2 5 8 1 1 6-5 7-6 2 0 9 1 11 2 2 3-1 5-1 1 1-1 4 1 5 3 1 1 2 6 5 5 2 3 5 1 7s-3 1-5-2c-3-3-7 2-8 3-1 2-3 4-11 4s-11 1-11 6-4 4-9 4c-4 0-9-2-12-5-4-3-5-5-6-4s2 4 3 8c1 5 1 7 5 13 3 7 1 11-4 11-4 1-3 0-7-3-5-2-9-8-14-10-6-2-10-2-15-5s-7-7 0-5 8-2 7-6-4-5-7-7c-4-1-5-5-11-13-6-7-18-8-24-7-6 0 0 5-3 5-3-1-3-3-16-5-14-2-9 10-3 16s2 7 0 7-4-2-8 1c-3 4-13 5-25 5-11 0-8-6-6-11 1-5-10-1-13 0-2 1-11-1-16 2-5 2-14 12-14 7-1-6-6-2-6-1s-2 3-6 3c-5 1-4 0-6-1s-4-1-3-4c1-2-1-4-2-3s1 6-3 3-8 0-8 1v7c-1 5 4 3 6 1 2-3 4-4 5-3l-1 5-6 8c-3 4-4 5-12 10-7 4-7 0-6-3 0-2 0-8 2-9s4-2 5-5c2-3-1-6 0-9 1-4 3-6 2-8s1-4 3-7l3-7v-7c0-3 4-6 4-9l-2-12c-1-2-4-1-4-2-1-1 1-3 1-5 0-1-3-6-7-8-3-3-4-6-7-7-3 0 1 5 0 6s-5-3-6-6c-2-2-4-4-8-5-5-2-8-1-9-5 0-3-5 0-10 4s-7 4-11 4c-4 1-4 1-3 3 2 2 2 6 0 10-1 4-3 3-7-2-3-6-2-17-7-18-6 0-11 5-13 5-3 0-1-2 0-6 2-4 1-7-1-9s-5-2-10-3c-4-1-7-1-11 2-5 4-2 14-4 18s1 6 1 8c1 3-4 3 4 9 8 7-1 12-4 12-2 1-4 2-4 5 1 3 2 4 0 4l-4 5-4 4c-1 0-1 5-2 4l-2-2c0 1-3 4-3 2v-5c-1-3-6-1-12 1s-11 4-11 7 1 5-2 9c-3 3-19 10-19 13l-4 10c-1 3-3 9-3 14s3 6 5 7c1 1-4 8 4 9 7 0 2 6 1 6l-13 6c-3 0-6 3-10 4l-14 4c-8 3-5 8-2 11 2 3 6 6 7 11 1 4 4 8 10 7 6 0 5 0 10 7s1 10-3 10l-8-5c-2-2-3-4-5-4s-5-1-8-4c-4-3-12-1-14-1-1 1-7 7 1 9 9 2 3 10-3 6-6-3-9-2-10 1-2 2 2 5 9 11s-4 7-5 6c-2-1-6-9-7-10l-3-7c1-3-1-4-1-6 1-3-2-2-2-4 1-3-1-3-4-7-2-3-4-2-2 2 2 3 3 8 3 12 0 5-4 6-6 9-1 3 2 3 0 10-1 7-8 2-9 0v-7c1-2-1-14-2-18-1-3-3-3-6-5s-7-2-10-1h-12c-3-1-3 2-3 5l2 13c2 8-1 17-6 24-4 7 2 13 5 15s1 6 3 9 0 4 1 9 3 4 9 5c5 1 4 1 4 5 1 3 5 4 11 7 5 3 3 11 1 13-3 1-7-2-9-4l-7-7-11-4-9-3-6-6c-4-2-12-2-21-2l-11 1-1 1c-2-4-6-5-10-8l-6-5-2 1c-2 2-3 4 0 8s6 5 8 6l5 2c1 0 5-1 5-3v2l2 7c2 3 6 4 7 7s-1 4-2 6c0 2-3 0-5 0l1 4c1 2-1 5-4 5s-1-7-2-11c0-4-4-2-8 1s-7 7-10 7-10 0-13 2-5 7-7 7c-3 0-3-2-3-3l-1-5c-1-2-4-3-3-4 2-1 5-3 4-4l-7 2c-4 2-4 4-6 5s-1 4-7 5-7 3-9 5l-6 7c-2 2-3 5-4 3-1-1-3 0-2 1 2 2 3 4-1 4-5 0-6 1-5 3l-2 11c-2 3-6 2-9 2-2 0-5-1-7-4l-5-6c-1-1 1-2 2-4 0-2 1-2 2-2l7-2c2-1-2-4-4-6-2-3-3-2-4-5s-2-4-7-3h-12c-6-2-3 2 1 4s5 7 4 14c0 7 0 9 4 11s3 3 4 10c2 7-4 6-7 5l-12-2c-4 0-7 7-12 13-5 5-4 8 0 15 5 7-2 11-5 11s-2-3-4-5l-9-3-6-4c-2-1-4-1-5 1-1 1 0 3-2 5-1 1 0 3 2 5s3 3 7 4c4 2 8 0 6 6-1 6-11 3-15-1-5-4-10-4-12-6-2-3 0-7-2-9-1-2-3-6-2-13s-9-9-11-10c-3-2-2-5-2-7 1-2 4-2 5 0s1 3 4 3 4-1 7 1l7 3 15 2c9 1 14-2 21-11 8-8 2-16 1-18l-6-6c-2-1-8-3-21-12-12-9-27-14-30-14L88-4c-2 1-3-1-7-3-4-1-4-3-7-4-3 0-6 2-7 1l-2-1-1 2-1 4v3c-1 1-4-2-5-2v-1 2l-2 4c-2 0-3 2-4 3l-1 1-1 2-1 2V8l-1 1-1 2v3l-1 2c-1 2-1 2 1 4l1 4 3 4 5 9-6 13a734 734 0 0 1 6 24l-2 4c-1 3 0 5 1 7v2l1 2 1 3 1 1 1 4 1 2v1c1 1 2 2 0 4l-1 1c-2 2-2 2-1 4l3 3c2 1 5 4 6 7 2 5 1 7-10 21a248 248 0 0 1-17 21l5-1c2 0 2-3 5-2l13-2c2 1 3 0 5-2h2c1 1-1 3-1 5-1 1 1 3 2 2s1-3 7-1c5 3-1 4-3 6l-5 1c-2 1-4 1-4 3l-2 3a60 60 0 0 1 0 4c1 1 0 3-2 5h-1l-1 6v5l1 2 1 3v1l-1 1-2 1-1 1 1 1v1h2v2c2 0 2 3 1 3v5l2-1h1l-1 1v2l1 2v4l1 1h1l2 1v1h4l1 1v2h2c2-1 4-2 5-1h1l3 3v8l-1 1v1l3 1 1 1-1 1v1l1 3c2 0 3 1 3 2l2 3h2l2 1 2 2h1l4 2v1c0 1 0 2-2 3v5l3 2 3 3 6 7 1-1 1-1v-1l2 1h2l1-1h3l1 1c1 0 0 0 0 0h3l1-1v-4l1 1 4 1 2-1v-1h3l1 1 2-1 3 4 2 3 1 1 1 1v1h-3l-1 1 2 2h1l-1 2 1 1-1 1h4l1 1h1l2-1 1 3v1l1-1h1v3l1 2v1h-1v2l1 1a11 11 0 0 1 1 2h1v-1h4l1 2h1l1-1 1 1v1l1-1h1l3-1c2 0 3-2 3-2h1v2l1 1v2h1l2 2 1 1 1-1v-2h1l1 2h3l1 1 1 2 2-2 2 1v1l1 1h1l1 1 1 1v1l1-1 1-1h1v1a7 7 0 0 0 1 3l1 2-1 1h-1l-1 1-2 1v1h3v3h-4l1 1v1h1v3l1 2h1v1l-1 2-1 3h-10c1 1-2 2-4 3v1h-1l-1 2 1 1 1 1h-1v1l1 2c1 1-3 3-6 6-4 3 1 3 1 4v5c0 1-1 5-5 5-5 1-2 3-1 6s2 3 6 5c4 3 6 3 13 5s6 5 12 9l5-4c4-2 17 6 19 6a324 324 0 0 0 6 0c2 0 2 0 5 3 2 3 4 3 4 3h1v2l4-1 5-1 2 1 2-1h2l1 2 2 1h2l1 1v1l-2 2v1l2 1h1l4 2 2 1h3l6 6 2 3h2l3-4 2-3 1-1 3-3-1-1c-3-6-8-7-12-11s-3-10-3-13c-1-3-6-7-7-14-2-6 4-9 7-11l10-6 7-6-2-1-2-2-4-2v-2l2-1h1v-1l-2-3-1-2-2-3-3-4-4-3h-4l-1 3-2-3v-6l-3-2-6-2 6-11-2-2-1-1v-8l3-2 2-5 3-4h1l9 11 4-4-4-9h-1 1l4-3c2 0 4-2 5-3v-4l-1-1h3l1-1c6-1 7-4 7-6 1-2 2-1 3-1v-1l-1-1 1-1h6l1 3v1h3l1 1v-1l1-1c0-2 0-3 2-3h1l1-1c2 1 3 2 3 4h7c3 0 4 1 4 2l1 1 3 2 3 3 2 1 1 1 1 2-1 2v1h1l2-1v-4l-1-1h-1l1-1h2l2 1c1 0 2 0 2 2l1 1 2 1 3 1h1c1 1 2 1 3-1l-1-2 1-2 3-1 1-1 1-1h1v1l1-1 2-1h1l3 1 2 2h1l1-1v-2l1-1h4v-1l2 1 2 1v1l1 1c2 2 4 2 5 2l1 1 4 2v1h1l2-1 2-2v-1l1-2h1c0 1 1 2 4 2l8-1 1-3 1-1v-2c1-1 2-2 0-3l-3-2h-1l-2-2-1-1h-6 1v-2l-1-1h-2l-1-1-1-1-1-1 1-1 3-1 2-2c2 0 3-1 3-2v-3l-1-3v-1c-1-2 1-3 2-4l2-2h8l1 1v-2l-1-2s-8 0-9-2l1-2 1-1 3-1h-6v-5h1l-1-2 2-1v-1h1l2-1 3 1h2l1-1h3v1l1 1 1-1v-1l3-1 3-1h-1l1-1h1l7-1 1-1 1-1 2-1h2a4 4 0 0 0 3 0l2-1 1 1v-2l-1-1h5v-2l1-1h3v-2l1 1 3 1 12-4 8-4h1v-3h3l1-2 1-1h2v-3l2 1 6 1 5 1h3l2-1h1l1 1 1 3 2 3 1 2 2 2v4l-2 2v1l-1 2v1h5l1 1 2-2v-1l3 1v-3h1l3 1 1 4-1 2h4-1v-3l1-1 2 1h1l4 1h3l2 2-1 1h-1l-2 2h-1v5c1-1 3-3 5-3 3-1 3 0 4 1v1l3-2c0-2 1-3 3-3l3-1 2-1 1-2v-1c0-1 0-2 2-3l4-1h1l1-1 3-2h1l6-3v1l-2 3-2 2-2 2h1v1l1 2 2 3 11 9 26 41a19 19 0 0 1 3-3v-4l3-2 2-1 1-1 1 2v4h3l1 3v1h12l3-3 8-2h1c1 0 2 0 4 5l3 5 1 1c0 1 1 3 3 3 3 1 5 3 5 4v1l2 2c4 2 6 2 9 2h1l2-3 1-2h1l1 3 2 2 4 3 1 1 1 1 2 2-2 1-2-1-2 1-2 4-1 2c-1 2-3 4-6 5h-2c-1 0-2 0-2 2v5h8l3-2 3-2v-1c1-1 0-1-1-2l-1-1 3-2h2l7-2 1-2 3-3 2 1h2l1-1 2-3 2-3 1-1 2-2h1c1 2 1 2 4 2v-1l2 1c3 2 6 2 9 2h1l3-1 2-1 1 2v2c0 2 1 4 3 4l8 1 3 1 3 1h8l4 1c1 1 1 1 2-1l1-2h1c2 0 4-3 4-5l1-3c1-1 1-2-1-3l-3-1-1-4h-1v-2l2-3a23 23 0 0 1 2-4l3-6v-2l1-4 2 1 8 5h2l4 1 5-1 6 1 5 1c2 0 3 0 4 2l-1 4v4l4 3 4 3 2 1 3 1 3 1c3 2 3 2 6 1l5-2c1-2 2-3 4-3l6 2c4 1 8 2 10 1l3 1 4 1 2 1c4 0 6 1 8 3l1 2c1 2 2 2 5 3h2l8 1h4c8 1 11 1 15-1l4-2 9-6 5-5c2-2 3-4 5-4l9 1 10 1 6-1h3v3l8 1h5l2-2 6-4 2-1-1-2-1-1v-3l9-22 3-3 2-2h-1v-5l-1-2-1-2-2-1h-2v-5l6-6 7-2 2-1a256 256 0 0 1 17-4c4 0 14 6 15 6h2l2 1h3c2 0 2 1 2 3l3 1 2 2v4l1 1h2l1 1v1l-1 1v1h2l1 1-1 2v3a54 54 0 0 1 3 5l1 3v1c0 2 1 2 3 3l1 1c2 1 1 3 1 5l-1 1 1 2 3 4 1 2v3c2 3 3 3 5 2h6l5 2h4s6 7 9 7l2 2v3l-2 3 2 4c2 1 3 5 4 6h16l3-1h1l5-5 2-3 1-1h5l2 3-1 3-3 4-4 3-3 2v8l-3 2-1 1-1 4-1 2-3 2c0 1 0 5-2 6l-1 1h-2v1h-1c0 2-1 4-3 5l-2 1c-1 1-3 1-2 4v5l-1 2h3c2 1 2 6 9 7 6 1 8-4 13-9 5-4 4-8 6-12l5-13 4-12 5-10c1-2-1-4 1-6l1-6 1-9 4-16c2-3 1-12 0-14l-2-11c0-2 0-11-4-15-4-3-4-2-3-13 1-10 2-11 7-4l12 17c6 8 3 10 3 20 0 9 1 7 6 14s4 7 1 12c-4 5-4 9 0 10s6 6 8 9 0 8 3 10c2 1 3-4 3-7 0-2 1-4 3-5s6 0 6 2c1 2 4 6 4 4l-1-7-4-4c-2 0-4-2-4-3 0-2 0-4-4-7s-3-3-5-7c-1-4-2-7-2-17 0-9-1-6 2-8 2-2 5 1 8 4 2 3 5 6 5 4s-2-3-3-5l-5-6-7-19c-4-14-17-28-22-31-5-4-1-5-1-8s-2-3-4-5c-2-1-2-4-1-3l4 4-5-8-5-5-3-4-1-4c-1-1-2 0-3-2-1-1-1-2-3-2s0 3-1 3c0 0-2-2-3-1l3 4 4 3 2 5c0 2 2 2 1 3-1 2-3 0-6 0s-1 3-4 3-13-6-15-8c-2-3-5-4-9-4-4 1-3 2-5 1-1-2-3-1-3 0v6c0 3-4 7-6 6-2 0 0-4 0-6 1-2-4 0-6 1-2 2-4 2-5-2l-2-8c-1-3-3-4-6-2-4 2-5 4-9 3-5-1-3-4 0-9l7-14c3-9 3-12 3-17s2-9 4-12c3-4 3-8 5-11s1-10 2-15c0-5 4-7 4-12 1-5 6-12 13-15 7-2 10-4 13-2 3 3 7 3 8 1s-4-5 2-5c6-1 22-4 21-9-2-6 4-5 9-5 6 0 13 1 17 3 4 3 8 7 12 7 4 1 6-6 6-8s8 0 10 0 4-5 1-7c-3-3-8-2-10-4s-1-7 0-11c0-5 2-5 2-23 0-19 6-16 9-17 2-1 7-6 10-5s6 5 7 3c1-3 1-5 4-3 3 3 0 9 0 12-1 2 2 3 6 3 4 1 3 4 5 7 3 2 4-3 5-7s2-15 4-18c1-3 4-4-1-16-5-11-1-12 5-13s8 5 6 5c-3 1-4 3-3 9 0 6 6 8 6 9 0 2-3 6 0 8 2 2 2 3 2 7s3 6 1 8c-1 2-6 5-7 11-2 6 3 11 1 14s-3 9-3 17l-1 19c-1 8-3 3-5 9s-3 5-7 6c-5 0 0 3 3 5s1 8 1 12c-1 5-5 11-3 18l4 14c1 6 18 28 19 32s8 8 9 13c0 5 8 8 11 10 3 3 4 10 4 14 1 4 3 11 6 11 4 1 3 8 4 8l3-6 5-8c2-3 2-14-2-18-4-3-1-9 0-12s10-3 8-5l-6-12c-3-5 1-14 7-16 7-2 6-6 4-10-3-5-9-11-10-16s0-12 4-10c4 1 4-2 4-6 1-5-3-5-4-9-1-5-4-1-7 0-2 1-2-3-4-7-1-4 1-6 1-10s-7-7-10-8c-4-1 2 8 0 8-3-1-5-5-8-11-3-7-1-25-3-30-2-4-3-6-2-10 1-5 3-2 7-1 3 1 3-2 3-6 1-5 3-7 6-6 3 0 2 10 6 11 3 1 2-7 1-14-1-8 8-7 13-9 6-2 8 1 10 3 2 3 9 6 13 7 4 0-1-6-2-15s4-18 5-25 6-13 10-23c4-11 11-14 19-14 7 0 11 0 12-4 0-4-1-8-3-10l-6-8c-2-4-4-3-9-4-5-2-7-5-7-10 0-4-3-2-6-2-2 0-3-3-2-6 0-3-7-6-7-4s-1 4-7 1c-7-4-5-7 4-8 8 0 6-9 5-13v-18c-1-3-4-7 0-11 4-3 4-6 4-10s11-8 15-1c5 6 5 7 12 5s4-2 13-2c8 0 5-6 3-10Z"></path><path d="M48 6V2l2-2v-4l-3-3-3-2-3-6-1 1c0 1-1 2-4 2h-4l-2 1-2 5-1 4c-2 3-3 8-3 10l-2 3-1 1-1 1-1 4h-1l-2-2c-1-1-2-3-4-3l-3 2-4 2H2c-1 0-3 1-4-3l-1-4c-1-2-1-5-3-6-3-1-3 0-5 3v1l-2 1 1 2 6 6c5 3 10 5 10 7l2 3 1 1v7c0 3 0 4 2 6v6l1 9a76 76 0 0 0 0 11l10 1c3 0 7 2 10 5 2 4-2 9-3 10l-9 12-7 8-3 5c-1 3-2 4-4 5s-5 5-5 10c0 4 2 4 2 5l1 7 1 16c0 7 3 6 6 6s3 2 4 3l6 1c2 2 4 7 6 7 1 0 4 0 8-4l6-2 7-9 10-12c12-15 12-17 10-21-1-3-3-5-6-7l-3-2c-1-3 0-4 2-6h1v-4l-1-1v-2a14 14 0 0 1-2-5c0-2 0-2-2-3l-1-2v-2l-1-7 3-4 1-2-8-22 7-13c0-1-3-6-6-8l-2-5-2-4-1-4 2-2v-3l1-3V6ZM16 406h-3c0 1 0 0 0 0v3l1 1 1 1v1h1l1 1 1 2v2h2v-1l1-1 1-1 1-1 1 1 1 1v-1l2-1v-2h1v-4h-2l-1-2-2-1v-2h-1l-1-1-1-1-2 2 1 1-3 3v-1 1Zm0-1Z"></path><path d="m40 400-1-1-1-2-2-3-1-1v-3l1-1 1-1 1-1-2-1v-2l1-1h1l-1-1h-2l-1 1-1 1-2-2h-2l-2-1v-1l-2-1v-1h1l-1-1v-1h1v-2h-2v-1l-3-1-1-1-1-1 1-1v-2h-2v-2h-1l-1-2-1-1h-1l-1-1-1 1H8l-1 1-2 1-1-1-1 1-1 1v2h1v1H2v1l1 1v1l1 1 1 1 2 2H5l-1 1v2h2v3l-1 1v1l-1 3h1l4 4v1H6l-1-1 1 1 2 4v1l-1 1v-1H6l1 2 1 1 1 2 3 1 1 1 2 1 1 1c2 0 2-1 2-2v-2l2-1 1 1h1l1 1 1 1 1 2 2 1 1 1h1v2l-1 2v1l-1 1 3-1h2l2-1 1 1 1-1v-2l-1-1v-2l1-2h1l2-1 2-2-1-1Z"></path><path d="m-10 403-1-1-2-3v-1l-1-1-10-9v-3l-1-1v-2l-1-1-1-1h-1v-6h3l2 3h1l1-3h3l1-1 2 1 1 1v-1l1 1h4l1 1 1-1h2v1h2v-1l1 1h3v2l1 1h2a6 6 0 0 1-1-2v-1l2-2h1-1l-1-1H3v-3l-1-1v-1h1-1v-3H1l-2 1-2 1h-6l-2-2h-2l-1-3-1-1h-2l-1-2-1-1-1-1h-1 1l-2-1-1 1v1h1-3v1l-1 1h-1v1h-2v1h1v4h-3v1a25 25 0 0 1-1 0l1 1-1 1 1 1v1h-3l-1-1h-1l-1 1-1-1-1-1v-1 1l-2 2h-2l-1-1v1h-2l-3 1-3 1v4c0 4 4 5 6 4 2-2 1-5 3-6 1-1 3 2 4 5l3 7c1 2 0 5 2 7 2 1 6 4 10 4 5 1 6 1 9 4l2 2h3v-1Zm27-217 7-1c1 0 3-2 0-3l-6-1c-3 2-2 2-3 4-1 1 0 2 2 1Zm60 313-9-3c-6-2-4 2-7 1-2 0-3-2-7 0-2 2 0 5 1 5h7c2 0 4 4 6 4l6-2c4-1 7-1 8-3 2-2-2-2-5-2Zm71 8c3 0 5-2 7-3 2 0 5 1 5-1 0-1 0-4 2-5l3-4-6 3c-2 1-4 2-5 1l-3-1c-4 1-4 3-7 4-3 0-5 2-3 4 2 1 4 3 7 2Zm69-528c-7 0-10-2-12 2-4 8 0 12 3 15 3 2 1 5 5 4 5-2 7-5 9-6 3 0 7-5 5-8s-3-6-10-7Zm-40 538c2 0 2-1 3-2l1-1 1-3 3-2h1l1-1v-3l1-2-1-1c0-2-1-2-3-2h-7c1 1 2 2 1 3a119 119 0 0 1-5 15h2l2-1Zm0 1h-2l-2 1-3 5c-2 2-1 5-2 9l-2 4 6 23c2-3 7-22 7-43l-2 1ZM50 295l1-1h-1v-2l-2-2-1-1-6-6 1-1 1-3 1-1v-2c1-1 0-2-1-3l-2-3c0-2-2-3-4-5l-2-3-4-10a59 59 0 0 0-1-3l-1 1-3 1H16l-7-1-4-2-5 1c-4 0-5 2-7 3-1 0-5-1-5-4-1-4-4-4-6-3l-9 1c-2 0-1 2-2 3-2 1-4 0-5 2 0 1-1 3-4 3l-3 1v7l-2 2 2 2 2 2v4l2 2v3l-1 3 1 2-1 1v1l2 1 1 1 1 1-1 2-1 3v2h1v-2h2a221 221 0 0 0 2 3h2l1 1h1l1 1h1v1-1h2l1 1h1v1l-1 1h-1v1l1 1 1 1 1 2h2l1-1 1-1h-1v-1l-1-1 2-1 1 1 1 1 2 1h2l1-1 1 1-1 1a7 7 0 0 1-1 1l2 2h1l1-1 2 2h1c2 0 2 1 2 2l1 1 1 2 1 1h1v1h1l1-2h1l1-1 2 3 2 1v2h1l1 1v-1l1-1 1-1h5l1 1 1-1h1l4-1h2c2 0 3 2 3 3l4 1v1l3 1v-1l-1-1-1-5 5-6 3-5 4-1 1-2v-5Z"></path><path d="m-38 295-1-1v-2h-2v2h-1l-2 1h-1v1h-3l-1 1-1 1h-1l-1 1-1 1h-1l-1 1h-2l-2 1v1l-1 2-1-1-1-1v2l3 2 1 1-1 2v2l1 1 1 2 1 2h2l2 3h1l1 1 1 1h1l2 3 2 1v1l2 1 1-1h3l1-2h1l1-3h3l3 1h1l2 1h1l1 1h2l2-1 1 1h1l1 1v1l2-4 3 1h2l1-1h1v-1l1-1h1v-1l1-2 1-1 2-3h3v-1l-1-2-1-1-2-2h-1l-2-1h-3l-1-2s-1 0 0 0v-1h1v-1h-4l-1-1-2-1h-1v1h1v2h-1l-1 1-1 1h-1v-1l-1-1-1-2h-1v-2l1-1h1l-1-1h-3l-1-1-1-1h-4l-1-1-1-3-2 1v2h-3Zm20 63v1l1 1h2v1l1 1 2 2h2l1 2h3l2 1 3-1 2-1h1v-1l2-1h2l2-2a56 56 0 0 1 4 0h7v-1h2l2-1 1-2h1v-1h-1 1v-2h1v-1l2-3v-1l1-1 1-1 1-3 1-2 1-1 2-2h1l1-1 2-1v-1h1v-1h-3v-1l-1-1-1-1-1-1-2-1-1 1h-2l-1-1-1-1-2-1-3 1-2-1-3 1-1 3-2 1H7v1l-2 1-2-1-2 1v1l1 2v1l-3 1h-1l-8-1-3-3h-2v1l-1 1 1 1s1 0 0 0l-1 1h-3l-1-1-1 1 1 1 1 1v1l-2 1a20 20 0 0 1 0 3l1 1v1l-1 1h-2l-1 2h2v2l1 1 1 1v1l2 1Zm110 12 1-1v-2l1-1h1v-3h1l1-1 1-1h-1v-2l-1-1v-1l1-1h1l2 1 1-1v1h1l1 1 1-1 2 1h2v-1l-2-1h-1l1-2v-2h-1l-1-1h-1v-3h-1v-1l1-1-1-1h-1l-1-1-1-1-1-1 1-1v-4h-2l-2-3h-2l-1 1v-1h-2l1-1h-2v-1l-3-2h-4l-1 1-1-1h-4v1h1l-1 1 2 1 1 1a14 14 0 0 1 2 5l1 2v1l1 1h1l1 2h-1 1l1 1v1l1 1 2 1 1 4v6l-1 1v10h3Zm135 50h3l4-1 1-1 3 1 1 1 1 1 1 2 2 1 13-2h3v-1l1-2 3 1 6 3 4 1h2v-2l-2-2-1-2h-1v-2l2-2-1-1-4-1-1-1-2-1v-1l1-2 1-1h-3l-3-2-1-1v-1h-1l-2 1-2-1-5 2h-4v-2h-1s-2 0-5-3l-4-2h-7s-14-8-18-6l-5 3h1c6 4 9 5 15 12 6 6 4 9 2 13l3 1Z"></path><path d="M103 372h-3l-1 1-2 1-1-1-1 1h-2l-2-1-1-1-1-1-1-2 1-2v-9l1-2v-2l-1-1-1-3-1-1v-1l-1-1v-1h-1l-1-1v-1l-1-1h-1v-2h-1l-1-2v-2l-1-2-2-2-1-1h-2l-1 1-1 1-1 2-8 1c-1 1-2 3-4 3l-1-1-1-1-2-1h-7l-2-1v1h-1l-3-3-1 2h-1l-1 1-1 2h-2l-1 1-2 1-1 1-1 2-1 3-1 1-1 1v1l-1 3v1h-1l-1 2a4 4 0 0 1 0 1l-1 2-1 1h-2l-1 1h-1v1h-3a11 11 0 0 0-1 0l1 1 2 2 1 1 1 1v4l2 1 2 1h1l1 1 1 1v1l-1 1 1 1v1h-1l-1-1 1 1 1 1h1v1h1l3 1 1 2v-1l2-2h2l1 1v1l-2 1v1l2 2h1l2 2h1l-1 1-2 1 1 1h6l2 1 2 1h12l2 1h1l2-1 4-3 4-2 4-1 2 1 2 1h3l1-1 1 1 1 3h1l6 1 2-8c2-4-1-4 0-6l6-3v-3l-1-2Zm582-56 1 2 4 3 3 1h5l2 2 1 1 1 1v-1l6 3a93 93 0 0 1 7 16l-1 3 1 4v1l-2 4 1 2 1 2c1 3 1 3 4 4h20c5 1 8 3 11 5l5 3h3l4-1 2 1-1 1-1 1 1 2c2 0 2 1 2 3l1 3a43 43 0 0 0 8 11v-1h2l2-1h9l5 1h12l6-1 3-1h5l3 1 8 1c1 1 4 4 10 5l3 1v-1h13l2 1-1 1v1c1 1 2 2 6 0l24-12 17-3c3 0 4-1 6-3l3-3 6-5c1-3 7-7 8-8l-5-10 4-6h20l5-2 1-5v-2h8l8-6 6-10h5l2-4h4l6-3 3 1 3 2 7-3 1-1-2-3-3-2-5-5-3-1-3-2c-2-2-3-3-5-2l-3 2-2 1h-14l-5-2v-1l-1-4 2-4 1-2 4-9 2-4 1-2c1-2 3-5 2-6h-3l-6 1-10-1h-9l-5 3-5 5-9 6-4 2c-4 3-7 2-15 2l-4-1h-8l-2-1c-4 0-4-1-5-3l-1-1c-2-3-4-3-8-4h-2l-4-2h-3l-10-2-6-1-4 2c-1 1-2 3-5 3l-6-1-3-1-3-1-3-2-3-3-4-3v-8l-2-1-6-1c-3-2-4-2-6-1h-9l-2-1c-4-1-4-2-8-5l-2-1-1 4v2l-2 6-2 2v2l-2 3-1 2h2l1 3 3 2c2 1 1 2 1 3l-1 3c0 2-2 5-5 5h-1v3l-3 1-4-1h-8l-3-1-2-1-9-1c-3-1-3-3-3-5v-2l-1-1h-1l-4 1h-1c-3 0-6 0-9-2h-2l-4-1-1-1-2 3-1 1-1 2-2 3-2 2-2-1h-2l-2 2-2 2a170 170 0 0 0-11 4l1 1 1 2v2h-1l-2 2-4 1c-2 2-4 1-5 1l-3-1 1 1v10l2 3Z"></path><path d="M203 316h-1v-3h-1l-2 1-1-2-1-1h-2l-1-1-1-1-2 1-1-1-2-1h-1l-1-1-1-1h-1v1l-1 2-1-1v-1l-2-1-1-1v-2l-1-1-1-1-3 1-3 1-2 1-1-1h-2l-1-2h-3v1h-2l-1-1-1-1v-4l-1-1v-3h-1v-1l-1-2h-2l-1 1-1-1h-4v-5l-2-2 1-1h2v-1l-1-2-2-3-3-3h-3l-1-1-2 1c0 1 0 2-2 1l-4-1-1 3-1 1-1 1-2-1h-2l-2-1-1 1h-4v2l-3 3h-1v3l1 2-1 2h-1v-1h-1l-1-1-1-1h-1l-1 1h-1l-1-1v-1l-1 1-2 2-2-4-3 1-1 2-1-1v-1h-3v-1l-1-1v1l-2 1-1-1-1 1-1 1v-1l-1-1-1 1-3-1v-2h-2l-3-1-1 1v-1l-3-1h-1l-1-1h-2l-2 1v-1h-4l-4 1h-3l-1 1-2 3h-1v1l-2-2-1 1v5h1v1l2 3 1 1v2h-1l1 1v3l-1 1-1 2-3 1a123 123 0 0 1-8 11v5h1l1 1v1l-1 1h-1l-2-1v1l-1 2-1 2-1 2v2h1l1 2 1 1 2 1v1h2v1l1-1 1-1 3 2v-1l3 1h2l3 1 1-1 2 1 1 1 1 1 1 1 3-3 8-2 2-1 1-1 1-1h1l1-1v-1h3l1-1 1 1 1-1 1 1v-1h3l3 3h2v2l1-1v1h4l1 2h3v5l-1 1v1h1l1 1v1h1l1 1v1l-1 1h1v2h1l1 1h1v5l2 1v1h-1l-1 1-2-2v1l-1 1-1-1v-1l-1 1v-1l-2 1-1-2h-1v3l1 1v1l-1 1v2h-1v1l-1 1-1 1v1l-1 1v1l-1 1h-2v1h2l1 1h2l1-1v1h1l1-1 1-1c2-1 3 0 4 1l1 2 1 2c2-3 0-4 0-6l4-2c2-1 3-6 6-10 4-4 4-2 9 0 4 3 2 3 5 3 4 0 9 2 9 4 0 3-2 2-5 4s-2 4 0 4c1 0 6 3 5 6-2 3 4 4 9 4 5 1 4-3 5-4l6-1 4-4h9c4-1 0-3 0-4s-2-2-5-1h-7c-3-1-3-4-4-6-2-2-2-2 0-3 1 0 0-6 2-5 7 1 11-2 15-5 5-3 5-4 8-4l4 1 1-1-1-1v-2l1-1a2 2 0 0 1 0-1l1-1c3 0 4-1 4-2h-1l1-1h6l1 1 2-1 1-2 1-2v-1c-1 0-2-1-1-2l-1-2v-1c-1-1-2-1-1-2l2-1h1l1-1h-3l-1-1v-1l2-1 2-2 1 1v-3Z"></path><path d="m34 325 1-2 1-1v-2l-5-2c0-1 0-2-2-2l-1-1-2 1h-3l-1 1h-1l-1-1h-4l-1 1-1 1v2l-2-1h-2v-3l-2-1-1-2H6l-1 1v1l-2 1v-1h-4l-2 2h-1l-1 1v2l-1 1-1 1-1 1-1 1h-1l-2 1-3-1-1 4-1 2v1l1 2 1 3v-1l2 1 3 2 8 1h3v-4l2-1h3l1-1h7l1-1 2-4 3-1 2 1h3l3 1 1 2 2-1h1l1-2 1-3ZM14 222c4-3 5-3 8-3h1l4 1h1l1-1h3l4 2h3v-1l2-2 1 1v1l1 1 1 1 5 2 1 2 2 2h2l2-1h4l2-1v-2l3-2v-4l-1-2-1-1v-1h-2l1-4v-1l-1-3-1-1v-1h-5l-3-1c-1-1-3-2-3-4-1-1-6-3-7-2l-2 1-4 2v8c-1 6-5 5-7 4l-1-2-4-5c-1-2-3-3-6-3-2 0-6 4-8 6-3 2-2 3-1 4l-1 4-1 11a98 98 0 0 0 7-5Z"></path><path d="M42 196c1 0 6 1 7 3l3 3 3 1h2l2 1-1-1v-1l1-1 2-1 1-1-1-1-1-3v-2l-1-5c0-2 0-4 2-6l1-1 2-4v-2l-1-2-2 1-5-1-6-2c-3 0-5-2-6-1l-3 3-9 2-5 4v9l-3-2-5 2-2 1-2 1-2 2 1 3v5l2 1c2 1 1-2 1-2l1-2 2-2 2-1 1-1v-4h2l2 1 2 2 4 3 3 2v2l3-2 3-1Zm735 465c0-3-1-6 1-7l1-1 1-3v-3l2-1h1l1 1 1 1v-1l1-3v-1l-1-2-1-4-1-2v-3l-2-3-1-3-1-6h-2l-2 3v5l-1 1v1l-1-1-1-3h-1l-1 1v1-4l-1-2v-5h1v-1l2-1h1l1-1 1-2h1l1-2v-1h-6a12 12 0 0 1-2 1l-2 1h-2l-2-1-4 1h-4v-1l-3-3-1-2-1-3v-3l-1 1-2 1-3-2-1-2-1-1h-2l-4-3v4l-2 2v8l1-2h1l6 5v1h-6l1 1 1 2-1 1 2 4 1 2-1 1-2 1v1l1 2 2 3 1 2 2 3 2 6 1-2c2-1 1-3 1-5 1-3 3-1 5 1 1 1 2 2 4 1 1-2 3 2 4 5 1 2 2 4 2 9 0 4 4 8 8 13 2 3 6 4 9 4l-2-4v-1ZM267 446l-1-1h-3l-3-1-1-1h-2l-1 1v3h2l4 3 3 2 3 1 1 1a110 110 0 0 0-2-8Zm261-20-2-2v-2l3-4-2-3-2 1-2 1-2 2-2 1-1 1-1-1-1-1-1-1-1 2v1l1 4v1l-2 1h-7l1 1 2 2-1 1-1 3-1 1h-8l-3 1h1l-1 3-1 1 1 1 1 1h2v1l2 1h3l1 2-1 1 1 5v1l1 1v3l-3 7-1 3-1 1s1 3 3 3h1l1-1 2-1 4-3h2c1 0 0 0 0 0l1 1 2 1h1v-4l2-1h3l2 1h1v-2l1-2v-1l1-1a53 53 0 0 1 1-3l1-2 1-2 1-1 1-1h2l1-1 1 1 1 1v2l1 2v2l1 2v3c-1 2 0 4 1 8l1 2h3v-1l1-1 4-1h2l1-1 1-1 1-1 1-1 3-2c3-2 5-1 6-1l-1 3 3-1 6-2c2 0 3 1 3 2h1l1-2v-6l-1-1-1-2-1-2c0-2-2-2-4-3h-2c-2 0-4 0-5-2v-2l-1-4-2-4h-4l-7 1-2 2-1 1-1-1-1-1h-1l-2-1v-1l-2-1h-3l-1 1c-2 1-4 2-5 1l-2-1v-1l-2 1-2 1h-5l-3-1c-2-1-2-2-2-4l1-3 1-1 1-1v1a20 20 0 0 1 6-2l2 2 1 1h2l2-1 1-1 1 1 2 2h1l-1-2-1-1v-1a44 44 0 0 0-5 1Z"></path><path d="M382 414v-5l1-2 1-1h2l3-1 1-1h1v-1l1-2h3l1 1-2-3 4-2v-2l2 1 2 2 3 3h5l3 3 1 2c-1 0-1 1 1 1l2 1h1l-1 2-2 3-1 1v1l5 2h9l2-1h2c1 0 2 0 3 2l1 2 1 3 5 11 35 21h3l2 1 3 1 2 3v6l5 1 6 1h1l1-1 1-4 3-6v-4l-1-1v-8h-3l-2-1-1-1h-2l-2-2 2-2v-3h11l1-2 1-2v-1l-2-2v-1l2-1h6v-1l-1-4 1-1 1-2h1l2 2h1l1-2 3-1 1-2h3c2 1 3 2 2 3l-3 4v1l1 1 1 1h5v-1h3c2-1 2 0 2 1l1 1 1-1 1-2 2-2h3l1-1 2-1 2-1 1-1 1-2h-4l-3-1h-2v-2h-3l-1-2a4 4 0 0 0-1-2c0 2-3 4-5 4l-2 1-2-1c-2 0-2-1-2-2v-2l-2 2-1 1-2-4c-1-1 0-2 1-2l1-1 3-1h1v-1l1-2 3-2-3-2-4 5-1-1v-1s-8 11-11 11h-3l-1 1-1 3h-1l-2 2v6h-2l-1-1c-2 0-3-1-3-2v-1l-1-2v-3h-2l-12 1h-1 1s0-9-3-10h-4l-1-2v-3l1-9h-4s-4-10-8-10h-2c-1 1-2 2-4 1h-1a63 63 0 0 0-22 2l-3 1-2-3c-2-4-5-9-10-10l-13-8c-5-4-10-8-13-8l-27 10 3 53 10-1v-3Zm-293-9c0-6 3-5 5-8l2-2-6-1-1-1-2-2v-1l-2 1-1-1h-2l-2-1h-5l-4 2-3 3-3 2h-1l-2-1h-5l-2-1h-5l-2-1h-8l-1-1v-1l1-1 1-1-2-2h-1v1l-2 1-1 2 1 2v1l2 3 2 2v1l1 1c1 1 0 2-1 2l-1 1h-2l-1 1v6l-1 1 2 2 3 2v2l1 1-1 1v2l1 1v1l2 1 1-1h2l1-1h4-1v-1h3l2-1 1 2v1h2v-1l1 1 4 1h4v-1h4l-1-2v-1l1-2h1v-1h2v-1l1-1h1l3-1h3l1 1 1 1 1-1h1v1-1h6l-1-2c-2-4-2-4-2-9Zm185 45h1l-1-2v-2h-1l-1-1-2-1-3-2-1-1-1-1v-1h3l1-1v-1l-2-1-2-1-1-3v-5l-2-1-2-1v-2l-1-1h-3l-13 3h1v7l1 2v2l3 2a50 50 0 0 0 5 1l3 3v1h1l2-1 1 1 3 2h3l1 1 1 1a121 121 0 0 1 3 7l3-2v-2Z"></path><path d="M499 469h-1l-6-2a71 71 0 0 1-15-3l-2 2-2 2-2 1c-1 0-2 0-2 2l-1 3-1 4c-1 4-4 6-6 6h-4l-1-1v1l-2 2h-6v2l-1 2-4 3c-2 2 0 4 0 4v3l-1 1-2-1-1 9h5l-4 3 1 6v10c0 4-1 5 2 7s8 0 9 0l2 1-2 3c-3 2-4 5-5 7l-1 3c-2 1-3 4-3 7l2 4 2 2 8 1h3a14 14 0 0 1 6 0h4l3-1c1-2 2-3 3-2l2 1 3 1 1-1 4 1h4v-7c-1-1-2-2-1-4l3-4 4-1h4l2-1h2l1 1v-1l-2-3v-1l2-1 5-2c2-1 4-2 5-1v1l1 1 3-1 1-1 1-1v-4l-1-2-1-2h1l4-1-1-1v-2c1-3 2-4 4-4l4-1-1-4-2-5-1-2h11v-5l1-2 5-8-1-1v-2c1-2 2-2 1-3l-1-2-3-4h-1l4-5 1 1v1l2-2 2-4c1-2 1-3 4-2l7-1 2-1 3 1a48 48 0 0 1 5 0h5v-1l-1-2v-2h4v-1l-3-1c-2-1-5 0-6 1l-4 2-1 1 1-1 2-3h-5a41 41 0 0 0-5 3l-1 1-1 1v1l-3 1-4 1v1h-2l-1 1h-1v-1l-1-2c-2-3-2-6-2-8v-1l1-2-2-2v-4l-1-2v-1h-3l-2 2-2 2v2l-1 2-1 1v1l-1 1v3l-1 1h-1l-2-1h-3l-2 1v5h-1l-2-1h-1v-2l-2 1-4 2-2 2h-1l-2 1-2-4-1 1ZM27 430l5-4 1 1h4l1-1 1-1 1-1v-6l-1-2-2-2c-2 0-2-1-3-2h-4l-2 1-2 1-1 1-2-1h-1l-1 1-1 1v2h-2v3l-1 1v1l1 1-1 1v1l1 1 1 1v1h1v1h7Zm714 158h1-1l-1 3 5 3 2 1h4l2-1 1-1 3-1h1l5 2 2 1 3-1h1l5-1 2-1h-1l-1-1v-6l-1-1-2-2-2-1-2-1-2-1-2 1h-16l-2 2-2 2-3 1v2l1 1ZM346 406a456 456 0 0 0 9-1l3 3c6 3 8 9 9 11l5-1-3-53v-1l27-10 14 8c5 4 9 7 13 8 4 2 7 7 9 10l3 3h2l9-2h14l3-1 3-1c4 1 8 9 8 11l4-1v15h4c3 1 3 8 3 10a147 147 0 0 0 14-1v1l1 1v4l3 2a77 77 0 0 1 3 0v-2l-1-3 3-2 2-3v-1l2-1h2c2 0 9-8 10-10h1l1 1 3-5 3-5c2-2 4-2 8-2h3c4 0 7 1 9 3l3 1h1v-5l2-4 3-2c1-2 2-2 3-2l1 1 2 1 3 1 6 2 5-1h31c4 0 5 2 5 2l5 3h1l6 2v-3l-1-2 1-2 2-1h1-1l-1-1 1-2 2-1v-3l-1-2-1-2-2-6-1-5 1-1-2-2-3-2-2-2h1l1-2c1-2 1-2 3-2h4c3 0 4-1 5-2l5-2 3-1v1l1 1h4l2-1v-2l-3-3 7-24 5 2h6l6 2h1l2-1 1-2 2-1 4-3v-2l1-6-1-2-1-6c1-3 1-3 3-3h2a10 10 0 0 0 7-7l2-3 2-1h4l-2-2h-1l-2-2c0-1-1-2-3-2-2-1-2-2-2-3l-1-2-1-1-1 2-2 4h-1c-3 0-5 0-9-2l-3-3 1-1c-1-1-3-3-5-3-3-1-3-3-3-4l-1-1-3-5c-2-4-3-4-4-4h-1l-7 1-4 3-9 1h-1l-2-1v-1l-1-2h-3v-5l-1-1-1 1-2 1-2 2-1 1v2l-3 4h-1l-25-42a155 155 0 0 1-13-12l-1-2h-1v-2l2-2 2-1 2-3-6 2-1 1-2 1-2 1-4 2c-2 0-2 1-3 2v1l-1 2-2 1-2 1-4 3c0 2-1 2-3 2l-1-1-2-1-6 4-1-5 1-1c0-1 0 0 0 0l1-1 2-1h1v-1l-1-2h-2l-1 1-4-1h-1l-2-1v3l-3 1-2-1 1-1v-4l-3-1h-1l1 2v1h-1v-1h-3l-1 2h-3v-1h-4v-3l1-1 1-2v-4l-1-2-2-2-1-3-1-3-1-1-1 1h-2l-1 1h-2l-5-1c-2 0-4 0-7-2h-1l1 1v1h-3l-1 2v1h-3v3l-1 1-9 3-12 5-3-2v1l-1 1h-4l1 2h-5v1l1 2-1 1-1-1h-2l-1 1h-4l-2 1-2 1-6 1-1 1-4 1-2 1-1 1-1 1h-1v-1h-12v1l-1 1v1l1 1-2 1v3h4l2 1v1l-2 1h-2v2l8 2 1 2 1 1v1h-10l-2 1v1l-2 2 1 2 1 3v3l-4 3-2 1-3 1-1 1 1 1 1 1h1l2 1 2 1-1 2h5l2 1 1 1 1 1 3 1c2 1 2 3 1 5a19 19 0 0 0-1 2l-2 3c-1 1-3 2-8 2-3 0-4-1-5-3v3l-3 3h-3l-1-1-3-2-2-1-4-1c-2-1-2-2-1-2v-1l-2-1a89 89 0 0 0-1 0l-1 1h-5l1 2-2 2h-1l-2-2-1-1-2-1h-1l-2 1v1h-2v-1l-1 1v1h-1l-3 1v5c-1 2-2 1-4 1s-2-1-3-2h-1l-1-1-2-1-1-2-3-1-1 1h1v6l-2 1h-1v-5l-2-2-1-1-3-3-3-2-1-1-4-1h-7v-1c0-2-2-3-3-3h-2c-1 1-2 1-2 3v1l-1 1h-1l-2-1-1 1-1-1 1-1-1-2h-6v1l1 1h-1l-2 1c-1 3-2 6-8 7h-3v6l-4 3-5 2a74 74 0 0 0 5 9l-5 5-10-12-3 4-2 5-3 3v1l1 3-1 3h1v1l2 2-6 11 6 2 3 1v7l2 2v-2h5l5 3 2 3 3 4 1 1 2 4v1l-2 1h-1v2l4 2 1 1 2 2 6-4c2-2 9-2 11-1s5-2 8-3c4-1 6 7 7 12 1 4-1 9-5 9-3 0-9 2-12 5-2 2 3 8-1 8s-7 3-5 4c2 0 5 5 7 7l4 8c1 2 8 3 13 4 4 1 2 6 0 13v5l4-4c5-5 5-5 12-7Zm309 145-3 3c-2 1-2 1-2 3v5l-1 2-2 3 3 2 2-1h1l7 4v1l1 2 1 1a42 42 0 0 1 10 4h3l1 1-1 1 2 1h1l3 1 1-1a163 163 0 0 0 6 1l1-1 3 1h1l3 2v3h1l1 1 4 1h4l2-1v1l1 2c1 1 1 0 2-1h2l4 2h3a23 23 0 0 1 1 0l1-1h1l-1 1 2 2c1 1 1 0 2-1l2-1h3l1-1 1-1v-1h1v-1l-1-2v-10h-2l-6 1-7-3-1-1-1 1-1 2h-2v-2l-2 1-2-2-2-3h-2l-1 1-2-1v-1l-2-2h-3l-3-2-1-1c-2-1-2-2-2-3l1-1h-5l-3 1c-2 0-2-2-3-4l-1-2-3-2-3-1-3-1-1-1-1-1v-1l1-1-1-1-1-1h-6l-1 1v1l-1 1-1 1h-1l-1-1-1 1h-1ZM271 416l1 1v1l1 2 2 2 1 2-1 1-2-1-4-1-6-2-1-1-1-1-1 2v2l1 1v1l1 1 2 1v5l2 2 1 1 2 1 1 2h-1l-1 1-2 1v1l2 1 2 2h2l1 1h1v2l1 1v2l-1 2 5-3 3-2 4-3h3l2 1v1l2 1v1l-1 2v2l-1 1v2c1 1 2 3 5 4 2 2 3 1 4 1h1v-1c-2-3 0-8 0-11s3 3 3 3l1-6 1-9c1-2 6-3 8-4 1-1-4-4-7-5-3-2-8-9-11-15l-2 3-2 2-1 2c-1 2-2 4-4 4h-2l-2-2-6-6h-3l-1-1-2 2Z"></path><path d="m361 458 5 2c2 1 3 1 6-2 3-2 4-4 4-6 1-2 1-3 3-3l3-1h8c1 0 4-4 6-3h6l4 4 4 2 3 1 3 2 3 2 2-1c1 0 3-1 5 1l2 2 1 3 6 3 5 2h7v18l1 2 4-1 1 1 1-1 1-2h6c2 0 5-1 5-5l1-4 1-3c1-3 2-3 3-3h2l1-2c1-1 1-2 3-2l6 1 4 1-1-3v-2l1-1-2-2-3-1-3-2h-3l-34-21-5-11-2-3-1-2-2-1h-4v1h-1l-2-1h-2l-2 1h-2c-2 0-4-2-5-3l-1-1 2-2 2-2 1-2h-4l-1-2v-1c0-2-2-3-3-3h-6l-3-3a72 72 0 0 0-2-3l-1 1-3 2 1 3v1l-2-1-2-1-1 2v1l-1 1h-1l-3 1-1 1-2 1-1 1v3l1 1v1l-1 3-10 2h-6s-2-7-8-10l-3-4c-1-1-1-1-6 1h-3c-6 3-7 3-11 7l-4 5 5 4c3 4 1 4-1 7-1 4 3 10 5 10 1 0 2-3 5-1 3 1 1 3 0 6-1 2 1 3 4 5 2 3 3 5 2 10v1l3-1 7-1Zm382 177-2-3-2-3-1-3-1-2v-1l2-2 1-1-1-1-2-4h-1 1v-2l-1-2 1-1h4l-5-5v1l-2 1v-8l2-3v-4l5 3 1 1c1-1 1 0 1 1l2 2 2 2 2-2 1-1 1 1v3l1 3 1 2 3 3 3 1 3-1h4v1l2-1h1l2-1h6l-1 3v1l-2 1-1 1v1l-2 1h-2v4l1 3v3l1-2h1v1l2 2v1-3l1-1v-2l2-3 1-1 1 1c1 0 2 2 2 6l1 3 1 3v1l1 2v2h2v-12h1s1 2 3 2v-1l2 1 2 1 6-14-2-1s0-3 2-4l1-1 1-1 2-9v-1l8-6c3-2 6-3 8-2l2 1 1 1-1-2-1-1 1-1 2-3-3-1-2-1-2-1-4-2-3-1-2 1a261 261 0 0 1-12 9l-2 1-2 1-1 1-1 1-2 1h-9l-4 1h-1l-5 1h-6l-6-2-2 1h-1l-3 1h-4l-2-1-6-3a144 144 0 0 1 1-3v-3l-2-1-2-1-3 2 1 3v4a34 34 0 0 0-1 1v1h-5l-1 2-2 1h-1l-2-3v-1 1l-1 1h-2l-2-1-4-1-1-1-3 2-1-3-2 1h-4l-4-2h-1l-1-1v-3l-3-2h-1l-3-1-1 1h-3l-3-1-1 1h-3l-1-1-2-1v-1h-2l-1-1c-1 1-1 0-2-1l-8-3h-1l-2-3v-1l-7-4-2 2a28 28 0 0 0-4-3l1-1 2-2v-2l1-5c-1-2-1-2 1-3l3-3 1-1h1l-2-3-1-2-1 1-2 1h-1l-2-4-1-1c0-2-1-2-2-2l-2-1h-3l-2 1c-2 0-2-2-3-3v-5l-1-3-1-1v-1l-3-4v-5c-1 1-2 2-3 1-2 0-2-1-2-3v-2l-2 1-2 1-2-1-2-1h-1l-6-2-2 1-1 1c-2 0-3 1-4 3v4c-1 2-4 3-5 3l-4 3-3 1-2 1v1l1 1v7l-3 4-2 3a37 37 0 0 1-3 3l-4 4c-2 1-3 4-4 7l-2 5-4 5-2 3-1 1-6 4-4 1-4 1c-2 1-3 1-3-1l-1-1-7 3c-6 4-3 12-3 12l1 1 5-1h1l-2 9 3 2h3v4l4 9v4h-10l-3 1-2 1-3-1-2-1h-3v2l-2 2a9 9 0 0 0-4 2v1c0 1-3 3-1 6s8 4 13 3c6-1 5 1 2 3-3 1-10 1-5 10s16 11 17 11l9-2c3-1 3-5 4-7s0-4-1-7c-2-3 1-3 2-3h4c1 1-1 1-2 2v5l3 2c-1 1-2 1-2 3 0 3 2 4 2 10s-1 7 1 10l3 13c0 5 3 10 5 14 1 4 0 8 3 13s9 13 11 21 5 15 9 18c5 4 11 20 12 24s1 12 9 19c7 7 10-2 10-4s2-3 6-4c5-1 3-3 4-7 1-3 4-4 7-6s1-6 0-11l1-9c2-3 4-9 4-13s-3-5-4-12c-2-8 2-10 8-17 7-7 11-5 13-7l3-8c1-2 5-3 7-5l8-8c3-1 2-3 4-6l5-7c2-3 5 0 11-5 7-5 5-8 5-11s2-5 4-6l8-4c3 0 5 1 5 2l7 1 6-3 3-4v-1l-2-5Zm-437-91h-3v-5c0-3 1-3-1-9-2-5-5-6-8-8h-2l-3-1-3-2-1-2 2-1a71 71 0 0 1-7-9l-1-1h1v-3l-1-1v-1l1-1h1l1-1v-2l2-3h1l1-1 1-1-1-2v-3l1-2-5-1-3-2-1-1v-3l-2-1-2-2v-3l-1-3v-2l-1-1-2 1-2 1-1-1-3-1h-9l-3-1v1l-4 2c0 1-4 5-8 7l-3 1v2l1 1v10c0 6-2 11-3 12l-23 14c0 2 3 10 5 12l2 2 2 2v4h2c4 0 15 5 25 11s29 23 31 25h17l10 2 2 4h5v-2l-4-4-2-5v-7l1-4c1-1 2 1 3 2h2l-7-8v-5ZM72 427v-1l1-1 1-1v-3h-1v-1h-2l-1 1 1 1v2l-1 1-2-1h-1v1h-3l-2 1-3-2h-1v1l1 1-1-1-2-1-1-1v-1h-4v2l-1-1h-1l-1 1h-4l-1 1h-4l-1 2h-6l-5 4-2-1-3 1v4l-2 1v1l-1 3h-2l-1 1v2s1 0 0 0v1a3 3 0 0 1-1 0v1h-5l2 5c2 2 6 1 9 4 2 3 1 5 3 6 3 1 4 2 5 5 0 4-2 3-2 5 1 3 5 4 6 8s6 7 7 9c2 2 3-1 3-4 1-3 3 2 5 2 3-1 1-3 0-4s-2-2-1-4c2-1 5-2 2-3-2-1-2-2-2-4 1-2 5 1 8 2 3 2 0-2 0-4-1-2 1-3 1-2 1 2 4 5 6 4 3 0 1-3-1-4s-4-2-4-7c-1-4-4-3-7-3-2 0-3 2-4-3 0-4-4-7-5-10-2-3 0-5 4-4 5 1 2 4 5 4 2 0 0-3 1-3 0 0 2 3 4 2 2-2-2-4-2-4h4c0-2-4-3-3-5l3-3c1-1 4 2 5 0 1-1 4 0 8 1l2-2v-2Z"></path><path d="M179 487h1c3-1 5-1 6-3v-2l1-2 2-1v-5l1-3h1l1 1c1 1 1 2 3 2l6-2 1-1c2-1 4-2 5 0l1 2 1 1 5-1 7-2 9-3 4-1 6 1 5-2 1-1h1v2l1 1 4-3v-1l1 1h2l4 1h5l-5-4-2-3-1-2-1-3-1-1v-3h1l2-1-1-2v-2l-1-2-2-3-3-1h-2c-1-1-3-1-3-3l-1-2v-8h-1c0-2-1-3-2-3l-1-2-1-1h-1l-3-1h-1l-4 1h-6l-1 1c-1 5-7 5-12 6-6 1-13-1-23-2-10-2-11-4-14-6-2-2-5-2-10-4s-8-1-21-1c-12 1-12 4-15 7s-6 5-9 5c-4 1-5-1-10-1l-10-2c-4-1-5-4-6-7h-6v2l-1-1-1-1v1h-1c-1 1-1 0-1-1l-1-1h-3l-3 1h-1v2h-2v2l2 1v4h-2l-1 1v3l-1 2 3 1c6 1 5 4 3 8s1 8 4 8c3 1 4 9 1 11-2 1-3 5-2 6s4 1 5 3c2 2 2 10 5 11 4 2 12 2 15 7 2 4 13 6 17 2s3-8 6-7c4 0 8 2 11 5 4 4 10 3 15 2s5-2 6-5c2-3 4-3 6-3 2 1 3 3 8 1 5-1 2 2 1 3v3h4Z"></path><path d="m452 610 1-6-1-2 1-3h1l2-2 6-4h2c1 0 0 0 0 0v1h2l2-6v-1l-3-2-3-1v-11h-9c-3-1-3-3-4-5l-1-4-2-2-1-2c-2-1-3-2-3-4 0-3 2-6 3-8l1-2c1-2 2-5 5-7l2-3-1-1c-1 0-6 2-9 0s-3-3-2-7v-9l-1-7 2-3h-3l1-9h2l1-3c-1 0-2-2-1-4l5-4v-1c1-2-1-4-1-4v-17l-6-1-5-1s-4-1-6-4l-1-3-2-2h-7l-3-1-4-3h-2l-5-3-3-4h-6c-2 0-5 3-6 4l-4-1-4 1h-3c-1 0-2 1-2 3l-4 7c-3 3-5 2-7 1l-5-1h-7l-3 1c1 5 5 11 5 11 2 6-2 5-5 5l-17 2c-4 0-12-4-16-7-5-4-7-2-13-4-5-2-3-4-4-7h-1l-2 1-2-1-6-5v-2h1v-2l1-2 1-1-1-1-1-1-2-1h-3l-4 3-3 2-8 4v1l-4-2-3-1-3-1-3-3-1-1v3h-3l1 2v2l1 3 1 2 2 3 5 4c3-1 3 0 3 1l1 1 2-1 3-1v1l1 2v6l2 1c1 0 2 0 2 2v3l1 1 3 1 5 2h1l-1 1-1 1 1 3 1 3-2 1h-1v1l-2 2v2l-2 2h-1v6l1 1 7 8-2 2 1 1 3 1a64 64 0 0 1 4 2c3 1 6 2 8 7 2 7 2 7 1 10l1 5h2v5l7 8 2-1c2-1 4 0 8 1 3 0 3 0 5 3 1 2 3 8 7 12 3 5 2 8 4 9l12 2c5 2 3 4 5 6l8 4 8 1c5 1 4 3 9-1s12-5 15-3c4 3 5 11 6 14s8 3 10 2h5c1 2 7 2 12 3 5 0 12 6 18 4l5-2v-1ZM-84 180v1l1 3h1l2-5v-9l3-2v-1c3-2 4-3 3-7l-4-8h1s3 0 3-2c1-2 1-5-3-8h-1v-21c0-1-4-11 4-17 5-3 6-2 7-1h2c2-2 2-5 2-6v-2l-2-1h-1l-1-1 2-3 2-4 1-3 2-18s6 0 7-3v-2l2-5 5-8v-4l-1-2-1-2 1-1 1-1a54 54 0 0 0 5-9c1-2 3-1 3-1l3 2v-2c1-5 1-9 3-9 1-1 5 1 10 2l3 1 2-2-1-1v-2l1-3V7l2-1 2 2 1-2 1-1c1-2 2-3 5-2 2 1 3 3 3 6l1 4c2 3 3 3 4 3l3-1 3-2c2-1 3-2 4-1 2 0 3 2 4 3l2 1 2-3 1-1 1-1 2-3 2-10 2-5 2-4 2-2 4 1c3 0 3-2 4-2l1-1 4 5v1l2 1 3 4c2 3 2 3 0 4l-1 2c-2 2-2 3-1 3l1 2v1l1-1 1-2 1-1 3-4c2 0 2-2 2-3l1-2c2 1 4 3 5 2v-2c-1-2 0-3 1-5l1-2h-5c-2 2-4 1-5 1-1-1 2-3-1-4l-5-3h8c2 0 4-3 5-4 2-1 5-1 5-3 1-2-2-2-4-3-2 0-6-1-10-4-5-2-6-3-8 0s-4 4-5 3c-2-1-7-3-8-1s-3 5-6 3-7-2-10-1-10 3-12 5c-2 3-6 5-13 3-6-2-5 3-2 5 3 3 1 5-3 4-4 0-3 0-5 4s-5 5-7 4c-1-1-3-4-4-3-2 1-1 4-1 4h-3l-1 4-3-1c-1 1 1 3-1 4-1 1-3 1-3 3l-2 4c-1 1-3 1-4 4 0 3 0 6-2 7l-10 4c-4 2-5 5-4 7v9c0 3-3 4-5 4s-1 3-2 5c0 2-2 3-3 5v4l-3-1c-2 1-1 3 0 4s3 1 2 4-3 2-3 6-2 7-3 8l-4 6c-2 2-1 4-2 5s-2-2-4-1l-3 5-5 10-7 6c-3 2-5 7-7 10l-7 4c-2 1-4-2-5-1-1 2 1 3-4 6-4 3-5 8-6 14-1 7-3 5-4 7-1 3 2 7 3 6s3-1 3 1v5c0 1 3 1 4 8s-1 11-2 12-4 1-4 4 2 4 6 6c3 1 3 5 9 7 7 2 10-3 12-3 2-1 7-5 13-13l9-5 2-1Zm931 579v-1l2-2h1v-1l-1-1-1-1-1-4-1-1v-1l-2-4v-1l1-5c1-2-2-4-6-7-3-2-4-7-3-9v-1c2-1 2-2 2-5v-3l2-2 1-1-1-1-2-1v-5l-2-2-2-2-3-4-1-3-4-6v-2l1 1h3l1-1-1-1v-1c2-1 1-1 1-2v-2l1-2v-1l2-2h8v-2c0-2 1-2 3-2h3l-1-1v-1h1l2-1h4v-1s0-2 2-3l1-1 2-1 1-1 1-3 3-2h1l1-1h-2l-3 1-3 2c-3 0-4-1-6-4l-2-4-4-2-1 1h-1l3-10h-6v-5l-1-3 1-3h-4l-2 1-3 1-4 1v-1h-1l1-1 2-3v-1h-1l-2-1h-1l1-2v-1l1-1 2-2 1-4h2v-1l2-2h2l1-2 1-2-1-1 1-2v-1l1-5-1-3-1-6h-1l-2 1h-1v-2l1-2c0-3-1-4-2-4l-3-3-4 3v4l-2 2-2 2v1l1 1v2h-2l-2-1c-1-1-4 0-6 1l-9 7-1 9-2 2h-1l-2 4 2 1-6 14-2-1h-2l-3-1v9l-1 2h-1l1 4v7h-1l-1-1-1-1-1 1-1 1-1 1v4l-1 1-1 1v7l2 5h2l5 9 6 13 1 7c0 1-2 3-2 10-1 6 2 5 6 6 4 0 10-1 16-8 6-6 7-3 8-2 1 2 4 4 5 8 0 3 2 4 2 9 0 4 4 7 4 10s0 6 3 8 2 3 4 8l1 9c1 5 1 9-1 11v3l3-4 4-5Z"></path><path d="M9 55v-9c-2-2-1-3 0-4v-2c-2-2-3-3-2-6v-6l-1-2-2-2c0-3-8-6-10-7-3-1-5-4-6-7l-2-2-1-1h-1l-1 2v4l-1 3v1l1 1v1l-2 2-4-1-9-2-2 9-1 3-4-3-1 1-2 3-3 6-2 2v2l1 1v5c0 3-3 6-4 8h-1l-1 5-1 2c-1 3-5 3-7 3l-2 18v3l-3 5-1 2v1h1l2 1 1 2-3 6h-2c-1-1-2-2-7 2-8 5-3 15-3 15v21c5 4 4 7 4 9-1 2-3 2-4 2l3 8c2 4 0 5-2 8a54 54 0 0 0-3 3l-1 3v5l-2 5h-1l1 1c2 3 0 6 1 10s2 9 5 12 5 12 8 13c2 2 3 3 2 4-1 2-3 3-1 4s2 4 3 8c1 5 7 3 11 0 3-4 7-7 14-8 6 0 4-6 4-9l2-16 1-9c0-3 1-7 9-10 7-3 6-11 6-16s-9-9-13-12c-4-4-3-8-3-11l2-7v-10c1-6 4-6 5-7l3-2c0-1-1-5 3-5 3-1 3-3 4-4l5-1c2-1 5-3 6-8 1-6 3-6 4-7v-5l-2-4c-1-2 0-4 1-6l2-6 4-6 5-1a56 56 0 0 1 0-11Zm525 343-1 1-3 1v2l-1 1h-1l-2 1-1 1-2 2c0 2 1 3 2 3l3-2 1 1v1c-1 1-1 2 1 2h4l5-4v-1h1v1l1 2v1h2l1 1v1h2l3 2h4v3l-2 1-2 1-2 1-2 1h-2l-2 1v2l-2 1-1-1-2-1h-3l1 2v1l1 2-1 1-2-2-1-1-1 1a4 4 0 0 1-2 1l-2-1-1-1-2-1-4 1h-3v1l-1 1v2l1 3 1 1h9l2-1 3 1 4-1h4l3 1v1l1 1h1l1 1h2c0-1 0-2 2-2l7-1h1l3-1h3l1-1-1-3v-2l1-2 2-1 4-2 1-1 2-2 2-1c2 1 3 1 4-1l1-1v-1l1 1 1 4 5-1c2 0 3-2 4-4l2-3c3-3 5-4 7-3h5l4-5 4-2 7-4 4-3 2-1h3v-2l-1-3-5-1-1-1c-4-1-5-3-5-3s-1-2-5-2h-11l-20 1-5 1-7-2-2-1-2-2-1-1-3 2-3 2-2 3 1 3v3l-2 1-3-2c-2-1-5-3-9-3h-3c-4 0-6 0-7 2l-3 5 4 3Zm-536 9v-3l1-1 1-1v-2l1-1 1-1 1 1v1-2H2v-2h3l1-1h1v1a326 326 0 0 0-1-5l-1-1h2l1 1v-1l-4-3v-4l1-1 1-2v-2l-1 1H1v-1l-1-1-1-1h-6l-1 1-1-1h-2l-2-1h-2l-2-1h-1v1l-2-1-2 3h-1l-2-3h-2a4 4 0 0 1-1 2v1l1 1v1h-1l1 1 1 1 1 1v2h1v1h1v3a108 108 0 0 0 10 10v1l2 2 1 1 1 1v1h-1l-3 1h1l3-1 2 1 2 2 1 1 2 2 1 1v-4h-1Z"></path><path d="m6 416 1-1H6v-1l-1-1 5-6v1l1 2 1-1h1v-1l-1-1v-1h4v-1h-1v-1h-1l-1-1-2-1-2-1-2-2-1-1-1-1H3v-1H2l1 1v1l1 1-1 1H2v-1l-1 1H0v3h-1l-1 1v2l1 1v4l5 5 2 3v-3Zm341 270-24 3c-5 0-19 2-20 7 0 5-3 8-4 9l-3-1-4-2c-2-1-5 0-8 1a52 52 0 0 1-8 2h-4l-4 1h-3l-1-2-1-1-2 5c1 4-1 8-1 11s3 2 4 4v8c0 2 4 3 3 6 0 4 0 3 2 6s-1 5 8 5c9 1 9-4 13-8 3-3 3-1 8 1 4 2 9-1 11-3 3-1 2-4 5-4 4 0 8 0 10-3 3-3 6-3 10-5l15-4c5-2 6-2 9-8s8-7 11-8l-9-26-13 6Z"></path><path d="M13 445a12 12 0 0 1 2 0v-1l1-1-1-1v-1l1-1h2l1-3 1-1 2-1v-2l-1-2v-1h-1l-1-1v-1h-1l-1-1v-8l1-2-1-2v-2h-2l-1-2v-1l-1-1-1 1h-1l-1-2-4 5v1h1v3l-1 2 1 5c0 3 0 13 2 16 1 3 3 4 2 5h-1 3Zm377 171-1 1 1 2 1 4-2 3-3 2-2 1v3l-2 12 1 8-6 21-16 7 8 26c3 0 5-1 8-3s5-1 9-1c3 0 2-3 2-5 1-3 3-4 5-4 3 0 5-1 9-4 3-2 2-6 4-8s5 0 9 0c5-1-1-6-2-9-2-3 0-3 2-7 1-3 2-4 3-2 2 2 2 1 3-1l4-7c4-4 4-5 6-11s-1-4-3-5l-5-7c-2-2-2-5-4-5h-11c-6-1-7-5-9-7l-3-5-1-4-3 1-2 4Z"></path><path d="m381 644 3-12v-3l2-2 3-2 1-2-1-3v-4l2-4h1l3-1-2-4c-2-6-8-2-9 0l-3 5c-2 1-4 1-4 3 0 1-1 5-3 6-1 2-4 1-7 2l-8-1c-2-1-5 1-6 2h-3l8 18 23 2ZM47 286l-1-1 1-1-1-1v-1h2l2 1 1-1 2-2v-1h4l4-1 1-1 3 1h4l1 1h1l3 1 1-1 3 2 2-1 1 3h3s0-1 0 0h1v1h1v-2 1h2l2-1 1 1 1 1 1-1 1 1 1 1 1-1 3-2 2 4 1-1 2-1 1 1h1l2-1 2 2 1 1v1l1-1v-3l-1-2 1-1h1l1-3c-2 0-5-5-6-7l-3-2-3-3v-5l2-3-1-1-3-2h-1l-2-2-2-1h-2l-3-3-2-2-1-3v-2l-4-2 1-1 1-2v-1l-1-2 1-1v-3l-3-2-1-1-5 1h-2v-2l-1-1h-4v-1h-2l-1-1-1-1-2 3-1 1-2 1h-4l-2 1v2l-1 1v2l3 2-2 1h-3l-1 1-1 2-1 1s-1 0 0 0l-1 2v1l-1 2v1l1 1 1 1h-2l-1-1h-1l-1 1-1 1h-2l-2 2-2 1-3-1h-1v1l3 10 3 3c1 1 3 3 3 5l2 3 2 3-1 3-2 3v2l5 4v-2Zm-96 83h2v-2h-1v-3h-1v-1l1-1v-1h-2v-2l1-1h1v-1l-8-2-3-1-2-1v-1l-1-1v-2l-3 1h-6v1h-1v1l-2 1h-1l-1-1h-2v1l-1 1h1v3l-1-1-1-1h-1v4l1 1h-1v1h-1v-1l-1-1h-2l-1 1-1-2-1-2v2l-1 2-1 2-2 1 1 1v2h-2v-2h-1l1-1h-1l-1-1-2-1v-3l-3 2v2l-1 1-1 1v1h-2l-2-1-2 1-1 1-1-1-1 1h-1v2h1l1 1c-1 1-1 1 1 2v1c1 1 0 2-1 2l-2 1-1 1v1l1 1v1l2 2v1h-1l-1 2h1v1l1 2 3 1v1l2-1h1v3l-1 1-1 2 4-2c1-2 3-3 10-3 8 0 9 6 12 13 4 7 8 8 10 11s7 10 13 11c6 0 14 9 15 10 2 1 4-1 6 2l5 6c2 1 4 1 5 4l3 8c1 3 0 4-2 9-3 5-1 6 1 7 1 1 8-1 8-4l3-11c2-4 0-5-2-7-2-3-1-2 0-8 0-6 5-2 6-1l6 6c2 1 3-2 3-4s-1-6-3-7l-7-3-9-6c-3 0-6 0-6-2v-5c-2 0-7 0-11-2-4-1-5-4-7-6-2-3-3-7-6-10l-9-8c-3-2-4-7-5-10s1-8 6-11c2-2 4-1 5-1h1l2-1Zm268 161-3-3-5-11a1190 1190 0 0 1-20 11h-2l-2-1-4-2-4-1v-1c-1 20-5 36-7 39l1 4 1-1v2l15 3 5-5 1-2c2-2 3-2 5-2h3c2 0 3-3 4-5l1-1-6-7-4-5h1s14-3 19-6l3-1v-4l-2-1Z"></path><path d="M247 467v-1h-1l-1 1-5 1h-10l-9 3a257 257 0 0 0-13 3v-1l-1-2c-1-1-2-1-5 1h-1l-6 2-4-1-1-1v-1 3l-1 2v3l-2 1v2l-1 2c0 3-2 3-6 3h-4v10l1 2h7c2 0 3 1 4 3v4l-1 2-1 1-1 1-2 1-2 4-1 1-1 1v5l4 2 4 2h7a1235 1235 0 0 0 40-25c2-1 4-7 4-12a358 358 0 0 1 0-10l-1-1-1-2 3-2c5-1 8-5 9-6l-1-1Zm84 121 1 6v3c0 2-2 0 0 2 1 2 0 3 1 2 1 0 1 1 2-1v-2l1-3 1-1v-5l-2-1-2-1-1 1h-1ZM79 671h-9v45H60s-2 2-1 4-1 4-3 6l-1 1-1 5c1 1-1 2-2 3l-1 1v3c1 2 2 3-1 5l-3 4 1 1 3-1h2l1 3v3l1 2c1 2 1 4 3 5v5l2 2 2 2 4 6 1 3c3 1 7 0 10-1l2-2 2-3c2-2 4-2 6-2l3 3 2 3c0 2 1 4 5 4h14c3 2 5 2 8 0l5-2h1v-2l1-3h1c0-1 1-2 3 0l8 4 6 1 11-14-1-5-1-2-1-1v-1l5-1v-2h6l-1 5v3c0 4 0 7 2 9l3 2c2 2 4 4 4 6v2l1-1 1-4 1-2 1-5v-1h1l1-1 1 1c1 0 1 1 2-1 2-1 1-6 0-8 0-2 7-9 7-10h5l4-16-1-3c-1-1 1-10 2-13l2-2 1-3v-8h4l1-2c0-2 1-2 3-2 2-1 4-1 5-3l2-3 3-3c-3-3-14-5-15-13l-1-12-2-8-1-8H79v22Zm119-24c-1-2-6-7-9-8s-7-6-6-9c0-4-1-8-3-11-3-2-14-15-14-23-1-8-5-9-5-12l-4-6-7-8-3-7c1-1 1-1 4 3l8 11 6 5c2 0 4 2 5-5l2-10 1-2-7-28-3 5-8 2-8 1c-3-1-5 0-7-2s-7-3-11-2-3-1-8 2c-5 4-9 5-21 1-11-3-15-2-19-3h-2v3l-1 8v2c-1 3-2 7 2 14v81h119l-1-2Z"></path><path d="M259 751c2 0 3-2 4-4v-1l-10-14-13-9c-3-2-12-7-14-12-2-4-2-7-2-10-1-3-3-8-6-11l-2 4-3 2c-1 2-3 3-5 3l-3 2v2h-5v8l-1 3-2 3c-1 2-2 11-1 12l1 3h4l3-2 1 1 2 1 2-6 1-1 5 5v1l4-2 2-1h2l1 1v-1h3l5 1 7 4 3 2 4 5 10 11h3ZM-21 639v1l2 9 1 9 1 3 4 4 1 2-1 3-1 3v16l-1 8-1 7-6 7-9 11c-1 4-3 5-5 6l-1 2 1 3 1 4 1 2 4 5 3-1 3 4 2 5 2 8c0 7 1 11 3 13l4 4h1l-17-1-2 4 1 1 2 2c3 2 8 5 10 10l1 8c4 0 7-1 9-3h2l2 2 1 1 1-1c1-1 3-3 9-3 8 0 12-2 12-5l-1-3v-2l4-1c6-1 10-2 17-7 6-5 8-6 8-8v-4l6-1h5c0-1 1-2-1-4l-2-6-1-2v-3l-1-3h-2c-1 1-2 2-3 1h-1c-1-2 2-4 3-5 2-2 2-3 1-5v-1h-1l1-3h1l2-3c-1-1 0-4 1-6l1-1c1-1 3-3 2-5l2-4h9v-39l-81-43-9 5Z"></path><path d="m-56 531-5 4-5 3c-2 2-4 5-4 8 1 4-2 9-4 10l-1 1c-2 0-3 0-3 2l3 6 1 1v9h1l1 1-1 10v1l-1 1v12l-4 4 2 2 5 7 1 3c0 4 1 6 3 6l4 2a11 11 0 0 0 5 1c2 1 4 1 5 3v3l1 2h3c3 0 8 1 12 4l3 2c3 3 4 4 9 1l13-7h1l80 43v-6h10v-21h1l-1-81c-4-7-3-11-2-14l1-2v-8l1-3-8-4c-1-3-14-1-17-4-2-3 0-4-4-5s-24-4-26 2c-3 7-5 10-3 13 1 4 2 11-4 13-5 2-13 0-18-7-6-7-20-3-21-5s1-7-4-11c-5-3-17-6-21-6h-9v4Z"></path></g><path d="M96 394v1l-2 2c-2 3-5 2-5 7 0 6 0 5 2 10l1 2c2 3 3 6 7 7l10 2c5 0 6 2 10 1 3 0 6-2 9-5s3-6 15-7c13-1 16-1 20 1 5 2 9 1 11 4 2 2 4 4 14 5 10 2 17 3 23 2 5-1 11 0 12-5l1-1v-1c2-4 3-7-2-13-6-7-9-8-15-12h-1c-6-4-5-7-12-9s-9-2-13-5-5-2-6-5-4-6 0-6c5-1 6-4 6-5v-5c0-1-5-1-2-4 4-3 8-5 7-6l-1-2h-1l-4-1c-3 0-3 1-8 4-4 3-8 6-15 5-2-1-1 5-3 5v3c2 2 2 5 5 6h7c3-1 5 0 5 1s4 3 0 4h-9l-4 4-6 1c-1 1 0 5-5 4-5 0-11-1-9-4 1-3-4-6-5-6-2 0-3-2 0-4 2-2 5-1 5-4 0-2-5-4-9-4-3 0-1 0-6-3-5-2-4-4-8 0-3 4-4 9-6 10s-4 0-4 2 2 3 0 6l-1 1-6 3c-1 1 2 2 0 6l-2 8Zm210 42-1 8-1 6s-3-5-3-2c-1 3-2 7-1 11l1 1c1 3-1 5 4 7 6 2 8 0 13 4 4 3 12 7 16 7l17-2c3 0 7 1 5-5 0 0-5-6-5-11v-1c1-5 0-7-3-10-2-2-4-3-3-5 1-3 3-5 0-6-3-2-4 0-5 0-2 0-6-6-5-9 2-3 4-3 1-7l-5-4-1-1v-5c2-7 4-12 0-13-5-1-12-2-13-4l-4-8-7-7c-2-1 1-4 5-4s-1-6 1-8c3-3 9-5 12-5 4 0 6-5 5-10-1-4-3-12-7-11-3 1-6 4-8 3s-9-1-11 1l-6 4-7 6-10 6c-3 2-9 5-7 11 1 7 6 11 7 14 0 3-1 8 3 13 4 4 9 5 12 11l1 1c3 6 8 13 11 14 3 2 8 5 6 6-1 1-6 2-7 4Zm499 274c-2 2-5 2-7 2-4-1-7 0-7-6 1-7 3-9 3-10l-1-7-6-13c-1-2-4-8-6-9l-2-1c-3 0-7-1-10-4-4-5-7-9-7-13l-2-9c-1-3-3-7-4-6-2 2-3 1-4 0-2-2-5-4-5-1 0 2 1 4-1 5l-1 2v1l-3 4c-1 1-4 3-6 2h-7c-1-1-2-3-5-2l-8 4c-2 1-4 3-4 6s2 6-5 11c-6 4-9 2-11 5l-5 7c-2 3-1 5-4 6l-8 8c-3 2-6 2-7 5l-4 7c-1 2-6 1-12 8l-4 4h153v-6ZM261-1c0 1 0 3 3 3l3-3h-6Zm-46 0-2 1c-2 1-3 0-3-1h-95l15 9c13 9 18 11 21 12l6 6c1 2 7 10-1 18-7 9-12 12-21 11l-15-2c-4-1-5-1-7-3-3-2-4-1-7-1s-3-2-4-3c-1-2-5-3-5 0 0 2-1 5 2 7 2 1 12 3 11 10s1 11 2 12c2 2 0 7 2 10 2 2 7 2 12 6 4 4 14 7 15 1 2-6-2-5-6-6s-5-2-7-4-3-4-2-5c2-2 1-4 2-6h5l6 4c3 1 6 0 9 3 2 2 1 5 4 5s10-4 5-11-5-10 0-15c5-6 8-13 12-13l12 2c3 1 8 2 7-5s0-8-4-10c-4-3-4-4-4-11s0-13-4-14c-4-2-7-6-1-4h12c5-1 6 0 7 3s2 2 4 5c2 2 6 4 3 6l-6 2c-1 0-2 0-3 2 0 2-2 2-1 4l5 6c2 3 5 4 7 4 3 0 7 1 9-2l2-11c-1-2 0-4 5-3 4 0 3-2 1-4-1-2 1-2 2-1 1 2 2-1 4-3l6-7c1-1 2-3 5-4h-22Zm-38 501v-1l-1-2v-8l-1-2v-3c0-1 4-4-1-3-5 2-6 0-8-1-2 0-4 0-6 3-1 3-1 4-6 5s-11 2-15-2c-3-3-7-5-11-6-3 0-2 4-6 8s-15 2-17-2c-3-5-11-6-15-7-3-1-3-9-5-11-1-2-4-2-5-3s-1-5 2-6c3-2 2-10-1-11s-6-4-4-8 2-7-3-8l-3-1h-1c-4-1-7-2-8-1-1 2-4-1-5 0l-4 3c0 2 4 3 4 4 1 2-3 1-4 1 0 0 4 2 2 3-3 2-4-1-5-1 0 0 2 3-1 3-2 0 0-3-4-4s-6 1-4 4c1 3 5 6 5 10 1 5 2 3 4 3 3 0 6-1 7 3 0 5 2 5 4 7 1 1 4 4 1 4s-5-2-6-4c-1-1-2 0-1 2 0 2 3 5 0 4s-8-4-8-2c-1 2 0 3 2 4 3 1 0 2-2 3-1 1 0 3 1 4s2 3 0 4c-2 0-5-6-5-2 0 3-1 6-3 4s-6-5-7-9-5-5-6-8c0-2 2-1 1-5 0-3-1-4-4-5-2-1-1-3-3-6-3-3-7-2-9-5l-2-4 1-1c1-1-1-1-2-4-2-3-2-13-2-16l-1-5v-1l-2-2-5-5v25l1 5-1 4v104c5 7 13 9 18 7 5-3 5-10 3-13-1-3 1-6 3-13 3-6 23-4 27-3 3 2 2 3 4 6s16 1 17 3 4 4 7 5h3c4 1 8 0 19 3 11 4 16 3 21-1 5-3 4-2 8-2 4-1 9 0 11 2s3 1 7 1h8c4 0 7-3 8-3v1l3-5 2-4c1-4 0-7 2-9l3-5v-1l1-2 4-13-1-3Zm-95 1c-1 2-4 2-8 2l-6 3c-2 0-4-4-6-4h-7c-1 0-3-4-1-5 4-2 5-1 7 0s1-3 7-1l9 3c3 0 7 0 5 2Zm80-3c-2 1-2 4-2 5 0 2-3 1-5 1-2 1-4 3-7 3l-7-2c-2-2 0-4 3-5 3 0 3-2 7-3l2 1c2 1 3 0 6-1l5-3c1 1-1 2-2 4Z" fill="#1B253A"></path></g><defs><clipPath id="a1"><path fill="#fff" d="M0 0h804v715H0z"></path></clipPath></defs></svg>`;
});
const css$e = {
  code: "svg.svelte-19wwb5g{bottom:0;display:block;left:0;max-width:none;pointer-events:none;position:absolute;right:0;top:0}",
  map: null
};
const Grid = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$e);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 9 8" class="svelte-19wwb5g">${each(new Array(10), (_, x) => {
    return `<path d="${"M " + escape(x, true) + " 0 L " + escape(x, true) + " 8"}" stroke="white" stroke-width="0.01" stroke-dasharray="0.02 0.02"></path>`;
  })}${each(new Array(9), (_, y) => {
    return `<path d="${"M 0 " + escape(y, true) + " L 9 " + escape(y, true)}" stroke="white" stroke-width="0.01" stroke-dasharray="0.02 0.02"></path>`;
  })}</svg>`;
});
const TOTAL_ROUNDS = 12;
const COLUMN_COUNT = 9;
const ROW_COUNT = 8;
const NEW_GLOBAL_ATTACK_ROUNDS = [0, 3, 6, 9];
const ATTACKER_REVEAL_ROUNDS = [4, 9];
const css$d = {
  code: `.dimming.svelte-1cd2eas{background:var(--color-bg);bottom:0;left:0;pointer-events:none;position:absolute;right:0;top:0;transition:opacity .5s ease-out;z-index:var(--layer-5)}.dimming.has-mask.svelte-1cd2eas{-webkit-mask:var(--mask) center /contain no-repeat,url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 9 8"><rect width="9" height="8" /></svg>') center /contain no-repeat;-webkit-mask-composite:xor;mask:var(--mask) center /contain no-repeat exclude,url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 9 8"><rect width="9" height="8" /></svg>') center /contain no-repeat}.dimming.dim-full.svelte-1cd2eas{opacity:.8}.dimming.dim-semi.svelte-1cd2eas{opacity:.3}.dimming.dim-none.svelte-1cd2eas{opacity:0}`,
  map: null
};
const Dimming = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $dim, $$unsubscribe_dim;
  let $mask, $$unsubscribe_mask;
  const { machine: machine2 } = getGameContext();
  const dim = useSelector(machine2.service, (state) => {
    if (state.matches("Playing.Gameloop.Playing.Moving") || state.matches("Playing.Gameloop.Playing.Placing")) {
      return "full";
    }
    const { context } = state;
    const gameState = GameState.fromContext(context);
    if (gameState.activeSide !== getCurrentUser(context).side)
      return "semi";
    return "none";
  });
  $$unsubscribe_dim = subscribe(dim, (value) => $dim = value);
  const mask = useSelector(machine2.service, (state) => {
    const moving = state.matches("Playing.Gameloop.Playing.Moving");
    const placing = state.matches("Playing.Gameloop.Playing.Placing");
    if (!moving && !placing) {
      return void 0;
    }
    const undimmedSquares = [];
    const gameState = GameState.fromContext(state.context);
    for (let x = 0; x < COLUMN_COUNT; x++) {
      for (let y = 0; y < ROW_COUNT; y++) {
        if (moving && (gameState.isValidMove([x, y]) || isEqual(GameState.fromContext(state.context).activePlayerPosition, [x, y])) || placing && gameState.isValidPlacement([x, y])) {
          undimmedSquares.push([x, y]);
        }
      }
    }
    return `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 9 8">${undimmedSquares.map(([x, y]) => `<rect x="${x}" y="${y}" width="1" height="1" />`).join("")}</svg>')`;
  });
  $$unsubscribe_mask = subscribe(mask, (value) => $mask = value);
  $$result.css.add(css$d);
  $$unsubscribe_dim();
  $$unsubscribe_mask();
  return `<div class="${[
    "dimming dim-" + escape($dim, true) + " svelte-1cd2eas",
    $dim === "full" ? "has-mask" : ""
  ].join(" ").trim()}"${add_styles({ "--mask": $mask })}></div>`;
});
const css$c = {
  code: "svg.svelte-10fuvom{bottom:0;left:0;pointer-events:none;position:absolute;right:0;top:0}path.svelte-10fuvom{stroke:#000;stroke-width:1;fill:none;stroke-dasharray:8 2}",
  map: null
};
const squareSize = 54;
const StageLines = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const width = squareSize * 9;
  const height = squareSize * 8;
  const exitHorizontally = [[4, 5], [5, 7], [7, 4]];
  const getShortestPath = (points) => {
    const path = [];
    let prevPoint = void 0;
    for (const point of points) {
      if (prevPoint) {
        if (exitHorizontally.filter((coordinate) => isEqual(coordinate, prevPoint)).length > 0) {
          path.push([point[0], prevPoint[1]]);
        } else {
          path.push([prevPoint[0], point[1]]);
        }
      }
      path.push(point);
      prevPoint = point;
    }
    return path;
  };
  const getPosition = (coordinate) => {
    const [x, y] = coordinate;
    const xPosition = x * squareSize + squareSize / 2;
    const yPosition = y * squareSize + squareSize / 2;
    return [xPosition, yPosition];
  };
  const toSvgPath = (points) => {
    const path = getShortestPath(points).map((coordinate, index) => {
      const [x, y] = getPosition(coordinate);
      if (index === 0) {
        return `M ${x} ${y}`;
      }
      return `L ${x} ${y}`;
    });
    return path.join(" ");
  };
  $$result.css.add(css$c);
  return `<svg viewBox="${"0 0 " + escape(width, true) + " " + escape(height, true)}" xmlns="http://www.w3.org/2000/svg" class="svelte-10fuvom">${each(BOARD_SUPPLY_CHAINS, (chain) => {
    return `<path${add_attribute("d", toSvgPath(chain.map((stage) => stage.coordinate)), 0)} class="svelte-10fuvom"></path>`;
  })}</svg>`;
});
const css$b = {
  code: ".item.svelte-1i6kpfj.svelte-1i6kpfj{height:1.5rem;position:absolute;width:1.5rem}.item.svelte-1i6kpfj.svelte-1i6kpfj:first-child,.item.svelte-1i6kpfj:first-child .icon.svelte-1i6kpfj{left:.25rem;top:.25rem}.item.svelte-1i6kpfj.svelte-1i6kpfj:nth-child(2),.item.svelte-1i6kpfj:nth-child(2) .icon.svelte-1i6kpfj{bottom:.25rem;right:.25rem}.item.svelte-1i6kpfj svg.svelte-1i6kpfj{height:100%;position:absolute;width:100%}.item.svelte-1i6kpfj .icon.svelte-1i6kpfj{position:relative}.item.svelte-1i6kpfj .icon.svelte-1i6kpfj svg{height:100%;width:100%}",
  map: null
};
const Items = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { coordinate } = $$props;
  const items = BOARD_ITEMS.filter((item) => isEqual(item.position, coordinate));
  if ($$props.coordinate === void 0 && $$bindings.coordinate && coordinate !== void 0)
    $$bindings.coordinate(coordinate);
  $$result.css.add(css$b);
  return `${each(items, (item) => {
    return `<div class="item svelte-1i6kpfj">${isAttackItemId(item.id) ? `<svg viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg" class="svelte-1i6kpfj"><path d="M21.3571 26L6.61664 0L4.64282 26H21.3571Z" fill="#51514F"></path><path d="M21.357 10.7388L6.61658 0L21.357 26V10.7388Z" fill="#292521"></path></svg>` : `<svg viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg" class="svelte-1i6kpfj"><path d="M6.9792 26L17.8865 17.8076L5 0L6.9792 26Z" fill="#9C9A9F"></path><path d="M17.8741 17.814L22 2.25865L5 0L17.8741 17.814Z" fill="#7D797D"></path></svg>`} <div class="icon svelte-1i6kpfj">${validate_component(Item, "Item").$$render($$result, { itemId: item.id }, {}, {})}</div> </div>`;
  })}`;
});
const css$a = {
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
  $$result.css.add(css$a);
  return `<div class="${[
    "player side-" + escape(side, true) + " svelte-9z74xo",
    isPlaying ? "playing" : ""
  ].join(" ").trim()}"><div class="face svelte-9z74xo">${validate_component(Face, "Face").$$render($$result, { faceId: faceId ?? 0 }, {}, {})}</div> <div class="name svelte-9z74xo">${escape(name)}</div> ${isConnected !== void 0 ? `<div class="${["online-status svelte-9z74xo", isConnected ? "connected" : ""].join(" ").trim()}"></div>` : ``} </div>`;
});
const css$9 = {
  code: ".player.svelte-1y4x7zc{left:50%;position:absolute;top:50%;translate:-50% -50%}.player.svelte-1y4x7zc svg{height:100%;width:100%}",
  map: null
};
const Players$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $players, $$unsubscribe_players;
  let { coordinate } = $$props;
  const { machine: machine2 } = getGameContext();
  const players = useSelector(
    machine2.service,
    ({ context }) => {
      const gameState = GameState.fromContext(context);
      const currentUser = getCurrentUser(context);
      const { playerPositions } = gameState;
      return objectEntries(playerPositions).filter(([_, position]) => isEqual(position, coordinate)).map(([playerId]) => getPlayer(playerId, context)).filter((player) => getPlayerSide(player.id) === currentUser.side).filter((player) => gameState.isPlaced(player.id)).map((player) => {
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
  if ($$props.coordinate === void 0 && $$bindings.coordinate && coordinate !== void 0)
    $$bindings.coordinate(coordinate);
  $$result.css.add(css$9);
  $$unsubscribe_players();
  return `${each($players, (player) => {
    return `<div class="player svelte-1y4x7zc">${validate_component(Player, "Player").$$render(
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
  })}`;
});
const css$8 = {
  code: "svg.svelte-1j9izwh{display:block;height:100%;width:100%}",
  map: null
};
const Stage = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { stageId } = $$props;
  if ($$props.stageId === void 0 && $$bindings.stageId && stageId !== void 0)
    $$bindings.stageId(stageId);
  $$result.css.add(css$8);
  return `${stageId === "supply" ? `<svg width="90" height="90" viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg" class="svelte-1j9izwh"><g clip-path="url(#clip0_15_8389)"><rect opacity="0.75" x="12" y="12" width="66" height="66" fill="white"></rect><path fill-rule="evenodd" clip-rule="evenodd" d="M54.3129 38.2904C55.0888 39.132 59.3859 43.8164 60.166 45.4099L60.1576 45.4034C60.1723 45.4355 60.1787 45.4697 60.1787 45.506C60.1745 45.6683 60.1133 47.1059 59.8624 47.6271C59.8118 47.7317 59.7106 47.798 59.5967 47.8044H59.582C59.4829 47.8044 59.3901 47.7552 59.3311 47.6762C59.33 47.6751 59.3284 47.6746 59.327 47.674C59.3258 47.6735 59.3247 47.673 59.3247 47.6719C55.4831 42.7056 53.6213 41.424 53.6024 41.4112C53.601 41.4104 53.5965 41.4072 53.5884 41.4015C53.5068 41.3438 53.0653 41.0317 51.943 40.4136C51.9367 40.4093 51.9304 40.4051 51.9219 40.4008C50.9902 41.4857 47.6431 45.105 44.8582 48.0823C44.824 48.036 44.7904 47.9904 44.7571 47.9453C44.706 47.8759 44.6558 47.8077 44.6055 47.7403C47.3276 44.831 50.583 41.3193 51.5698 40.1744C51.4686 40.0996 51.3716 40.0227 51.2788 39.9415L51.1913 40.0372C50.3194 40.9902 47.157 44.4466 46.1995 45.5401C46.1574 45.5893 46.1005 45.6128 46.0414 45.6128C45.9929 45.6128 45.9423 45.5957 45.9023 45.5594C45.8158 45.4825 45.8074 45.3458 45.8854 45.2582C46.8258 44.1844 49.8899 40.835 50.8311 39.8063C50.8859 39.7464 50.9335 39.6943 50.9731 39.651C50.7053 39.3734 50.4839 39.0893 50.3153 38.8436C49.5183 39.7173 46.2312 43.3272 43.5492 46.2985C43.9087 46.7925 44.3561 47.4055 44.8582 48.0823C44.8576 48.0829 44.857 48.0836 44.8565 48.0842C46.6655 50.5257 49.1598 53.7832 50.6526 55.287C53.0542 57.705 53.0584 58.3544 53.0605 58.7047V58.7688C53.1069 59.2131 52.4174 59.8475 51.7722 60.1209C51.6795 60.1615 51.5825 60.1786 51.4834 60.1786C50.2267 60.1786 48.5357 57.2628 48.4598 57.1283C47.8587 56.0837 44.6106 51.6353 43.2514 49.7935C42.0351 51.0856 41.1118 52.0573 40.8525 52.3115C40.0702 53.0783 35.4885 58.2775 35.4422 58.3309C35.4126 58.3672 34.6346 59.2814 33.7322 59.3412C33.7006 59.3455 33.6689 59.3455 33.6373 59.3455C33.2978 59.3455 32.9858 59.2195 32.7138 58.9717C32.29 58.5851 32.0834 58.1514 32.1023 57.6858C32.1361 56.8079 32.9668 56.1542 33.0027 56.1265C33.0039 56.1254 33.0096 56.1205 33.0195 56.1122C33.3377 55.8425 38.0081 51.8849 39.9732 49.6371C40.3549 49.2035 40.9474 48.5392 41.6558 47.7488C41.7465 47.8599 41.8371 47.971 41.9257 48.0799C41.4347 47.4752 40.8706 46.7899 40.6032 46.465C40.525 46.3699 40.4721 46.3057 40.454 46.2835C40.3675 46.2087 40.2853 46.1254 40.2115 46.0272C39.9184 45.6405 38.9064 44.0278 38.0335 42.6287C38.0524 42.6949 38.0419 42.7697 37.9955 42.8252C37.9723 42.8509 35.7605 45.4953 35.3958 46.1916C35.3705 46.2408 35.3262 46.2771 35.2735 46.2942L35.2629 46.3049C35.2524 46.3155 35.2418 46.3241 35.2292 46.3305C35.0943 46.4138 34.9424 46.4544 34.7927 46.4544C34.5439 46.4544 34.2994 46.3433 34.1349 46.1318C33.068 44.7605 30.5547 41.5009 30.2553 40.8536L30.2406 40.8237L30.24 40.8224C29.8862 40.0565 29.7388 39.7375 29.8674 37.7948L29.9074 37.186C30.1246 33.7854 30.2933 32.1108 30.6623 31.7968L30.6876 31.7775L31.2421 31.4336C31.3665 31.3311 31.6807 31.1666 34.0463 32.0125C35.1406 32.4034 36.4584 32.9481 36.6777 33.1361C37.0066 33.418 39.9437 36.5367 40.8546 37.9443C41.0233 38.2028 40.998 38.5467 40.7955 38.7774C40.4434 39.179 39.8004 39.9757 39.3449 40.89C40.0028 41.6632 41.5124 43.5152 42.1534 44.3055L42.1998 44.3632C42.226 44.3935 42.2514 44.4253 42.277 44.4573C42.2947 44.4794 42.3124 44.5016 42.3305 44.5234C42.3706 44.5747 42.4127 44.6259 42.4549 44.6772C42.4823 44.7114 42.5076 44.7455 42.5308 44.7819C42.5534 44.813 42.566 44.8422 42.5802 44.8752L42.5814 44.878L42.6067 44.9356C42.6236 44.9741 42.6426 45.019 42.6594 45.0681C42.665 45.0759 42.672 45.0857 42.6804 45.0973C42.7629 45.2128 42.9777 45.5131 43.2899 45.9439C45.8748 43.083 48.9961 39.6544 49.9152 38.6449C49.9774 38.5766 50.0295 38.5193 50.0707 38.4741C49.8704 38.1558 49.6406 37.8717 49.3812 37.6303C47.0598 35.4644 40.901 30.5493 40.8335 30.4959C40.7892 30.466 40.6901 30.3848 40.6606 30.2524C40.6395 30.1627 40.6564 30.0708 40.7091 29.9897C40.8314 29.7974 41.0696 29.791 41.2404 29.8658C41.2931 29.8893 46.3197 32.1962 52.1939 36.2077C52.3816 36.0197 52.5292 35.8873 52.5418 35.8766H52.5439L52.5502 35.8702C52.9551 35.5178 53.7289 36.2077 54.043 36.5217C54.5259 37.045 54.7304 37.4424 54.6798 37.7435C54.6608 37.861 54.6039 37.9422 54.5449 37.9935C54.4732 38.0981 54.3952 38.1985 54.3129 38.2904ZM44.8582 48.0823C44.8597 48.0844 44.8613 48.0864 44.8628 48.0885C44.8613 48.0864 44.8597 48.0844 44.8582 48.0823ZM52.8138 36.2056H52.8117C52.7864 36.2419 52.7801 36.4341 53.1385 36.8037L53.1448 36.8101C53.5771 37.2907 54.1253 37.7051 54.2644 37.6752C54.2686 37.6389 54.2771 37.4039 53.7415 36.8208C53.3768 36.4555 52.974 36.2013 52.837 36.2013C52.8286 36.2013 52.8201 36.2034 52.8138 36.2056ZM52.449 36.5516C52.2825 36.7182 52.0927 36.9254 51.9536 37.1177L51.9514 37.1198C51.9373 37.1362 51.9425 37.1625 51.9448 37.174L51.9451 37.1753C52.021 37.4637 52.3057 38.1836 53.3156 38.6022C53.4569 38.5061 53.731 38.2968 53.9735 38.0319C53.5497 37.8546 53.0753 37.3676 52.8349 37.1006C52.6472 36.9062 52.5207 36.7225 52.449 36.5516ZM30.6433 40.6763C30.8373 41.0972 32.2689 43.0388 34.4723 45.8712H34.4702C34.5735 46.0015 34.7358 46.0549 34.8897 46.0208C34.1476 45.0702 31.1535 41.2146 30.8267 40.5076L30.812 40.4777L30.8109 40.4755C30.4575 39.7081 30.3103 39.3886 30.4388 37.4466L30.4788 36.8379C30.6285 34.469 30.7571 32.9417 30.9448 32.1236L30.9321 32.1321C30.6349 32.4803 30.4303 35.6758 30.3333 37.2159L30.2933 37.8268C30.1731 39.6617 30.287 39.9095 30.6285 40.6464L30.6433 40.6763ZM37.6815 42.5542L37.6835 42.5518H37.6813C37.7551 42.4621 37.8859 42.4514 37.9744 42.524C37.9151 42.4283 37.8557 42.3333 37.7975 42.2402C37.7545 42.1712 37.7121 42.1034 37.6708 42.037C37.593 41.9128 37.5184 41.7934 37.4477 41.6805C37.1699 41.2364 36.9544 40.892 36.8569 40.7404C36.2602 39.8177 35.4485 38.442 34.9804 37.1326C34.9361 37.0087 34.9973 36.8464 35.1153 36.7695C35.2313 36.6926 35.4337 36.6627 35.731 36.9511C35.9714 37.1839 37.1859 38.4655 37.5422 38.8692C37.7783 39.1341 38.0145 39.3968 38.2527 39.6596C38.5163 39.9501 38.7841 40.2491 39.0497 40.5503C39.522 39.6574 40.1377 38.8927 40.4856 38.4976C40.5636 38.41 40.5742 38.284 40.5088 38.1836C39.6148 36.8037 36.7325 33.7448 36.412 33.4693C36.2919 33.3668 35.2714 32.9118 34.0084 32.4547C32.3301 31.848 31.6448 31.7519 31.4993 31.7861C31.202 32.1492 30.9996 35.3298 30.9026 36.8656L30.8626 37.4765C30.7424 39.3114 30.8562 39.5592 31.1978 40.2961L31.2105 40.326C31.474 40.8964 33.8334 43.9766 35.1976 45.7239C35.8257 44.7715 37.5765 42.6796 37.6815 42.5542ZM37.2112 40.5076C37.3356 40.6977 37.6455 41.1933 38.0292 41.8106L38.025 41.8127C38.0703 41.8852 38.1168 41.9596 38.1642 42.0356C39.038 43.4348 40.2451 45.3678 40.5531 45.773C40.6121 45.8499 40.6754 45.9118 40.7428 45.9674C41.1751 46.181 41.5209 46.2173 41.7739 46.0763C41.8203 46.0507 41.8603 46.0186 41.8983 45.9844C41.9278 45.9545 41.9552 45.9246 41.9805 45.8969C42.1787 45.6512 42.242 45.3073 42.2588 45.192C42.2504 45.1706 42.242 45.1493 42.2293 45.1236L42.2019 45.0659C42.1976 45.0563 42.1947 45.0492 42.1923 45.0434C42.1889 45.0351 42.1866 45.0295 42.1829 45.0232C42.1796 45.0184 42.1763 45.0135 42.173 45.0086C42.1614 44.9915 42.1496 44.9741 42.1365 44.9591C42.1103 44.9288 42.0849 44.897 42.0593 44.865C42.0416 44.8429 42.0239 44.8208 42.0058 44.7989C41.9657 44.7477 41.9236 44.6964 41.8814 44.6451L41.8308 44.5832C41.1582 43.7565 39.5326 41.7593 38.938 41.0672C38.6303 40.709 38.3074 40.3526 37.9946 40.0072C37.9773 39.9881 37.96 39.9691 37.9428 39.9501C37.8846 39.8854 37.8264 39.8208 37.7682 39.7563C37.5883 39.5566 37.4086 39.3573 37.2301 39.1555C36.878 38.7582 35.8301 37.6496 35.5054 37.3227C35.9693 38.4912 36.6777 39.6831 37.2112 40.5076ZM43.003 49.4493C41.7232 50.8099 40.766 51.8202 40.5699 52.0124C39.7793 52.7878 35.3283 57.8396 35.1364 58.0574C35.1301 58.066 34.4385 58.8734 33.7153 58.9204C33.4497 58.9396 33.2198 58.8521 33.0069 58.6577C32.6822 58.3608 32.5219 58.0425 32.5346 57.7093C32.5593 57.0481 33.2313 56.5009 33.2747 56.4656C33.2758 56.4648 33.2765 56.4642 33.2768 56.4639C33.2791 56.4619 33.2925 56.4505 33.3163 56.4303C33.7895 56.0282 38.3506 52.1526 40.3001 49.9233C40.6711 49.4983 41.2468 48.8532 41.9383 48.0842C42.2651 48.4879 42.5603 48.8574 42.7121 49.0582C42.7381 49.0933 42.7746 49.1423 42.8204 49.2038C42.8707 49.2713 42.9321 49.3538 43.003 49.4493ZM52.6515 58.8179C52.6472 58.7858 52.6472 58.7517 52.6472 58.7132H52.6451V58.713C52.643 58.4651 52.6381 57.8858 50.3617 55.5946C48.1414 53.3603 43.7622 47.328 42.5941 45.7025C42.5287 45.8648 42.4296 46.0229 42.2947 46.1767C42.263 46.2173 42.2272 46.2557 42.1871 46.292C42.1829 46.2963 42.1792 46.3006 42.1755 46.3049C42.1718 46.3091 42.1682 46.3134 42.1639 46.3177C41.9657 46.5099 41.698 46.6082 41.3669 46.6082C41.3524 46.6082 41.3379 46.6071 41.3232 46.6061C41.3079 46.605 41.2924 46.6039 41.2763 46.6039C41.8435 47.2939 42.7311 48.3832 43.0453 48.7976C43.5703 49.4897 48.1077 55.6522 48.8351 56.9189C49.6089 58.2646 51.0047 59.9906 51.6204 59.7321C52.2298 59.4758 52.6599 58.9589 52.6515 58.8179ZM52.1539 40.0462C53.4232 40.7447 53.8385 41.0587 53.8554 41.0715L53.8617 41.0694C53.8625 41.07 53.8636 41.0707 53.8651 41.0717C53.9468 41.1289 55.0207 41.8792 57.191 44.376C55.9934 42.6415 54.5491 40.7447 53.537 40.0526C53.3072 39.9608 51.6141 39.2409 50.9626 37.8183C50.9625 37.8182 50.9617 37.8167 50.9602 37.8139C50.9338 37.7627 50.6818 37.2751 50.1719 36.9105C50.1361 36.8827 47.686 35.0158 44.2513 32.711C46.1553 34.2682 48.4451 36.1735 49.6722 37.3185C49.9737 37.6004 50.2436 37.9336 50.4713 38.3075C50.7496 38.7646 51.34 39.5998 52.1539 40.0462ZM59.5618 47.2414C58.6968 45.8372 55.5967 40.9311 53.7479 39.6852C53.7352 39.6767 53.7204 39.6681 53.7057 39.6639C53.6888 39.6574 51.9514 38.9739 51.34 37.6367L51.339 37.6348C51.317 37.5898 51.0315 37.005 50.4165 36.5644C50.4153 36.5636 50.4112 36.5605 50.4041 36.5551C50.162 36.3713 46.4754 33.5733 41.8392 30.6241C43.4522 31.4187 47.4225 33.4693 51.8966 36.5217C51.7954 36.6349 51.6984 36.7524 51.6141 36.8678C51.5297 36.9852 51.5023 37.1369 51.5403 37.2843C51.631 37.6346 51.9725 38.5061 53.1575 38.9974C53.2102 39.0188 53.2671 39.0294 53.3219 39.0294C53.4126 39.0294 53.5033 39.0017 53.5792 38.9461C53.6909 38.865 53.847 38.7432 54.0135 38.5916C54.7852 39.4289 58.9579 43.9915 59.7633 45.5508C59.7465 45.9387 59.6856 46.7793 59.5618 47.2414ZM31.7144 37.1818C31.8282 37.2031 31.9041 37.3142 31.8851 37.4295L31.8873 37.4274C31.883 37.4424 31.6342 38.9654 32.4818 39.948C32.5577 40.0355 32.5493 40.1722 32.4608 40.2491C32.4207 40.2855 32.3701 40.3025 32.3216 40.3025C32.2626 40.3025 32.2056 40.279 32.1635 40.2299C31.183 39.0935 31.4571 37.4253 31.4698 37.3548C31.4909 37.2394 31.5984 37.1604 31.7144 37.1818ZM47.0303 42.7398C47.1083 42.6522 47.2411 42.6437 47.3276 42.7227H47.3297C47.4161 42.8017 47.4246 42.9363 47.3466 43.0239L44.7426 45.9759C44.7004 46.0229 44.6414 46.0464 44.5845 46.0464C44.5339 46.0464 44.4833 46.0293 44.4432 45.993C44.3568 45.914 44.3483 45.7794 44.4263 45.6918L47.0303 42.7398ZM41.9995 49.6307L42.0037 49.6264C42.088 49.5431 42.2209 49.5431 42.3031 49.6264C42.3853 49.7097 42.3853 49.8443 42.3031 49.9276L42.302 49.9287C42.2202 50.0116 38.4479 53.8325 37.5865 54.9409C37.5443 54.9944 37.4831 55.0221 37.4199 55.0221C37.3735 55.0221 37.3271 55.0072 37.2892 54.9773C37.1964 54.9046 37.1816 54.7701 37.2533 54.6782C38.1279 53.5526 41.7891 49.8438 41.9995 49.6307L41.9995 49.6307ZM36.4479 55.4942C35.9123 56.1286 34.8517 57.3761 34.6683 57.5619C34.5861 57.6452 34.5861 57.7798 34.6683 57.8631C34.7105 57.9058 34.7632 57.925 34.818 57.925C34.8728 57.925 34.9255 57.9037 34.9677 57.8631C35.2002 57.6275 36.5862 55.9877 36.7556 55.7873L36.7705 55.7697C36.8464 55.68 36.8358 55.5455 36.7473 55.4686C36.6587 55.3917 36.5259 55.4023 36.45 55.4921L36.4479 55.4942ZM42.5308 46.841C42.4612 46.747 42.3284 46.7299 42.2356 46.8004C42.1429 46.873 42.126 47.0055 42.1956 47.0995L44.9134 50.7051C44.9556 50.7607 45.0167 50.7884 45.0821 50.7884C45.1263 50.7884 45.1706 50.7735 45.2107 50.7436C45.3035 50.671 45.3203 50.5385 45.2507 50.4445L42.5329 46.8389L42.5308 46.841ZM47.2306 53.6679C47.1652 53.6679 47.1041 53.6401 47.0619 53.5846L47.064 53.5824L45.7505 51.8394C45.6809 51.7454 45.6978 51.613 45.7905 51.5403C45.8833 51.4699 46.0161 51.4869 46.0857 51.5809L47.3993 53.324C47.4689 53.4179 47.452 53.5504 47.3592 53.623C47.3192 53.6529 47.2749 53.6679 47.2306 53.6679ZM51.5572 59.2259C51.6246 59.2259 51.6879 59.2088 51.7448 59.1725C51.8439 59.1084 51.8713 58.9759 51.8081 58.8777C51.749 58.7837 51.6267 58.7517 51.5319 58.8029C51.302 58.7816 50.543 57.9058 49.8915 56.9104C49.8282 56.8121 49.6954 56.7844 49.5984 56.8506C49.5014 56.9147 49.474 57.0492 49.5393 57.1475C50.1824 58.1301 51.0195 59.2259 51.5572 59.2259Z" fill="black"></path><path d="M72.9552 81C72.1033 81 71.1648 80.9667 70.1532 80.8935C64.9617 80.5341 23.3898 79.9684 16.4012 80.7404C12.7073 81.1531 10.4443 80.7537 9.47922 79.5357C9.00666 78.9434 8.94011 78.2711 9.03994 77.7919L10.2513 14.223C10.1914 12.8652 11.0167 10.782 13.5459 10.5024C17.6126 10.0498 68.9485 8.78524 73.2481 9.0315C74.0335 9.07809 74.7257 9.09806 75.3447 9.11802C78.7058 9.23117 80.7358 9.29773 80.8689 13.3577C81.4413 31.0354 79.9571 76.1679 79.8972 77.9716C79.9105 78.2645 79.844 78.8302 79.3248 79.4026C78.3464 80.4742 76.2498 81 72.9552 81ZM34.5448 78.1647C49.081 78.1647 67.005 78.4775 70.3062 78.7038C76.2432 79.1164 77.5211 78.1114 77.7075 77.9184C77.7607 76.3942 79.2516 31.1019 78.6792 13.4309C78.6348 12.0954 77.5011 11.3898 75.2781 11.3144C74.6458 11.2944 73.9336 11.2678 73.1283 11.2212C68.8486 10.975 17.8322 12.2329 13.7922 12.6855C12.5409 12.8253 12.4344 13.7637 12.4477 14.1564V14.2296L11.223 78.1314L11.2097 78.178C11.3495 78.3177 12.2613 78.9833 16.155 78.5507C18.7574 78.2645 26.072 78.158 34.5382 78.158L34.5448 78.1647Z" fill="#171F1F"></path><path d="M26.4741 69.08C26.4474 69.096 26.4474 69.112 26.4741 69.128C26.7621 69.2453 26.9807 69.4187 27.1301 69.648C27.2794 69.8773 27.3541 70.1547 27.3541 70.48C27.3541 70.96 27.1994 71.3333 26.8901 71.6C26.5861 71.8667 26.1834 72 25.6821 72H23.7461C23.6927 72 23.6661 71.9733 23.6661 71.92V66.48C23.6661 66.4267 23.6927 66.4 23.7461 66.4H25.6261C26.1434 66.4 26.5487 66.528 26.8421 66.784C27.1407 67.04 27.2901 67.4 27.2901 67.864C27.2901 68.1573 27.2181 68.408 27.0741 68.616C26.9354 68.8187 26.7354 68.9733 26.4741 69.08ZM24.2661 66.896C24.2447 66.896 24.2341 66.9067 24.2341 66.928V68.848C24.2341 68.8693 24.2447 68.88 24.2661 68.88H25.6261C25.9621 68.88 26.2287 68.792 26.4261 68.616C26.6287 68.44 26.7301 68.2053 26.7301 67.912C26.7301 67.6027 26.6287 67.3573 26.4261 67.176C26.2287 66.9893 25.9621 66.896 25.6261 66.896H24.2661ZM25.6821 71.496C26.0181 71.496 26.2847 71.4 26.4821 71.208C26.6847 71.016 26.7861 70.7573 26.7861 70.432C26.7861 70.1067 26.6821 69.848 26.4741 69.656C26.2714 69.4587 25.9967 69.36 25.6501 69.36H24.2661C24.2447 69.36 24.2341 69.3707 24.2341 69.392V71.464C24.2341 71.4853 24.2447 71.496 24.2661 71.496H25.6821ZM31.6737 69.296C31.695 69.4453 31.7057 69.632 31.7057 69.856V70.112C31.7057 70.1653 31.679 70.192 31.6257 70.192H29.0417C29.0204 70.192 29.0097 70.2027 29.0097 70.224C29.0204 70.5173 29.0364 70.7067 29.0577 70.792C29.1164 71.032 29.2417 71.2213 29.4337 71.36C29.6257 71.4987 29.871 71.568 30.1697 71.568C30.3937 71.568 30.591 71.5173 30.7617 71.416C30.9324 71.3147 31.0657 71.1707 31.1617 70.984C31.1937 70.936 31.231 70.9253 31.2737 70.952L31.5857 71.136C31.6284 71.1627 31.639 71.2 31.6177 71.248C31.4844 71.504 31.2844 71.7067 31.0177 71.856C30.751 72 30.4444 72.072 30.0977 72.072C29.719 72.0667 29.4017 71.976 29.1457 71.8C28.8897 71.624 28.7057 71.3787 28.5937 71.064C28.4977 70.808 28.4497 70.44 28.4497 69.96C28.4497 69.736 28.4524 69.5547 28.4577 69.416C28.4684 69.272 28.4897 69.144 28.5217 69.032C28.6124 68.6853 28.7937 68.408 29.0657 68.2C29.343 67.992 29.6764 67.888 30.0657 67.888C30.551 67.888 30.9244 68.0107 31.1857 68.256C31.447 68.5013 31.6097 68.848 31.6737 69.296ZM30.0657 68.384C29.8044 68.384 29.5857 68.4533 29.4097 68.592C29.239 68.7253 29.127 68.9067 29.0737 69.136C29.0417 69.248 29.0204 69.4293 29.0097 69.68C29.0097 69.7013 29.0204 69.712 29.0417 69.712H31.1137C31.135 69.712 31.1457 69.7013 31.1457 69.68C31.135 69.44 31.119 69.2693 31.0977 69.168C31.039 68.928 30.919 68.7387 30.7377 68.6C30.5617 68.456 30.3377 68.384 30.0657 68.384ZM34.093 72.04C33.7943 72.04 33.5277 71.992 33.293 71.896C33.0637 71.8 32.885 71.672 32.757 71.512C32.6343 71.352 32.573 71.1733 32.573 70.976V70.88C32.573 70.8267 32.5997 70.8 32.653 70.8H33.037C33.0903 70.8 33.117 70.8267 33.117 70.88V70.944C33.117 71.12 33.2077 71.2747 33.389 71.408C33.5757 71.536 33.8077 71.6 34.085 71.6C34.3623 71.6 34.5863 71.5387 34.757 71.416C34.9277 71.288 35.013 71.128 35.013 70.936C35.013 70.8027 34.9677 70.6933 34.877 70.608C34.7917 70.5227 34.6877 70.456 34.565 70.408C34.4477 70.36 34.2637 70.2987 34.013 70.224C33.7143 70.1387 33.469 70.0533 33.277 69.968C33.085 69.8827 32.9223 69.7653 32.789 69.616C32.661 69.4613 32.597 69.2667 32.597 69.032C32.597 68.6907 32.7303 68.4187 32.997 68.216C33.2637 68.0133 33.6157 67.912 34.053 67.912C34.3463 67.912 34.605 67.96 34.829 68.056C35.0583 68.152 35.2343 68.2853 35.357 68.456C35.4797 68.6213 35.541 68.808 35.541 69.016V69.04C35.541 69.0933 35.5143 69.12 35.461 69.12H35.085C35.0317 69.12 35.005 69.0933 35.005 69.04V69.016C35.005 68.8347 34.917 68.6827 34.741 68.56C34.5703 68.4373 34.3383 68.376 34.045 68.376C33.773 68.376 33.5543 68.432 33.389 68.544C33.2237 68.6507 33.141 68.8 33.141 68.992C33.141 69.1733 33.221 69.312 33.381 69.408C33.541 69.504 33.789 69.6 34.125 69.696C34.4343 69.7867 34.685 69.872 34.877 69.952C35.069 70.032 35.2343 70.1493 35.373 70.304C35.5117 70.4533 35.581 70.6507 35.581 70.896C35.581 71.2427 35.445 71.52 35.173 71.728C34.901 71.936 34.541 72.04 34.093 72.04ZM38.1446 72.064C37.7606 72.064 37.4299 71.9653 37.1526 71.768C36.8806 71.5653 36.6939 71.2933 36.5926 70.952C36.5232 70.7173 36.4886 70.3867 36.4886 69.96C36.4886 69.576 36.5232 69.2507 36.5926 68.984C36.6886 68.6533 36.8752 68.3893 37.1526 68.192C37.4299 67.9893 37.7606 67.888 38.1446 67.888C38.5339 67.888 38.8699 67.9867 39.1526 68.184C39.4406 68.3813 39.6272 68.6267 39.7126 68.92C39.7392 69.016 39.7552 69.096 39.7606 69.16V69.176C39.7606 69.2133 39.7366 69.2373 39.6886 69.248L39.2886 69.304H39.2726C39.2352 69.304 39.2112 69.28 39.2006 69.232L39.1766 69.112C39.1286 68.9093 39.0112 68.7387 38.8246 68.6C38.6379 68.456 38.4112 68.384 38.1446 68.384C37.8779 68.384 37.6539 68.456 37.4726 68.6C37.2966 68.7387 37.1819 68.9253 37.1286 69.16C37.0806 69.3627 37.0566 69.632 37.0566 69.968C37.0566 70.32 37.0806 70.592 37.1286 70.784C37.1819 71.024 37.2966 71.216 37.4726 71.36C37.6539 71.4987 37.8779 71.568 38.1446 71.568C38.4059 71.568 38.6299 71.5013 38.8166 71.368C39.0086 71.2293 39.1286 71.0533 39.1766 70.84V70.808L39.1846 70.776C39.1899 70.7227 39.2219 70.7013 39.2806 70.712L39.6726 70.776C39.7259 70.7867 39.7499 70.816 39.7446 70.864L39.7126 71.024C39.6326 71.3333 39.4486 71.584 39.1606 71.776C38.8726 71.968 38.5339 72.064 38.1446 72.064ZM42.4528 67.896C42.8795 67.896 43.2181 68.0213 43.4688 68.272C43.7248 68.5227 43.8528 68.8587 43.8528 69.28V71.92C43.8528 71.9733 43.8261 72 43.7728 72H43.3648C43.3115 72 43.2848 71.9733 43.2848 71.92V69.392C43.2848 69.0987 43.1941 68.8587 43.0128 68.672C42.8368 68.4853 42.6075 68.392 42.3248 68.392C42.0315 68.392 41.7941 68.4827 41.6128 68.664C41.4315 68.8453 41.3408 69.0827 41.3408 69.376V71.92C41.3408 71.9733 41.3141 72 41.2608 72H40.8528C40.7995 72 40.7728 71.9733 40.7728 71.92V66.48C40.7728 66.4267 40.7995 66.4 40.8528 66.4H41.2608C41.3141 66.4 41.3408 66.4267 41.3408 66.48V68.376C41.3408 68.3867 41.3435 68.3947 41.3488 68.4C41.3595 68.4053 41.3675 68.4027 41.3728 68.392C41.6075 68.0613 41.9675 67.896 42.4528 67.896ZM46.4853 67.888C46.9653 67.888 47.336 68.0107 47.5973 68.256C47.8586 68.5013 47.9893 68.8267 47.9893 69.232V71.92C47.9893 71.9733 47.9626 72 47.9093 72H47.5013C47.448 72 47.4213 71.9733 47.4213 71.92V71.592C47.4213 71.5813 47.416 71.5733 47.4053 71.568C47.4 71.5627 47.392 71.5653 47.3813 71.576C47.248 71.736 47.0746 71.8587 46.8613 71.944C46.648 72.024 46.4106 72.064 46.1493 72.064C45.7706 72.064 45.4533 71.968 45.1973 71.776C44.9413 71.584 44.8133 71.2907 44.8133 70.896C44.8133 70.496 44.9573 70.1813 45.2453 69.952C45.5386 69.7173 45.944 69.6 46.4613 69.6H47.3893C47.4106 69.6 47.4213 69.5893 47.4213 69.568V69.264C47.4213 68.992 47.344 68.7787 47.1893 68.624C47.04 68.464 46.8053 68.384 46.4853 68.384C46.2293 68.384 46.0213 68.4347 45.8613 68.536C45.7013 68.632 45.6026 68.768 45.5653 68.944C45.5493 68.9973 45.5173 69.0213 45.4693 69.016L45.0373 68.96C44.9786 68.9493 44.9546 68.928 44.9653 68.896C45.008 68.5973 45.168 68.3547 45.4453 68.168C45.7226 67.9813 46.0693 67.888 46.4853 67.888ZM46.2613 71.576C46.576 71.576 46.848 71.4987 47.0773 71.344C47.3066 71.184 47.4213 70.9707 47.4213 70.704V70.08C47.4213 70.0587 47.4106 70.048 47.3893 70.048H46.5493C46.1973 70.048 45.9146 70.12 45.7013 70.264C45.488 70.408 45.3813 70.608 45.3813 70.864C45.3813 71.0987 45.4613 71.2773 45.6213 71.4C45.7866 71.5173 46 71.576 46.2613 71.576ZM50.74 66.896C50.4467 66.896 50.2467 66.9627 50.14 67.096C50.0333 67.224 49.98 67.4453 49.98 67.76V67.92C49.98 67.9413 49.9907 67.952 50.012 67.952H50.908C50.9613 67.952 50.988 67.9787 50.988 68.032V68.392C50.988 68.4453 50.9613 68.472 50.908 68.472H50.012C49.9907 68.472 49.98 68.4827 49.98 68.504V71.92C49.98 71.9733 49.9533 72 49.9 72H49.5C49.4467 72 49.42 71.9733 49.42 71.92V68.504C49.42 68.4827 49.4093 68.472 49.388 68.472H48.852C48.7987 68.472 48.772 68.4453 48.772 68.392V68.032C48.772 67.9787 48.7987 67.952 48.852 67.952H49.388C49.4093 67.952 49.42 67.9413 49.42 67.92V67.728C49.42 67.3973 49.4573 67.1387 49.532 66.952C49.6067 66.76 49.7347 66.6213 49.916 66.536C50.1027 66.4453 50.3613 66.4 50.692 66.4H50.924C50.9773 66.4 51.004 66.4267 51.004 66.48V66.816C51.004 66.8693 50.9773 66.896 50.924 66.896H50.74ZM53.5916 66.896C53.2982 66.896 53.0982 66.9627 52.9916 67.096C52.8849 67.224 52.8316 67.4453 52.8316 67.76V67.92C52.8316 67.9413 52.8422 67.952 52.8636 67.952H53.7596C53.8129 67.952 53.8396 67.9787 53.8396 68.032V68.392C53.8396 68.4453 53.8129 68.472 53.7596 68.472H52.8636C52.8422 68.472 52.8316 68.4827 52.8316 68.504V71.92C52.8316 71.9733 52.8049 72 52.7516 72H52.3516C52.2982 72 52.2716 71.9733 52.2716 71.92V68.504C52.2716 68.4827 52.2609 68.472 52.2396 68.472H51.7036C51.6502 68.472 51.6236 68.4453 51.6236 68.392V68.032C51.6236 67.9787 51.6502 67.952 51.7036 67.952H52.2396C52.2609 67.952 52.2716 67.9413 52.2716 67.92V67.728C52.2716 67.3973 52.3089 67.1387 52.3836 66.952C52.4582 66.76 52.5862 66.6213 52.7676 66.536C52.9542 66.4453 53.2129 66.4 53.5436 66.4H53.7756C53.8289 66.4 53.8556 66.4267 53.8556 66.48V66.816C53.8556 66.8693 53.8289 66.896 53.7756 66.896H53.5916ZM57.2911 68.032C57.2911 67.9787 57.3178 67.952 57.3711 67.952H57.7791C57.8325 67.952 57.8591 67.9787 57.8591 68.032V71.92C57.8591 71.9733 57.8325 72 57.7791 72H57.3711C57.3178 72 57.2911 71.9733 57.2911 71.92V71.576C57.2911 71.5653 57.2858 71.5573 57.2751 71.552C57.2645 71.5467 57.2565 71.5493 57.2511 71.56C57.0271 71.8907 56.6725 72.056 56.1871 72.056C55.9311 72.056 55.6938 72.0053 55.4751 71.904C55.2618 71.7973 55.0911 71.6453 54.9631 71.448C54.8405 71.2507 54.7791 71.0133 54.7791 70.736V68.032C54.7791 67.9787 54.8058 67.952 54.8591 67.952H55.2671C55.3205 67.952 55.3471 67.9787 55.3471 68.032V70.568C55.3471 70.872 55.4325 71.1147 55.6031 71.296C55.7738 71.472 56.0058 71.56 56.2991 71.56C56.6031 71.56 56.8431 71.4693 57.0191 71.288C57.2005 71.1067 57.2911 70.8667 57.2911 70.568V68.032ZM60.8122 67.896C61.2389 67.896 61.5775 68.0213 61.8282 68.272C62.0842 68.5227 62.2122 68.8587 62.2122 69.28V71.92C62.2122 71.9733 62.1855 72 62.1322 72H61.7242C61.6709 72 61.6442 71.9733 61.6442 71.92V69.392C61.6442 69.0987 61.5535 68.8587 61.3722 68.672C61.1962 68.4853 60.9669 68.392 60.6842 68.392C60.3909 68.392 60.1535 68.4827 59.9722 68.664C59.7909 68.8453 59.7002 69.0827 59.7002 69.376V71.92C59.7002 71.9733 59.6735 72 59.6202 72H59.2122C59.1589 72 59.1322 71.9733 59.1322 71.92V68.032C59.1322 67.9787 59.1589 67.952 59.2122 67.952H59.6202C59.6735 67.952 59.7002 67.9787 59.7002 68.032V68.376C59.7002 68.3867 59.7029 68.3947 59.7082 68.4C59.7189 68.4053 59.7269 68.4027 59.7322 68.392C59.9669 68.0613 60.3269 67.896 60.8122 67.896ZM65.9407 68.032C65.9407 67.9787 65.9674 67.952 66.0207 67.952H66.4287C66.482 67.952 66.5087 67.9787 66.5087 68.032V71.864C66.5087 72.4613 66.3354 72.8987 65.9887 73.176C65.6474 73.4533 65.1754 73.592 64.5727 73.592C64.45 73.592 64.3567 73.5893 64.2927 73.584C64.2394 73.5787 64.2127 73.5493 64.2127 73.496L64.2287 73.128C64.2287 73.1013 64.2367 73.08 64.2527 73.064C64.2687 73.0533 64.2874 73.0507 64.3087 73.056L64.5247 73.064C65.0207 73.064 65.3807 72.9653 65.6047 72.768C65.8287 72.576 65.9407 72.2693 65.9407 71.848V71.552C65.9407 71.5413 65.9354 71.536 65.9247 71.536C65.9194 71.5307 65.9114 71.5333 65.9007 71.544C65.6554 71.864 65.306 72.024 64.8527 72.024C64.506 72.024 64.1967 71.9307 63.9247 71.744C63.658 71.5573 63.4794 71.2933 63.3887 70.952C63.3247 70.7333 63.2927 70.408 63.2927 69.976C63.2927 69.7413 63.298 69.544 63.3087 69.384C63.3247 69.224 63.354 69.08 63.3967 68.952C63.4927 68.632 63.666 68.376 63.9167 68.184C64.1674 67.9867 64.4687 67.888 64.8207 67.888C65.2954 67.888 65.6554 68.0453 65.9007 68.36C65.9114 68.3707 65.9194 68.3733 65.9247 68.368C65.9354 68.3627 65.9407 68.3547 65.9407 68.344V68.032ZM65.9007 70.776C65.9167 70.696 65.9274 70.5973 65.9327 70.48C65.938 70.3627 65.9407 70.192 65.9407 69.968C65.9407 69.696 65.938 69.5147 65.9327 69.424C65.9274 69.328 65.914 69.24 65.8927 69.16C65.85 68.936 65.7434 68.752 65.5727 68.608C65.4074 68.4587 65.1967 68.384 64.9407 68.384C64.69 68.384 64.4767 68.456 64.3007 68.6C64.13 68.744 64.01 68.9307 63.9407 69.16C63.8874 69.3307 63.8607 69.5973 63.8607 69.96C63.8607 70.3493 63.8874 70.6187 63.9407 70.768C63.994 70.992 64.1087 71.1787 64.2847 71.328C64.466 71.472 64.6847 71.544 64.9407 71.544C65.202 71.544 65.4154 71.472 65.5807 71.328C65.7514 71.184 65.858 71 65.9007 70.776Z" fill="black"></path></g><defs><clipPath id="clip0_15_8389"><rect width="90" height="90" fill="white"></rect></clipPath></defs></svg>` : `${stageId === "datacenter" ? `<svg width="90" height="90" viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg" class="svelte-1j9izwh"><g clip-path="url(#clip0_15_8729)"><rect opacity="0.75" x="12" y="12" width="66" height="66" fill="white"></rect><path d="M72.9552 81C72.1033 81 71.1648 80.9667 70.1532 80.8935C64.9617 80.5341 23.3898 79.9684 16.4012 80.7404C12.7073 81.1531 10.4443 80.7537 9.47922 79.5357C9.00666 78.9434 8.94011 78.2711 9.03994 77.7919L10.2513 14.223C10.1914 12.8652 11.0167 10.782 13.5459 10.5024C17.6126 10.0498 68.9485 8.78524 73.2481 9.0315C74.0335 9.07809 74.7257 9.09806 75.3447 9.11802C78.7058 9.23117 80.7358 9.29773 80.8689 13.3577C81.4413 31.0354 79.9571 76.1679 79.8972 77.9716C79.9105 78.2645 79.844 78.8302 79.3248 79.4026C78.3464 80.4742 76.2498 81 72.9552 81ZM34.5448 78.1647C49.081 78.1647 67.005 78.4775 70.3062 78.7038C76.2432 79.1164 77.5211 78.1114 77.7075 77.9184C77.7607 76.3942 79.2516 31.1019 78.6792 13.4309C78.6348 12.0954 77.5011 11.3898 75.2781 11.3144C74.6458 11.2944 73.9336 11.2678 73.1283 11.2212C68.8486 10.975 17.8322 12.2329 13.7922 12.6855C12.5409 12.8253 12.4344 13.7637 12.4477 14.1564V14.2296L11.223 78.1314L11.2097 78.178C11.3495 78.3177 12.2613 78.9833 16.155 78.5507C18.7574 78.2645 26.072 78.158 34.5382 78.158L34.5448 78.1647Z" fill="#171F1F"></path><path d="M21.5121 72C21.4641 72 21.4321 71.9813 21.4161 71.944L20.2401 69.464C20.2348 69.448 20.2241 69.44 20.2081 69.44H18.8481C18.8268 69.44 18.8161 69.4507 18.8161 69.472V71.92C18.8161 71.9733 18.7894 72 18.7361 72H18.3281C18.2748 72 18.2481 71.9733 18.2481 71.92V66.48C18.2481 66.4267 18.2748 66.4 18.3281 66.4H20.4001C20.8588 66.4 21.2294 66.544 21.5121 66.832C21.7948 67.1147 21.9361 67.4853 21.9361 67.944C21.9361 68.3173 21.8348 68.6347 21.6321 68.896C21.4294 69.1573 21.1548 69.3253 20.8081 69.4C20.7868 69.4107 20.7814 69.424 20.7921 69.44L21.9921 71.904C21.9974 71.9147 22.0001 71.928 22.0001 71.944C22.0001 71.9813 21.9788 72 21.9361 72H21.5121ZM18.8481 66.896C18.8268 66.896 18.8161 66.9067 18.8161 66.928V68.952C18.8161 68.9733 18.8268 68.984 18.8481 68.984H20.3361C20.6454 68.984 20.8961 68.888 21.0881 68.696C21.2801 68.504 21.3761 68.2533 21.3761 67.944C21.3761 67.6347 21.2801 67.384 21.0881 67.192C20.8961 66.9947 20.6454 66.896 20.3361 66.896H18.8481ZM26.1151 69.296C26.1364 69.4453 26.1471 69.632 26.1471 69.856V70.112C26.1471 70.1653 26.1204 70.192 26.0671 70.192H23.4831C23.4618 70.192 23.4511 70.2027 23.4511 70.224C23.4618 70.5173 23.4778 70.7067 23.4991 70.792C23.5578 71.032 23.6831 71.2213 23.8751 71.36C24.0671 71.4987 24.3124 71.568 24.6111 71.568C24.8351 71.568 25.0324 71.5173 25.2031 71.416C25.3738 71.3147 25.5071 71.1707 25.6031 70.984C25.6351 70.936 25.6724 70.9253 25.7151 70.952L26.0271 71.136C26.0698 71.1627 26.0804 71.2 26.0591 71.248C25.9258 71.504 25.7258 71.7067 25.4591 71.856C25.1924 72 24.8858 72.072 24.5391 72.072C24.1604 72.0667 23.8431 71.976 23.5871 71.8C23.3311 71.624 23.1471 71.3787 23.0351 71.064C22.9391 70.808 22.8911 70.44 22.8911 69.96C22.8911 69.736 22.8938 69.5547 22.8991 69.416C22.9098 69.272 22.9311 69.144 22.9631 69.032C23.0538 68.6853 23.2351 68.408 23.5071 68.2C23.7844 67.992 24.1178 67.888 24.5071 67.888C24.9924 67.888 25.3658 68.0107 25.6271 68.256C25.8884 68.5013 26.0511 68.848 26.1151 69.296ZM24.5071 68.384C24.2458 68.384 24.0271 68.4533 23.8511 68.592C23.6804 68.7253 23.5684 68.9067 23.5151 69.136C23.4831 69.248 23.4618 69.4293 23.4511 69.68C23.4511 69.7013 23.4618 69.712 23.4831 69.712H25.5551C25.5764 69.712 25.5871 69.7013 25.5871 69.68C25.5764 69.44 25.5604 69.2693 25.5391 69.168C25.4804 68.928 25.3604 68.7387 25.1791 68.6C25.0031 68.456 24.7791 68.384 24.5071 68.384ZM28.8047 72.064C28.4207 72.064 28.0901 71.9653 27.8127 71.768C27.5407 71.5653 27.3541 71.2933 27.2527 70.952C27.1834 70.7173 27.1487 70.3867 27.1487 69.96C27.1487 69.576 27.1834 69.2507 27.2527 68.984C27.3487 68.6533 27.5354 68.3893 27.8127 68.192C28.0901 67.9893 28.4207 67.888 28.8047 67.888C29.1941 67.888 29.5301 67.9867 29.8127 68.184C30.1007 68.3813 30.2874 68.6267 30.3727 68.92C30.3994 69.016 30.4154 69.096 30.4207 69.16V69.176C30.4207 69.2133 30.3967 69.2373 30.3487 69.248L29.9487 69.304H29.9327C29.8954 69.304 29.8714 69.28 29.8607 69.232L29.8367 69.112C29.7887 68.9093 29.6714 68.7387 29.4847 68.6C29.2981 68.456 29.0714 68.384 28.8047 68.384C28.5381 68.384 28.3141 68.456 28.1327 68.6C27.9567 68.7387 27.8421 68.9253 27.7887 69.16C27.7407 69.3627 27.7167 69.632 27.7167 69.968C27.7167 70.32 27.7407 70.592 27.7887 70.784C27.8421 71.024 27.9567 71.216 28.1327 71.36C28.3141 71.4987 28.5381 71.568 28.8047 71.568C29.0661 71.568 29.2901 71.5013 29.4767 71.368C29.6687 71.2293 29.7887 71.0533 29.8367 70.84V70.808L29.8447 70.776C29.8501 70.7227 29.8821 70.7013 29.9407 70.712L30.3327 70.776C30.3861 70.7867 30.4101 70.816 30.4047 70.864L30.3727 71.024C30.2927 71.3333 30.1087 71.584 29.8207 71.776C29.5327 71.968 29.1941 72.064 28.8047 72.064ZM33.113 67.896C33.5396 67.896 33.8783 68.0213 34.129 68.272C34.385 68.5227 34.513 68.8587 34.513 69.28V71.92C34.513 71.9733 34.4863 72 34.433 72H34.025C33.9716 72 33.945 71.9733 33.945 71.92V69.392C33.945 69.0987 33.8543 68.8587 33.673 68.672C33.497 68.4853 33.2676 68.392 32.985 68.392C32.6916 68.392 32.4543 68.4827 32.273 68.664C32.0916 68.8453 32.001 69.0827 32.001 69.376V71.92C32.001 71.9733 31.9743 72 31.921 72H31.513C31.4596 72 31.433 71.9733 31.433 71.92V66.48C31.433 66.4267 31.4596 66.4 31.513 66.4H31.921C31.9743 66.4 32.001 66.4267 32.001 66.48V68.376C32.001 68.3867 32.0036 68.3947 32.009 68.4C32.0196 68.4053 32.0276 68.4027 32.033 68.392C32.2676 68.0613 32.6276 67.896 33.113 67.896ZM38.7948 69.296C38.8161 69.4453 38.8268 69.632 38.8268 69.856V70.112C38.8268 70.1653 38.8001 70.192 38.7468 70.192H36.1628C36.1414 70.192 36.1308 70.2027 36.1308 70.224C36.1414 70.5173 36.1574 70.7067 36.1788 70.792C36.2374 71.032 36.3628 71.2213 36.5548 71.36C36.7468 71.4987 36.9921 71.568 37.2908 71.568C37.5148 71.568 37.7121 71.5173 37.8828 71.416C38.0534 71.3147 38.1868 71.1707 38.2828 70.984C38.3148 70.936 38.3521 70.9253 38.3948 70.952L38.7068 71.136C38.7494 71.1627 38.7601 71.2 38.7388 71.248C38.6054 71.504 38.4054 71.7067 38.1388 71.856C37.8721 72 37.5654 72.072 37.2188 72.072C36.8401 72.0667 36.5228 71.976 36.2668 71.8C36.0108 71.624 35.8268 71.3787 35.7148 71.064C35.6188 70.808 35.5708 70.44 35.5708 69.96C35.5708 69.736 35.5734 69.5547 35.5788 69.416C35.5894 69.272 35.6108 69.144 35.6428 69.032C35.7334 68.6853 35.9148 68.408 36.1868 68.2C36.4641 67.992 36.7974 67.888 37.1868 67.888C37.6721 67.888 38.0454 68.0107 38.3068 68.256C38.5681 68.5013 38.7308 68.848 38.7948 69.296ZM37.1868 68.384C36.9254 68.384 36.7068 68.4533 36.5308 68.592C36.3601 68.7253 36.2481 68.9067 36.1948 69.136C36.1628 69.248 36.1414 69.4293 36.1308 69.68C36.1308 69.7013 36.1414 69.712 36.1628 69.712H38.2348C38.2561 69.712 38.2668 69.7013 38.2668 69.68C38.2561 69.44 38.2401 69.2693 38.2188 69.168C38.1601 68.928 38.0401 68.7387 37.8588 68.6C37.6828 68.456 37.4588 68.384 37.1868 68.384ZM41.6364 67.896C42.0631 67.896 42.4017 68.0213 42.6524 68.272C42.9084 68.5227 43.0364 68.8587 43.0364 69.28V71.92C43.0364 71.9733 43.0097 72 42.9564 72H42.5484C42.4951 72 42.4684 71.9733 42.4684 71.92V69.392C42.4684 69.0987 42.3777 68.8587 42.1964 68.672C42.0204 68.4853 41.7911 68.392 41.5084 68.392C41.2151 68.392 40.9777 68.4827 40.7964 68.664C40.6151 68.8453 40.5244 69.0827 40.5244 69.376V71.92C40.5244 71.9733 40.4977 72 40.4444 72H40.0364C39.9831 72 39.9564 71.9733 39.9564 71.92V68.032C39.9564 67.9787 39.9831 67.952 40.0364 67.952H40.4444C40.4977 67.952 40.5244 67.9787 40.5244 68.032V68.376C40.5244 68.3867 40.5271 68.3947 40.5324 68.4C40.5431 68.4053 40.5511 68.4027 40.5564 68.392C40.7911 68.0613 41.1511 67.896 41.6364 67.896ZM43.9809 72C43.9276 72 43.9009 71.9733 43.9009 71.92V71.536C43.9009 71.4987 43.9116 71.4667 43.9329 71.44L46.2049 68.512C46.2156 68.5013 46.2182 68.4933 46.2129 68.488C46.2076 68.4773 46.1996 68.472 46.1889 68.472H44.0129C43.9596 68.472 43.9329 68.4453 43.9329 68.392V68.032C43.9329 67.9787 43.9596 67.952 44.0129 67.952H46.8209C46.8742 67.952 46.9009 67.9787 46.9009 68.032V68.416C46.9009 68.4533 46.8902 68.4853 46.8689 68.512L44.5729 71.44C44.5622 71.4507 44.5596 71.4613 44.5649 71.472C44.5702 71.4773 44.5782 71.48 44.5889 71.48H46.8209C46.8742 71.48 46.9009 71.5067 46.9009 71.56V71.92C46.9009 71.9733 46.8742 72 46.8209 72H43.9809ZM50.9354 69.296C50.9567 69.4453 50.9674 69.632 50.9674 69.856V70.112C50.9674 70.1653 50.9407 70.192 50.8874 70.192H48.3034C48.2821 70.192 48.2714 70.2027 48.2714 70.224C48.2821 70.5173 48.2981 70.7067 48.3194 70.792C48.3781 71.032 48.5034 71.2213 48.6954 71.36C48.8874 71.4987 49.1327 71.568 49.4314 71.568C49.6554 71.568 49.8527 71.5173 50.0234 71.416C50.1941 71.3147 50.3274 71.1707 50.4234 70.984C50.4554 70.936 50.4927 70.9253 50.5354 70.952L50.8474 71.136C50.8901 71.1627 50.9007 71.2 50.8794 71.248C50.7461 71.504 50.5461 71.7067 50.2794 71.856C50.0127 72 49.7061 72.072 49.3594 72.072C48.9807 72.0667 48.6634 71.976 48.4074 71.8C48.1514 71.624 47.9674 71.3787 47.8554 71.064C47.7594 70.808 47.7114 70.44 47.7114 69.96C47.7114 69.736 47.7141 69.5547 47.7194 69.416C47.7301 69.272 47.7514 69.144 47.7834 69.032C47.8741 68.6853 48.0554 68.408 48.3274 68.2C48.6047 67.992 48.9381 67.888 49.3274 67.888C49.8127 67.888 50.1861 68.0107 50.4474 68.256C50.7087 68.5013 50.8714 68.848 50.9354 69.296ZM49.3274 68.384C49.0661 68.384 48.8474 68.4533 48.6714 68.592C48.5007 68.7253 48.3887 68.9067 48.3354 69.136C48.3034 69.248 48.2821 69.4293 48.2714 69.68C48.2714 69.7013 48.2821 69.712 48.3034 69.712H50.3754C50.3967 69.712 50.4074 69.7013 50.4074 69.68C50.3967 69.44 50.3807 69.2693 50.3594 69.168C50.3007 68.928 50.1807 68.7387 49.9994 68.6C49.8234 68.456 49.5994 68.384 49.3274 68.384ZM53.777 67.896C54.2037 67.896 54.5424 68.0213 54.793 68.272C55.049 68.5227 55.177 68.8587 55.177 69.28V71.92C55.177 71.9733 55.1504 72 55.097 72H54.689C54.6357 72 54.609 71.9733 54.609 71.92V69.392C54.609 69.0987 54.5184 68.8587 54.337 68.672C54.161 68.4853 53.9317 68.392 53.649 68.392C53.3557 68.392 53.1184 68.4827 52.937 68.664C52.7557 68.8453 52.665 69.0827 52.665 69.376V71.92C52.665 71.9733 52.6384 72 52.585 72H52.177C52.1237 72 52.097 71.9733 52.097 71.92V68.032C52.097 67.9787 52.1237 67.952 52.177 67.952H52.585C52.6384 67.952 52.665 67.9787 52.665 68.032V68.376C52.665 68.3867 52.6677 68.3947 52.673 68.4C52.6837 68.4053 52.6917 68.4027 52.697 68.392C52.9317 68.0613 53.2917 67.896 53.777 67.896ZM58.2255 68.344C58.2255 68.3973 58.1989 68.424 58.1455 68.424H57.2415C57.2202 68.424 57.2095 68.4347 57.2095 68.456V70.816C57.2095 71.072 57.2655 71.2533 57.3775 71.36C57.4949 71.4613 57.6762 71.512 57.9215 71.512H58.1215C58.1749 71.512 58.2015 71.5387 58.2015 71.592V71.92C58.2015 71.9733 58.1749 72 58.1215 72C58.0575 72.0053 57.9589 72.008 57.8255 72.008C57.4415 72.008 57.1509 71.936 56.9535 71.792C56.7562 71.648 56.6575 71.3813 56.6575 70.992V68.456C56.6575 68.4347 56.6469 68.424 56.6255 68.424H56.1375C56.0842 68.424 56.0575 68.3973 56.0575 68.344V68.032C56.0575 67.9787 56.0842 67.952 56.1375 67.952H56.6255C56.6469 67.952 56.6575 67.9413 56.6575 67.92V66.992C56.6575 66.9387 56.6842 66.912 56.7375 66.912H57.1295C57.1829 66.912 57.2095 66.9387 57.2095 66.992V67.92C57.2095 67.9413 57.2202 67.952 57.2415 67.952H58.1455C58.1989 67.952 58.2255 67.9787 58.2255 68.032V68.344ZM60.9556 67.912C61.1316 67.912 61.2836 67.9467 61.4116 68.016C61.4543 68.0373 61.4703 68.072 61.4596 68.12L61.3716 68.512C61.3556 68.5653 61.3209 68.5813 61.2676 68.56C61.1769 68.5227 61.0729 68.504 60.9556 68.504L60.8516 68.512C60.5743 68.5227 60.3449 68.6267 60.1636 68.824C59.9823 69.016 59.8916 69.2613 59.8916 69.56V71.92C59.8916 71.9733 59.8649 72 59.8116 72H59.4036C59.3503 72 59.3236 71.9733 59.3236 71.92V68.032C59.3236 67.9787 59.3503 67.952 59.4036 67.952H59.8116C59.8649 67.952 59.8916 67.9787 59.8916 68.032V68.52C59.8916 68.536 59.8943 68.5467 59.8996 68.552C59.9103 68.552 59.9183 68.5467 59.9236 68.536C60.0356 68.3387 60.1769 68.1867 60.3476 68.08C60.5236 67.968 60.7263 67.912 60.9556 67.912ZM64.6857 68.032C64.6857 67.9787 64.7123 67.952 64.7657 67.952H65.1737C65.227 67.952 65.2537 67.9787 65.2537 68.032V71.92C65.2537 71.9733 65.227 72 65.1737 72H64.7657C64.7123 72 64.6857 71.9733 64.6857 71.92V71.576C64.6857 71.5653 64.6803 71.5573 64.6697 71.552C64.659 71.5467 64.651 71.5493 64.6457 71.56C64.4217 71.8907 64.067 72.056 63.5817 72.056C63.3257 72.056 63.0883 72.0053 62.8697 71.904C62.6563 71.7973 62.4857 71.6453 62.3577 71.448C62.235 71.2507 62.1737 71.0133 62.1737 70.736V68.032C62.1737 67.9787 62.2003 67.952 62.2537 67.952H62.6617C62.715 67.952 62.7417 67.9787 62.7417 68.032V70.568C62.7417 70.872 62.827 71.1147 62.9977 71.296C63.1683 71.472 63.4003 71.56 63.6937 71.56C63.9977 71.56 64.2377 71.4693 64.4137 71.288C64.595 71.1067 64.6857 70.8667 64.6857 70.568V68.032ZM70.6227 67.896C71.0227 67.896 71.3374 68.016 71.5667 68.256C71.8014 68.496 71.9187 68.824 71.9187 69.24V71.92C71.9187 71.9733 71.8921 72 71.8387 72H71.4387C71.3854 72 71.3587 71.9733 71.3587 71.92V69.352C71.3587 69.0587 71.2734 68.8267 71.1027 68.656C70.9374 68.48 70.7187 68.392 70.4467 68.392C70.1641 68.392 69.9347 68.4773 69.7587 68.648C69.5881 68.8187 69.5027 69.048 69.5027 69.336V71.92C69.5027 71.9733 69.4761 72 69.4227 72H69.0147C68.9614 72 68.9347 71.9733 68.9347 71.92V69.352C68.9347 69.0587 68.8521 68.8267 68.6867 68.656C68.5214 68.48 68.3001 68.392 68.0227 68.392C67.7401 68.392 67.5134 68.4773 67.3427 68.648C67.1774 68.8187 67.0947 69.048 67.0947 69.336V71.92C67.0947 71.9733 67.0681 72 67.0147 72H66.6067C66.5534 72 66.5267 71.9733 66.5267 71.92V68.032C66.5267 67.9787 66.5534 67.952 66.6067 67.952H67.0147C67.0681 67.952 67.0947 67.9787 67.0947 68.032V68.352C67.0947 68.3627 67.0974 68.3707 67.1027 68.376C67.1134 68.376 67.1241 68.3707 67.1347 68.36C67.2521 68.2053 67.4014 68.0907 67.5827 68.016C67.7694 67.936 67.9747 67.896 68.1987 67.896C68.4761 67.896 68.7134 67.952 68.9107 68.064C69.1081 68.176 69.2574 68.3387 69.3587 68.552C69.3694 68.5787 69.3827 68.5787 69.3987 68.552C69.5161 68.3333 69.6814 68.1707 69.8947 68.064C70.1081 67.952 70.3507 67.896 70.6227 67.896Z" fill="black"></path><g clip-path="url(#clip1_15_8729)"><path d="M53.5812 53.329C53.3385 52.7849 53.5645 51.8444 53.5519 51.2118C53.4682 46.3826 53.2506 41.5535 53.2422 36.7244C53.2422 36.3069 53.5603 35.2609 53.2548 34.9319L53.4933 34.527C52.9828 33.6161 53.033 32.7135 51.4134 33.1816C50.861 33.3377 42.1102 33.0087 38.3521 33.0087C38.122 33.0003 37.8834 32.9876 37.6658 33.0425C36.7744 33.2702 37.0297 34.1686 37.0464 34.6704C37.0757 35.6784 37.0422 36.6864 37.0339 37.6944C37.0255 39.7147 37.0088 41.7349 37.0129 43.7551C37.0129 47.7913 37.0757 51.8317 37.3394 55.868C37.4273 57.2302 38.3856 57.1838 40.0973 56.9983C43.9684 56.5765 47.9232 57.2218 51.8361 57.0615C52.5308 57.032 53.5226 57.0193 53.5938 56.4162C53.6566 55.8806 53.577 55.3618 53.5268 54.8346L53.5812 53.329ZM46.9146 56.6145C45.3996 56.5723 43.8847 56.5638 42.3697 56.5934C41.562 56.6102 39.2728 57.0193 38.7288 56.4711C38.4568 56.1969 38.4526 55.8384 38.4568 55.5052C38.507 51.9034 38.5572 48.2974 38.6074 44.6956C38.6325 42.9411 38.7874 41.1528 38.62 39.4068C38.4526 37.6565 38.733 35.8893 38.553 34.1348C38.553 34.1264 38.553 34.1179 38.553 34.1095C38.6534 33.0593 40.2856 33.401 41.4783 33.4136C44.7719 33.4558 47.9734 33.7004 51.2628 33.5317C52.0537 33.4895 51.6896 37.0998 51.6938 37.6734C51.7064 39.508 51.7231 41.3426 51.7357 43.1773C51.7524 45.3493 51.7691 47.5214 51.7859 49.6934C51.8026 51.6926 51.5641 53.7929 51.9575 55.7752C52.1249 56.606 52.2797 56.8886 51.0242 56.8169C49.7352 56.7452 48.4505 56.6566 47.1573 56.6145C47.0736 56.6145 46.9899 56.6102 46.9104 56.606L46.9146 56.6145ZM53.4515 48.7993C53.4515 48.7993 53.4389 48.7993 53.4348 48.7993C53.4431 48.7909 53.4557 48.7867 53.4599 48.7782C53.4599 48.7782 53.4599 48.7782 53.4599 48.7824C53.4599 48.7867 53.4557 48.7951 53.4473 48.7951L53.4515 48.7993Z" fill="#171F1F"></path><path d="M50.2578 55.332C49.7849 55.1844 49.1195 55.2477 48.6549 55.2182C47.8891 55.1675 47.1316 55.0663 46.3616 55.0494C44.6792 55.0157 43.0094 54.8807 41.3354 54.7922C40.6407 54.7542 39.8832 54.594 39.448 55.235C39.2555 55.5218 39.2388 55.7116 39.6531 55.8845C40.2264 56.1165 40.8625 56.1165 41.4694 56.1081C42.7876 56.0912 44.085 56.2262 45.3907 56.2936C46.1733 56.3316 46.9517 56.3822 47.7342 56.3906C48.5085 56.3822 49.2785 56.378 50.0485 56.3274C50.5298 56.2936 50.8939 55.7243 50.5424 55.4754C50.4587 55.4164 50.3582 55.37 50.2494 55.3362L50.2578 55.332ZM50.2662 55.8086C50.2034 55.9731 49.9188 56.0364 49.6803 56.0532C49.0734 56.087 48.4624 56.0996 47.7845 56.1207C46.2611 56.0532 44.6792 55.9478 43.0973 55.8128C42.4026 55.7538 41.6995 55.8002 41.0006 55.7411C40.7537 55.72 40.5068 55.7158 40.2599 55.6736C40.0465 55.6399 39.8414 55.6399 39.8916 55.4248C39.9377 55.235 40.0088 55.1338 40.3562 55.1085C41.4777 55.0241 42.5658 55.2013 43.6665 55.2603C44.4407 55.3025 45.2191 55.2603 45.9891 55.3109C47.2781 55.3953 48.5629 55.4754 49.8518 55.564C50.0653 55.5766 50.3289 55.6273 50.262 55.8086H50.2662Z" fill="#171F1F"></path><path d="M49.6428 53.5355C49.5382 53.5355 49.4335 53.5355 49.3289 53.5355C48.7179 53.5313 48.1069 53.5355 47.5001 53.5186C45.4662 53.4722 43.4407 53.3415 41.4151 53.2065C40.9213 53.1939 40.44 53.2107 39.9713 53.3372C39.8039 53.3794 39.6742 53.4343 39.6323 53.5523C39.5444 53.8223 40.0006 54.2946 40.3856 54.3706C40.9422 54.476 41.5072 54.5224 42.0847 54.5393C43.9261 54.6025 45.7633 54.6995 47.6089 54.729C48.471 54.7459 49.3331 54.8134 50.1994 54.7501C50.4798 54.729 50.6681 54.6363 50.7225 54.4718C50.9192 53.8813 50.5132 53.5397 49.647 53.5355H49.6428ZM49.6009 54.4802C49.4 54.4465 49.1824 54.4844 48.9732 54.4844C46.9184 54.4886 44.8719 54.3537 42.8255 54.2735C42.1015 54.244 41.3691 54.2398 40.6577 54.1091C40.4986 54.0795 40.3354 54.0711 40.2224 53.9699C39.9881 53.7548 40.0299 53.6536 40.3982 53.5819C41.164 53.4343 41.9424 53.5523 42.7083 53.5734C43.8047 53.6072 44.8887 53.7464 45.9935 53.7548C47.2992 53.7674 48.6342 53.6789 49.9106 53.8687C50.7685 53.9952 50.2077 54.5856 49.5967 54.4802H49.6009Z" fill="#171F1F"></path><path d="M49.927 50.0811C49.0021 49.9588 48.0646 49.9715 47.1314 49.9335C45.5704 49.8702 44.0052 49.8028 42.4484 49.6931C41.7035 49.6425 40.9711 49.7437 40.2304 49.71C39.9709 49.7015 39.6361 49.7985 39.5608 50.0769C39.4352 50.5282 39.7198 50.7981 40.4898 50.8318C41.2473 50.8656 42.0006 50.9289 42.7581 50.9752C43.8253 51.0427 44.8924 51.1186 45.9638 51.1524C46.8552 51.1777 47.7131 51.4054 48.5585 51.3506C48.7468 51.3506 48.8807 51.3506 49.0188 51.3506C50.0065 51.359 50.1864 51.262 50.4375 50.6168C50.5631 50.2878 50.425 50.1444 49.9311 50.0811H49.927ZM49.4917 51.0554C48.8556 51.1229 48.2069 51.0976 47.575 51.0259C45.947 50.8361 44.3024 50.8192 42.666 50.7095C41.8667 50.6547 41.0716 50.583 40.2722 50.5155C39.5566 50.0853 40.6238 49.9968 41.2264 49.9757C42.4107 49.9335 43.5784 50.0896 44.7543 50.1064C45.3904 50.1149 46.0224 50.1992 46.6543 50.2076C47.6294 50.2245 48.5961 50.2372 49.5587 50.3468C49.747 50.3679 49.9855 50.351 50.0734 50.4776C50.4124 50.971 49.5168 51.0554 49.4875 51.0596L49.4917 51.0554Z" fill="#171F1F"></path><path d="M39.929 37.4157C40.427 37.3609 40.8957 37.4621 41.377 37.4748C42.1261 37.4917 42.8836 37.4748 43.6201 37.5254C44.9677 37.6182 46.311 37.6646 47.6586 37.673C48.2989 37.673 48.9434 37.6899 49.5795 37.6646C49.8976 37.6519 50.3035 37.6519 50.4709 37.4284C50.7555 37.0488 50.3663 36.5764 49.7553 36.53C49.0396 36.4752 48.3198 36.4457 47.6 36.412C46.6333 36.3698 45.6707 36.3107 44.7082 36.2517C43.2728 36.1589 41.8415 36.0535 40.3935 36.1125C39.5188 36.1462 39.1799 36.5216 39.5188 37.0952C39.6067 37.2428 39.6821 37.4453 39.9248 37.42L39.929 37.4157ZM40.1842 36.4204C40.8204 36.3698 41.4648 36.3403 42.1051 36.374C43.5866 36.4457 45.0639 36.5258 46.5412 36.6102C47.5916 36.6692 48.6421 36.7409 49.6925 36.8C49.9436 36.8126 50.0733 36.9265 50.1194 37.0699C50.1696 37.2217 49.9603 37.2723 49.8097 37.3356C49.5209 37.4537 49.1987 37.4031 48.889 37.42C48.5207 37.441 48.1482 37.4242 47.7758 37.4242C45.9721 37.4748 44.1893 37.2217 42.3939 37.2259C41.649 37.2259 40.9166 37.1796 40.1801 37.1079C39.8327 37.0741 39.8327 36.9434 39.8202 36.7747C39.8076 36.5849 39.9122 36.4457 40.1842 36.4246V36.4204Z" fill="#171F1F"></path><path d="M50.8145 48.7569C50.6219 48.546 50.2495 48.3689 50.0026 48.3267C49.3958 48.2255 48.7722 48.2297 48.1528 48.2044C47.1108 48.1622 46.0645 48.1495 45.0183 48.1242C43.587 48.0947 42.1599 47.9471 40.7287 48.0314C40.4357 48.0483 40.147 47.9387 39.8917 48.0104C39.582 48.0989 39.5192 48.3182 39.5778 48.5376C39.628 48.7231 39.7787 48.8581 40.0591 48.896C40.8166 49.0057 41.5782 49.0732 42.3525 49.0858C43.1099 49.0985 43.8758 49.0858 44.6207 49.1702C45.6837 49.2841 46.7592 49.3136 47.8348 49.322C48.3997 49.322 48.9647 49.322 49.5297 49.322C49.8728 49.322 50.6387 49.4232 50.8647 49.1786C50.986 49.0437 50.94 48.8918 50.8145 48.7569ZM50.3374 48.9804C50.2872 49.069 50.1532 49.0732 50.0319 49.0732C49.6092 49.0774 49.1865 49.0521 48.7596 49.0563C46.3658 49.0732 43.993 48.8159 41.5992 48.7653C41.1556 48.7569 40.7161 48.681 40.2725 48.6388C40.1051 48.6219 39.9335 48.6008 39.9294 48.449C39.9294 48.2676 40.1553 48.3351 40.2683 48.3351C40.7454 48.3267 41.21 48.2339 41.687 48.2634C43.1685 48.3731 44.6626 48.3267 46.1482 48.3899C47.387 48.4406 48.6299 48.4237 49.8561 48.5882C50.0109 48.6093 50.1365 48.643 50.2453 48.7273C50.3499 48.8033 50.3876 48.8961 50.3374 48.9846V48.9804Z" fill="#171F1F"></path><path d="M50.2617 52.0676C49.8055 51.8567 49.3452 51.7218 48.8011 51.7133C47.6879 51.6923 46.5747 51.7049 45.4699 51.6416C43.9926 51.5531 42.5195 51.4645 41.038 51.4603C40.9627 51.4603 40.8873 51.4687 40.8162 51.4603C40.3517 51.3844 40.0587 51.5742 39.8034 51.7893C39.6402 51.9327 39.6067 52.1182 39.8327 52.2321C40.1424 52.3839 40.4479 52.5526 40.8413 52.6159C41.9503 52.7888 43.0803 52.7804 44.206 52.8099C46.106 52.8563 48.0018 52.9533 49.9018 52.966C50.1403 52.966 50.5462 53.0039 50.5546 52.7846C50.5672 52.5526 50.6927 52.2701 50.2617 52.0718V52.0676ZM50.1445 52.5526C50.0691 52.6539 49.952 52.7129 49.7469 52.7087C48.8262 52.6792 47.9013 52.696 46.9806 52.6454C45.5368 52.5695 44.093 52.5105 42.6492 52.4641C41.9754 52.443 41.2975 52.3966 40.653 52.2194C40.381 52.1435 40.4019 52.0254 40.3977 51.8778C40.3977 51.6754 40.6028 51.7513 40.745 51.7471C40.9543 51.7386 41.1635 51.7344 41.4105 51.726C42.9463 51.7935 44.5241 51.8778 46.1018 51.9242C47.0267 51.9495 47.9516 52.0212 48.8806 51.9833C49.2907 51.9664 49.6632 52.0718 49.9687 52.2701C50.0859 52.346 50.2449 52.4261 50.1445 52.5569V52.5526Z" fill="#171F1F"></path><path d="M40.1808 45.2015C41.7334 45.3871 43.3028 45.4546 44.8721 45.4926C46.5921 45.5347 48.3122 45.5347 50.028 45.5558C50.2707 45.5558 50.4549 45.3998 50.4298 45.3239C50.321 45.0202 50.4549 44.6533 50.0196 44.4213C49.7309 44.2652 49.417 44.1809 49.0362 44.1767C47.63 44.1682 46.2197 44.1767 44.8135 44.1134C43.6627 44.0628 42.516 43.9278 41.3693 43.8308C40.6118 43.8097 40.0134 43.9236 39.6786 44.4761C39.44 44.8768 39.5447 45.1214 40.1766 45.1931L40.1808 45.2015ZM40.7123 44.2695C41.3442 44.0501 41.9426 44.1345 42.6457 44.2146C44.2862 44.4044 45.9393 44.4255 47.5924 44.4382C48.082 44.4424 48.5758 44.4382 49.0655 44.4593C49.6681 44.4888 49.915 44.6743 50.0113 45.0624C50.0573 45.2479 49.9192 45.307 49.7309 45.2901C48.7851 45.2058 47.8435 45.3407 46.906 45.2901C45.4036 45.2142 43.8928 45.2437 42.3946 45.0792C41.7836 45.0118 41.1517 45.0877 40.5407 44.9949C39.7832 44.8768 40.0636 44.5352 40.5616 44.3243C40.6118 44.3032 40.6662 44.2821 40.7165 44.2652L40.7123 44.2695Z" fill="#171F1F"></path><path d="M40.1561 35.3407C41.625 35.5052 43.119 35.4841 44.5921 35.6444C45.3161 35.7245 46.0694 35.7119 46.8102 35.6697C47.8899 35.6402 48.9696 35.695 50.0451 35.598C50.7943 35.5305 50.7943 35.539 50.8905 35.0413C50.9407 34.7756 50.7691 34.6322 50.4092 34.5731C50.1456 34.531 49.8903 34.5689 49.6266 34.5731C47.7141 34.6322 45.8225 34.4255 43.9225 34.3538C42.6712 34.3074 41.4074 34.2104 40.1561 34.4002C39.6455 34.4761 39.5325 34.5773 39.5283 34.9907C39.5283 35.2775 39.8799 35.307 40.1519 35.3365L40.1561 35.3407ZM40.2816 34.6828C41.0307 34.5225 41.8008 34.5816 42.5708 34.5773C44.0941 34.5689 45.5882 34.7376 47.0989 34.8178C48.0824 34.8684 49.0742 34.8346 50.0619 34.8304C50.2921 34.8304 50.5473 34.8135 50.5641 35.0286C50.5766 35.2395 50.359 35.307 50.0786 35.3323C49.07 35.4293 48.0573 35.3618 47.0487 35.3998C45.6719 35.4504 44.3117 35.3618 42.9516 35.2311C42.0895 35.1467 41.2023 35.1636 40.3318 35.0961C40.11 35.0792 39.9929 35.0202 39.9636 34.881C39.9259 34.7123 40.1519 34.7081 40.29 34.6828H40.2816Z" fill="#171F1F"></path><path d="M40.5069 41.0513C41.3313 41.1188 42.1557 41.1737 42.9802 41.2074C43.9343 41.2496 44.8718 41.4056 45.8176 41.4267C47.1191 41.4562 48.4164 41.4942 49.7138 41.5701C50.1155 41.5912 50.2788 41.5617 50.1783 41.296C50.1951 40.7477 49.8435 40.4778 49.0777 40.4862C47.8013 40.5031 46.5374 40.3807 45.2735 40.2922C44.0934 40.2078 42.9132 40.094 41.7331 40.0644C41.3564 40.056 40.9672 40.0012 40.5947 40.0391C40.2307 40.0771 39.1928 40.2964 39.3393 40.6591C39.4397 40.9122 40.1972 41.026 40.511 41.0513H40.5069ZM42.8923 40.3934C44.0306 40.4693 45.1689 40.5705 46.3114 40.6254C47.0103 40.6591 47.6925 40.7477 48.3913 40.7814C48.6843 40.7941 48.9772 40.7688 49.266 40.7983C49.3999 40.8109 49.5589 40.7814 49.6552 40.9037C49.7263 40.9965 49.8435 41.0809 49.8017 41.1863C49.7515 41.3086 49.5715 41.2538 49.4585 41.2538C48.8977 41.2538 48.3328 41.2454 47.772 41.22C46.3784 41.1526 44.9806 41.1062 43.5912 40.9923C42.5742 40.9079 41.5489 40.8869 40.532 40.7941C40.2599 40.7688 40.1721 40.6338 40.0214 40.4735C41.0049 40.2753 41.9632 40.3301 42.8965 40.3934H42.8923Z" fill="#171F1F"></path><path d="M48.3787 38.4743C47.7259 38.4912 47.0688 38.5123 46.416 38.4617C45.0433 38.3563 43.6706 38.255 42.2896 38.1496C41.6535 38.1833 41.0257 38.2424 40.4022 38.331C40.0841 38.3773 40.0046 38.5081 39.946 38.6852C39.8791 38.8708 40.0088 38.9973 40.2055 39.1112C40.4566 39.2546 40.7579 39.3179 41.0634 39.36C41.9715 39.4823 42.8964 39.5034 43.8129 39.5287C45.0852 39.5667 46.3532 39.6384 47.6254 39.6721C48.2364 39.689 48.8474 39.727 49.4543 39.7354C49.9314 39.7396 50.3122 39.5372 50.3666 39.2883C50.4084 39.0859 50.0109 38.6641 49.697 38.6009C49.2659 38.5123 48.8307 38.4659 48.3745 38.4786L48.3787 38.4743ZM49.8016 39.1449C49.743 39.3938 49.6133 39.5245 49.1864 39.4613C48.5043 39.3643 47.797 39.4233 47.1023 39.3896C45.6041 39.3179 44.1059 39.2419 42.6077 39.1702C42.0636 39.1449 41.5279 39.1239 40.9881 39.0437C40.6324 38.9889 40.4775 38.8708 40.4273 38.6473C41.6242 38.3773 42.8295 38.4828 44.0389 38.5503C45.4869 38.6304 46.9265 38.7822 48.3829 38.7401C48.7052 38.7316 49.0358 38.7696 49.3538 38.8033C49.6133 38.8328 49.856 38.8919 49.7974 39.1407L49.8016 39.1449Z" fill="#171F1F"></path><path d="M39.9082 46.9179C39.9459 46.9474 39.9793 46.9769 40.017 47.0064C40.6615 47.483 41.3018 47.4704 42.2016 47.424C43.4487 47.3607 44.6874 47.6222 45.9429 47.5674C46.7297 47.5336 47.5123 47.5336 48.048 47.5294C48.8598 47.5294 49.4206 47.5294 49.9856 47.5294C50.4543 47.5294 50.5338 47.4535 50.4627 47.1372C50.4501 47.0866 50.4627 47.0317 50.4752 46.9811C50.5213 46.7492 50.3581 46.5973 50.0693 46.5256C49.6382 46.4202 49.1988 46.3401 48.7343 46.3148C48.0187 46.2726 47.3072 46.3021 46.5958 46.2852C44.9678 46.2473 43.3566 46.0533 41.737 45.9436C41.1386 45.9057 40.5234 45.8803 39.95 46.0448C39.3139 46.2262 39.5818 46.6437 39.9124 46.9263L39.9082 46.9179ZM40.582 46.2051C41.7119 46.1165 42.8168 46.2599 43.9258 46.3527C45.3361 46.4708 46.7464 46.5256 48.1651 46.5383C48.7008 46.5425 49.2239 46.6058 49.7387 46.7154C49.994 46.7703 50.1028 46.8926 50.1237 47.057C50.1404 47.1836 50.0902 47.2721 49.8517 47.2679C49.362 47.2553 48.8724 47.2679 48.1777 47.2679C47.0645 47.2426 45.7462 47.386 44.4363 47.2595C43.2101 47.1414 41.9756 47.1794 40.7494 47.0781C40.4857 47.057 40.1593 46.8462 40.1467 46.8293C39.8036 46.4497 39.9082 46.2641 40.582 46.2135V46.2051Z" fill="#171F1F"></path><path d="M42.1008 43.3541C43.0717 43.4427 44.1682 43.3457 45.0136 43.3921C46.5453 43.4765 48.0811 43.5608 49.617 43.5229C49.8807 43.5144 50.2071 43.5819 50.3578 43.3415C50.5126 43.0927 50.3327 42.6836 50.0188 42.5064C49.5961 42.2702 49.0855 42.3377 48.6126 42.3208C47.9137 42.2955 47.2107 42.3082 46.5076 42.2534C45.5199 42.1774 44.549 42.0298 43.5572 41.9792C42.6825 41.9328 41.8121 42.0045 40.9332 41.9581C40.3138 41.9244 39.7865 42.1142 39.9832 42.6076C40.0083 42.6751 40.0502 42.7426 40.1171 42.7932C40.1883 42.848 40.2887 42.8818 40.3808 42.9113C40.95 43.1011 41.4605 43.2951 42.0925 43.3499L42.1008 43.3541ZM40.5566 42.2998C41.1885 42.1985 41.8246 42.2829 42.4565 42.266C43.6744 42.1353 44.8587 42.3461 46.0389 42.4769C46.9889 42.5823 47.9347 42.5486 48.8805 42.5992C49.2069 42.6161 49.5542 42.5992 49.8221 42.789C49.9727 42.8944 50.0564 43.0083 49.9979 43.1517C49.9309 43.312 49.7342 43.2445 49.5877 43.2529C48.0853 43.3288 46.5955 43.1981 45.0973 43.1391C43.9715 43.0927 42.8416 43.0842 41.7158 42.9999C41.2178 42.9619 40.816 42.8143 40.4687 42.5697C40.2678 42.4263 40.1883 42.3588 40.5566 42.304V42.2998Z" fill="#171F1F"></path></g></g><defs><clipPath id="clip0_15_8729"><rect width="90" height="90" fill="white"></rect></clipPath><clipPath id="clip1_15_8729"><rect width="16.6143" height="24.0908" fill="white" transform="translate(37 33)"></rect></clipPath></defs></svg>` : `${stageId === "logistics" ? `<svg width="90" height="90" viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg" class="svelte-1j9izwh"><g clip-path="url(#clip0_15_8546)"><rect opacity="0.75" x="12" y="12" width="66" height="66" fill="white"></rect><path fill-rule="evenodd" clip-rule="evenodd" d="M60.0808 50.7208C60.0555 50.6976 60.0365 50.6807 59.988 50.6702C59.988 50.6652 59.9895 50.6606 59.991 50.6559C59.9926 50.6507 59.9944 50.6452 59.9944 50.6386C59.9796 49.4081 59.908 48.2492 59.771 46.9913C59.6931 46.2812 59.5013 45.489 59.2569 44.8695C59.0462 44.3364 58.7491 43.9698 58.412 43.5779L57.1772 42.1472C57.114 42.0734 57.0508 41.9997 56.9897 41.9238L56.9828 41.9156C56.789 41.6843 56.5887 41.4452 56.3555 41.239L56.3547 41.2384C55.7778 40.7288 55.3964 40.392 54.5519 40.293C54.101 40.2403 53.4962 40.2003 52.9653 40.1666L52.5017 40.1371L52.4571 40.1343C51.5953 40.0808 50.9086 40.0382 50.0407 40.0465C49.8321 40.0465 49.6677 40.1834 49.6235 40.392H49.6277C49.6108 40.4931 49.6045 40.706 49.5898 41.2433L49.5877 41.312C49.58 41.5765 49.5722 41.841 49.5645 42.0039C49.5396 42.5938 49.5338 43.1906 49.5282 43.7706V43.7708L49.5265 43.9445L49.5223 44.3533C49.516 45.0591 49.5223 45.7987 49.5329 46.5783C49.5455 47.6234 49.5582 48.7022 49.5329 49.7536C49.5329 49.8168 49.5603 49.8737 49.6045 49.9138C49.4507 50.1835 49.3285 50.47 49.24 50.7671H49.1157C49.1452 50.352 49.1557 49.9327 49.1641 49.5282L49.1683 49.3701C49.2168 47.2884 49.2147 44.8295 49.2105 42.4906L49.2021 38.7717V38.7422C49.2126 38.0384 49.1115 37.6086 48.8923 37.4253C48.5391 37.1246 48.1859 37.1177 47.6527 37.1072L47.6492 37.1071H47.6091C46.5704 37.1387 31.8631 37.4969 31.3996 37.4864H31.3448C31.1741 37.4822 30.8581 37.478 30.6284 37.5412C30.4683 37.5854 30.3735 37.6613 30.2555 37.7582C29.8783 38.0616 29.8256 38.5441 29.8214 38.936C29.872 41.2222 30.2133 48.1965 30.3313 49.6841C30.089 49.9559 30.089 50.1898 30.0932 50.5037V50.5585C30.0974 50.9146 30.1269 51.3213 30.4346 51.6331C30.9613 52.1641 31.2373 52.181 31.9053 52.2189C31.945 52.2215 31.9861 52.2238 32.0291 52.2262L32.0294 52.2262L32.0296 52.2262L32.0299 52.2262L32.0303 52.2262H32.0303C32.0896 52.2295 32.1523 52.233 32.2192 52.2378C32.333 52.2463 32.4594 52.2484 32.5922 52.2484C33.2454 52.2484 34.0292 52.1662 34.0692 52.162C34.1809 52.1493 34.2631 52.0524 34.2568 51.9408C34.2104 51.0326 34.5159 50.1455 35.0933 49.5092C35.5631 48.9909 36.1805 48.6896 36.8295 48.6601C37.6006 48.6264 38.376 48.9361 38.9007 49.4903C39.3685 49.9854 39.5412 51.1843 39.3832 51.926C39.3818 51.9329 39.3823 51.939 39.3827 51.9453C39.383 51.9486 39.3832 51.9519 39.3832 51.9555C39.3537 51.9892 39.3326 52.0292 39.3305 52.0777C39.3263 52.1936 39.4169 52.2926 39.5328 52.2968C39.6887 52.3032 39.91 52.3053 40.1523 52.3053C40.4346 52.3053 40.7423 52.3032 40.9993 52.3011C41.0876 52.3011 41.1691 52.3004 41.2397 52.2998H41.2398H41.2399H41.24H41.24H41.2401H41.2401H41.2402L41.2405 52.2998C41.2942 52.2993 41.3416 52.2989 41.3807 52.2989C43.5573 52.2947 48.2054 52.1578 49.3116 52.0208C49.3177 52.0208 49.3223 52.0187 49.3272 52.0166C49.3308 52.015 49.3345 52.0133 49.339 52.0124L49.3506 52.0093C49.3606 52.0067 49.3698 52.0044 49.3791 51.9997C49.3865 51.996 49.3925 51.9916 49.3983 51.9873C49.4023 51.9842 49.4063 51.9813 49.4107 51.9787C49.4212 51.9703 49.4317 51.9618 49.4402 51.9513C49.4486 51.9408 49.4549 51.9302 49.4612 51.9197L49.4612 51.9197C49.4636 51.9149 49.4664 51.9104 49.469 51.9059C49.4734 51.8987 49.4776 51.8917 49.4802 51.8839C49.4844 51.8712 49.4865 51.8586 49.4886 51.8438C49.4886 51.8383 49.4904 51.8333 49.492 51.8286L49.4939 51.8229L49.4948 51.819L49.4949 51.8164C49.5118 50.3499 50.5737 48.7338 52.1224 48.6643C52.8957 48.6306 53.669 48.9403 54.1937 49.4945C54.6446 49.9707 55.066 51.1253 54.9606 51.8691H54.8258C54.7099 51.8691 54.6151 51.9639 54.6151 52.0798C54.6151 52.1957 54.7099 52.2905 54.8258 52.2905H55.0681H55.2577C55.736 52.2905 56.0163 52.2905 56.5831 52.2695C56.9312 52.258 57.3257 52.226 57.7448 52.192L57.7449 52.192L57.881 52.181L57.9465 52.1756H57.9465C58.6718 52.1161 59.4135 52.0553 59.9965 52.0798C60.0492 52.0819 60.1082 52.063 60.1482 52.025C60.1903 51.9871 60.2135 51.9344 60.2156 51.8775C60.224 51.6458 60.243 50.8767 60.0765 50.725L60.0808 50.7208ZM31.486 48.3967C31.4902 48.5379 31.4986 48.9129 31.4459 48.9803C31.328 49.0351 31.1847 49.0393 31.0435 49.0372C30.9875 49.0372 30.9217 49.034 30.8531 49.0306H30.8531H30.853C30.8262 49.0292 30.7989 49.0279 30.7717 49.0267C30.7506 49.0267 30.7295 49.0267 30.7085 49.0246C30.6874 48.6811 30.6621 48.2555 30.6347 47.7751C30.8475 47.7498 31.1699 47.7604 31.4354 47.7835C31.4841 47.8221 31.484 48.0739 31.4839 48.1827L31.4839 48.1944V48.3272V48.4009L31.486 48.3967ZM39.2104 49.2016C38.6015 48.5589 37.7039 48.2007 36.8126 48.2408C36.0499 48.2745 35.3292 48.6264 34.7835 49.2269C34.4211 49.6251 34.1556 50.1118 33.9997 50.6386H33.8859C33.8311 50.6407 33.7553 50.6428 33.6246 50.6428C33.572 50.6428 33.5172 50.6428 33.4603 50.6449L33.4428 50.6453C33.244 50.6494 33.0426 50.6536 32.8808 50.5922C32.7629 50.548 32.6533 50.4363 32.5395 50.3162C32.4468 50.2193 32.352 50.1203 32.2361 50.0423C31.9306 49.8295 31.5787 49.7389 31.191 49.7705C31.0751 49.781 30.9887 49.8822 30.9971 49.9981C31.0077 50.1139 31.1046 50.2003 31.2247 50.1898C31.5176 50.1645 31.7683 50.2298 31.9959 50.3879C32.0756 50.4445 32.1533 50.5241 32.235 50.608L32.2361 50.6091C32.3709 50.7503 32.5269 50.9083 32.7334 50.9863C32.9146 51.0537 33.1105 51.0663 33.2938 51.0663C33.3528 51.0663 33.4118 51.0663 33.4687 51.0642C33.4952 51.0642 33.5212 51.0637 33.547 51.0631H33.547H33.547H33.5471H33.5471H33.5471H33.5472H33.5472L33.5473 51.0631C33.5725 51.0626 33.5975 51.0621 33.6225 51.0621C33.7553 51.0621 33.8353 51.06 33.8922 51.0558C33.8501 51.2855 33.829 51.5193 33.829 51.7574C33.4771 51.789 32.7291 51.8459 32.2487 51.8122C32.1307 51.8038 32.0254 51.7975 31.9306 51.7933C31.2816 51.7553 31.1467 51.7469 30.7338 51.3318C30.5547 51.1527 30.5188 50.9083 30.5146 50.5501V50.4953L30.5146 50.4912C30.5104 50.1805 30.5091 50.0858 30.6937 49.9096C30.6948 49.9085 30.6958 49.9069 30.6969 49.9053L30.6969 49.9053C30.6979 49.9038 30.699 49.9022 30.7001 49.9011C30.7077 49.8935 30.7131 49.8848 30.7187 49.8757L30.7253 49.8653L30.7309 49.8566C30.736 49.8488 30.7412 49.8408 30.7443 49.8316C30.7485 49.819 30.7506 49.8084 30.7527 49.7958L30.7546 49.7847C30.7565 49.7736 30.7585 49.7626 30.7569 49.7515V49.741L30.753 49.6928L30.753 49.6928C30.7473 49.6235 30.7405 49.5409 30.7338 49.446H30.7485C30.7766 49.4472 30.8048 49.4485 30.8326 49.4498C30.9052 49.4532 30.9751 49.4565 31.033 49.4565H31.0962C31.2668 49.4565 31.4481 49.4397 31.6208 49.3596C31.9243 49.2194 31.9139 48.7611 31.9055 48.3915L31.9053 48.384V48.3124C31.9039 48.2873 31.9043 48.2614 31.9048 48.2344C31.905 48.2206 31.9053 48.2066 31.9053 48.1923L31.9053 48.1918C31.9074 47.9135 31.9113 47.3958 31.4607 47.3558C31.3659 47.3474 30.9424 47.3137 30.6116 47.3474C30.4662 44.644 30.2786 40.569 30.2428 38.9297C30.247 38.4936 30.3313 38.2323 30.521 38.0785C30.6263 37.9921 30.6663 37.9605 30.738 37.9415C30.9108 37.8952 31.1994 37.8994 31.3385 37.9015H31.3975H31.4017C31.9411 37.9015 46.5851 37.5538 47.6112 37.5222H47.6407C48.1654 37.5327 48.3887 37.5454 48.6226 37.7413C48.6395 37.7561 48.7954 37.9099 48.7828 38.7317V38.7675L48.7912 42.4864C48.7954 44.8231 48.7975 47.28 48.749 49.3554L48.7448 49.5134C48.7364 49.9243 48.7259 50.3478 48.6964 50.7629C45.2998 50.7671 40.4978 50.6281 39.8046 50.6049C39.714 50.0507 39.5159 49.5197 39.2062 49.1953L39.2104 49.2016ZM41.3828 51.8754C41.2901 51.8754 41.1552 51.8754 40.9972 51.8775C40.6327 51.8818 40.167 51.886 39.8215 51.8818C39.8636 51.6226 39.8741 51.3318 39.8552 51.0326C40.7949 51.0642 45.3546 51.1906 48.5847 51.1906H49.141C49.1136 51.3339 49.0988 51.4772 49.0904 51.6205C47.7503 51.749 43.4498 51.8712 41.3828 51.8754ZM59.5245 49.1868C59.4971 49.1805 59.4676 49.1784 59.4381 49.1847C59.4002 49.1932 59.3644 49.1953 59.3243 49.1974C59.2464 49.2016 59.1663 49.2016 59.0883 49.1995H58.9514C58.8031 49.1995 58.6952 49.2016 58.5945 49.2036C58.5536 49.2044 58.5139 49.2052 58.4731 49.2058L58.1149 49.21C58.0791 49.21 58.039 49.2121 57.999 49.2142C57.9484 49.2184 57.8599 49.2227 57.8136 49.2142C57.7778 48.9466 57.7756 48.816 57.7735 48.6664L57.7693 48.5147C57.7588 48.1502 57.744 47.596 57.9927 47.5602C58.3008 47.5162 58.5464 47.5431 58.8332 47.5745L58.8376 47.5749C58.9893 47.5918 59.1473 47.6087 59.3243 47.6171C59.3538 47.6171 59.3833 47.6129 59.4086 47.6044C59.4592 48.1396 59.4971 48.6622 59.5245 49.1847V49.1868ZM54.5055 49.2016C53.8966 48.5589 53.0011 48.2007 52.1077 48.2408C51.2311 48.2808 50.4916 48.7422 49.9627 49.3954C49.9775 48.4557 49.9669 47.5033 49.9564 46.5762L49.9556 46.5012V46.501V46.5009V46.5007V46.5005V46.5004V46.5002V46.5001C49.9474 45.7487 49.9397 45.0384 49.9458 44.3596L49.9501 43.9508C49.9543 43.3187 49.9606 42.6655 49.9859 42.025C49.9936 41.8603 50.0014 41.5941 50.0091 41.328L50.0112 41.258C50.0196 40.9651 50.0301 40.6069 50.0365 40.4974C50.04 40.4903 50.042 40.4817 50.0438 40.4742L50.0449 40.47C50.8999 40.4617 51.5811 40.5045 52.4349 40.5581L52.4743 40.5606L52.94 40.5901C53.4646 40.6217 54.0609 40.6617 54.5034 40.7144C55.2174 40.7986 55.523 41.0682 56.0768 41.5567L56.0774 41.5572C56.2902 41.7447 56.4819 41.9744 56.6652 42.1956C56.7284 42.2715 56.7938 42.3495 56.857 42.4232L58.0917 43.8539C58.4035 44.2163 58.6775 44.5534 58.8629 45.0254C59.0904 45.6027 59.278 46.3739 59.3496 47.0398C59.3528 47.0682 59.3554 47.0961 59.358 47.124C59.3607 47.152 59.3633 47.1799 59.3665 47.2083C59.3625 47.2083 59.3585 47.2069 59.3543 47.2054C59.3496 47.2038 59.3446 47.202 59.3391 47.202C59.1747 47.1936 59.023 47.1788 58.8797 47.162C58.5763 47.1282 58.2898 47.0966 57.9295 47.1493C57.3087 47.2398 57.331 48.0153 57.3457 48.5294L57.3458 48.5315L57.35 48.679C57.3521 48.8392 57.3563 48.9909 57.3964 49.2964C57.4364 49.5977 57.7061 49.642 57.9 49.642C57.9463 49.642 57.9906 49.6399 58.0243 49.6377C58.0417 49.6377 58.0586 49.6366 58.0748 49.6355C58.0901 49.6345 58.1048 49.6335 58.1191 49.6335L58.4794 49.6293C58.5585 49.6293 58.6336 49.628 58.7207 49.6265H58.7207H58.7207H58.7208H58.7208C58.7891 49.6253 58.8648 49.6239 58.9556 49.623H59.0841C59.1726 49.623 59.2632 49.623 59.3517 49.6188C59.4107 49.6146 59.4613 49.6104 59.5182 49.5998C59.524 49.5998 59.5286 49.5972 59.5332 49.5946L59.5377 49.5921C59.5401 49.5909 59.5427 49.5899 59.5456 49.5893C59.5603 49.9391 59.5709 50.2888 59.5751 50.6449H59.5749C59.3684 50.6449 59.0672 50.6449 58.6185 50.6491C58.2813 50.6533 57.9674 50.6554 57.7988 50.6512C56.9391 50.6344 56.0984 50.6217 55.2893 50.6428C55.2826 50.6428 55.2767 50.6445 55.2706 50.6463L55.2642 50.6481L55.2598 50.6491C55.0955 50.0697 54.811 49.5176 54.5097 49.1974L54.5055 49.2016ZM57.8494 51.7553L57.7196 51.766C57.3042 51.8002 56.9124 51.8324 56.5725 51.8438C56.0668 51.8607 55.7887 51.8649 55.3905 51.8649C55.4179 51.6184 55.401 51.3445 55.3504 51.0663C56.1364 51.0474 56.9518 51.06 57.7862 51.0748C57.9162 51.078 58.1331 51.0763 58.3801 51.0744L58.6185 51.0726C58.9977 51.0684 59.5329 51.0642 59.7731 51.0726C59.79 51.2033 59.8005 51.4308 59.8026 51.65C59.219 51.6437 58.5236 51.7005 57.8515 51.7574L57.8494 51.7553ZM47.4651 50.0273C47.3615 50.0254 47.2225 50.0229 47.1157 49.9176C47.038 49.8375 47.0002 49.726 47.0002 49.5745C47.0002 49.5092 47.0149 49.033 47.0213 48.9129C47.0128 48.8118 47.017 48.6706 47.1119 48.5716C47.1688 48.5126 47.2488 48.4831 47.3289 48.4852C47.3549 48.4867 47.3877 48.4849 47.4222 48.483L47.4223 48.483L47.4431 48.4818L47.4616 48.481C47.5185 48.4767 47.5754 48.4746 47.6197 48.4746C47.6955 48.4746 47.8557 48.4873 47.8557 48.4873C47.9231 48.4894 48.1043 48.5315 48.1043 48.8813C48.1043 49.0225 48.098 49.5998 48.0959 49.6693C48.0916 49.8063 48.0326 49.8885 47.9842 49.9327C47.8936 50.017 47.7798 50.0317 47.6745 50.0317C47.6407 50.0317 47.607 50.0296 47.5775 50.0275H47.5417H47.4785L47.4651 50.0273ZM47.4378 49.0052C47.4321 49.1585 47.4195 49.4978 47.4195 49.5745V49.5787V49.6082H47.4764H47.4975H47.4975C47.5164 49.6082 47.5375 49.6082 47.5586 49.6103H47.5986C47.6197 49.6124 47.6492 49.6124 47.6745 49.6124C47.6766 49.4565 47.6808 49.0414 47.6808 48.8982C47.6555 48.896 47.6302 48.896 47.6112 48.896C47.585 48.8931 47.5567 48.8953 47.5264 48.8976C47.5129 48.8986 47.4991 48.8996 47.4848 48.9003C47.4701 48.9024 47.4553 48.9024 47.4406 48.9024H47.4406V48.9298L47.4378 49.0052ZM37.4869 49.5451C36.9601 49.3618 36.3722 49.4397 35.8771 49.76C35.3588 50.0929 35.0174 50.6471 34.9626 51.2391C34.8594 52.3496 35.4852 53.2429 36.5176 53.46C36.6462 53.4874 36.7789 53.5 36.918 53.5C36.9538 53.5 36.9875 53.5 37.0233 53.4979C37.0318 53.4979 37.0402 53.4979 37.0465 53.4958C37.3984 53.4368 37.7713 53.3609 38.1085 53.1123C38.4393 52.87 38.6921 52.5076 38.8185 52.0925C39.1325 51.0727 38.5214 49.9075 37.4869 49.5472V49.5451ZM38.4161 51.9661C38.3149 52.2969 38.1169 52.5813 37.8598 52.771C37.6007 52.9606 37.2993 53.0238 36.9896 53.0765C36.8527 53.0828 36.7241 53.0723 36.604 53.047C35.7907 52.8763 35.2998 52.1641 35.3819 51.2771C35.4241 50.8135 35.6959 50.3795 36.1068 50.114C36.4923 49.8653 36.9454 49.8021 37.3499 49.9433C38.1632 50.2256 38.6605 51.1717 38.4161 51.9661ZM52.7841 49.5451C52.2573 49.3618 51.6694 49.4397 51.1743 49.76C50.6559 50.0929 50.3146 50.6471 50.2598 51.2391C50.1566 52.3496 50.7824 53.2429 51.8148 53.46C51.9412 53.4874 52.0761 53.5 52.2152 53.5C52.251 53.5 52.2847 53.5 52.3205 53.4979C52.3289 53.4979 52.3374 53.4979 52.3437 53.4958C52.6956 53.4368 53.0685 53.3609 53.4056 53.1123C53.7364 52.87 53.9872 52.5076 54.1157 52.0925C54.4297 51.0727 53.8186 49.9075 52.7841 49.5472V49.5451ZM53.7133 51.9661C53.6121 52.2969 53.4141 52.5813 53.157 52.771C52.8978 52.9606 52.5965 53.0238 52.2868 53.0765C52.1519 53.0828 52.0213 53.0723 51.9012 53.047C51.0879 52.8763 50.5969 52.1641 50.6791 51.2771C50.7213 50.8135 50.9931 50.3795 51.4018 50.114C51.6526 49.9517 51.9307 49.8696 52.2067 49.8696C52.3563 49.8696 52.5038 49.8948 52.6471 49.9433C53.4604 50.2256 53.9577 51.1717 53.7133 51.9661ZM53.3993 45.8661C53.2202 45.8514 53.0896 45.7039 53.0938 45.5227V45.5248H53.1001C53.0559 44.9285 53.0306 41.7279 53.0348 41.7047C53.1022 41.3612 53.5089 41.2074 54.2442 41.2475C54.7499 41.2748 55.3209 41.3612 55.7255 41.8037C55.8688 41.9596 56.484 42.8277 57.0003 43.6179C58.1456 45.3718 58.0139 45.5056 57.8855 45.6362L57.8852 45.6364C57.7757 45.7481 57.1267 45.7839 56.9307 45.7924C56.6442 45.805 54.5118 45.8724 53.6859 45.8724C53.551 45.8724 53.452 45.8703 53.3993 45.8661ZM54.2211 41.6647C53.6627 41.6373 53.4562 41.7426 53.4478 41.7826V41.7805C53.433 41.9554 53.492 44.958 53.511 45.4468C54.0525 45.4595 56.4461 45.3899 56.9118 45.3688C57.0424 45.3646 57.3226 45.3372 57.5038 45.3141C57.2489 44.663 55.6665 42.3621 55.4136 42.0861C55.1102 41.7553 54.6404 41.6878 54.2211 41.6647ZM52.4364 44.5556C52.4364 44.5203 52.4353 44.4667 52.434 44.3968L52.4321 44.2964L52.4305 44.2037C52.4196 43.5814 52.3995 42.4324 52.3394 41.7574C52.3394 41.7553 52.3384 41.7484 52.3373 41.7416C52.3363 41.7347 52.3352 41.7279 52.3352 41.7258L52.3352 41.7254C52.3225 41.6324 52.2927 41.4139 52.0381 41.4055C51.7602 41.3956 51.4597 41.41 51.1668 41.424L51.1131 41.4266C50.9867 41.4329 50.8603 41.4392 50.7402 41.4434C50.5885 41.4498 50.4726 41.6036 50.4621 41.7405C50.4326 42.143 50.4705 43.1839 50.4852 43.5758V43.62C50.5 44.0035 50.5126 44.3849 50.5253 44.7684L50.5527 45.5796C50.559 45.7734 50.6643 45.9062 50.8139 45.9104C50.84 45.9104 50.867 45.9109 50.8944 45.9114H50.8944H50.8945H50.8945C50.9224 45.912 50.9506 45.9125 50.9783 45.9125C51.208 45.9125 51.4524 45.8999 51.6905 45.8872C51.8274 45.8788 51.9602 45.8725 52.0866 45.8683C52.3921 45.8577 52.43 45.6723 52.4364 45.6175C52.4574 45.3562 52.4469 45.0023 52.4364 44.6925L52.4321 44.5598L52.4364 44.5556ZM52.0255 45.4468C51.9235 45.4506 51.8182 45.4561 51.7094 45.4617L51.6715 45.4637C51.6253 45.4662 51.5788 45.4689 51.5324 45.4717C51.3435 45.4828 51.1537 45.4941 50.9762 45.489L50.9509 44.7515L50.9509 44.7505C50.9382 44.3673 50.9256 43.9842 50.9109 43.6011V43.5568C50.8982 43.2323 50.8624 42.2926 50.8792 41.8564L50.8794 41.8564C50.9636 41.8522 51.0479 41.848 51.1342 41.8459C51.3997 41.8333 51.6694 41.8206 51.9243 41.8227C51.9804 42.489 52.0003 43.6017 52.0112 44.2102V44.2103L52.0112 44.2106V44.2107L52.0128 44.3027C52.0128 44.3748 52.0144 44.4363 52.0156 44.4853L52.0156 44.4856V44.4857C52.0164 44.5182 52.0171 44.5451 52.0171 44.5661L52.0213 44.6988L52.0222 44.7345L52.0222 44.7347V44.7348C52.0284 44.9633 52.0356 45.2306 52.0276 45.4447L52.0255 45.4468ZM32.9314 48.1902C33.0051 48.1923 33.1653 48.2008 33.1653 48.2008V48.1987C33.2791 48.2008 33.4181 48.2935 33.4181 48.5463C33.4181 48.6517 33.4118 49.0836 33.4097 49.1363C33.3971 49.425 33.1274 49.4566 32.9651 49.4566C32.9502 49.4566 32.9365 49.4559 32.924 49.4554C32.9137 49.4549 32.9042 49.4545 32.8956 49.4545H32.8598H32.7923C32.6743 49.4545 32.5247 49.4545 32.4152 49.3449C32.3456 49.2754 32.3119 49.1805 32.3119 49.0626C32.3119 49.0288 32.3267 48.6854 32.333 48.5716C32.3225 48.4536 32.3499 48.3588 32.4131 48.2893C32.47 48.2282 32.5521 48.1944 32.6406 48.1987C32.6764 48.1987 32.7269 48.1966 32.7774 48.1945L32.7775 48.1945L32.7776 48.1944C32.8324 48.1902 32.8893 48.1902 32.9314 48.1902ZM32.9103 49.0373H32.9904V49.0436L32.9916 48.981L32.9916 48.981L32.9916 48.9809L32.9916 48.9808C32.9938 48.867 32.9967 48.715 32.9967 48.6201C32.9672 48.618 32.942 48.618 32.9188 48.618H32.9188C32.9018 48.618 32.8834 48.6189 32.8641 48.6199C32.8425 48.621 32.8198 48.6222 32.7965 48.6222H32.7523C32.7514 48.6514 32.7488 48.7095 32.7459 48.7747L32.7459 48.7747C32.7416 48.8692 32.7367 48.9787 32.7354 49.0373H32.7923H32.8113H32.8724H32.9103ZM54.929 46.8501C54.8532 46.7679 54.7457 46.7258 54.5961 46.7216C54.5561 46.7216 54.3972 46.7205 54.2106 46.7192C53.9452 46.7174 53.6239 46.7152 53.5089 46.7152C53.3719 46.7152 53.0559 46.7152 53.0453 46.9512C53.0453 46.9512 53.0285 47.105 53.0264 47.1746C53.0264 47.2169 53.0302 47.2688 53.0342 47.323L53.0348 47.3305L53.0348 47.3305C53.039 47.3706 53.0432 47.4106 53.0411 47.438C53.0369 47.5138 53.0643 47.5876 53.117 47.6423C53.1991 47.7266 53.3298 47.7561 53.5468 47.7456C53.6711 47.7498 54.3643 47.7645 54.4655 47.7645H54.4718C54.6151 47.7645 54.7921 47.7498 54.9058 47.6339C55.0133 47.5265 55.0133 47.3937 55.0112 47.3052V47.2525V47.2209C55.0196 47.1198 55.0323 46.9681 54.9227 46.8501H54.929ZM54.5982 47.1914V47.2294C54.594 47.2567 54.594 47.2841 54.594 47.3094V47.3368C54.5708 47.341 54.5329 47.3452 54.4739 47.3452H54.4697C54.3666 47.3452 53.9124 47.3345 53.6879 47.3292L53.6878 47.3292L53.5615 47.3263H53.5342C53.5228 47.3263 53.5123 47.3266 53.5025 47.3268C53.4852 47.3273 53.4705 47.3276 53.4583 47.3263C53.4583 47.3157 53.4583 47.3052 53.4562 47.2926C53.452 47.2546 53.4478 47.2146 53.4499 47.1851C53.4499 47.1725 53.4499 47.1556 53.452 47.1366H53.5089C53.7027 47.1366 54.4929 47.1409 54.5877 47.143H54.6024C54.6024 47.1577 54.6024 47.1767 54.6003 47.1893L54.5982 47.1914ZM36.0161 38.5577L36.0161 38.5577C36.0965 38.5544 36.1428 38.5525 36.1468 38.5525C36.2732 38.5504 36.3617 38.6389 36.3659 38.7548C36.3701 38.8707 36.2795 38.9697 36.1636 38.9739C36.0435 38.9803 33.6352 39.0835 32.3035 39.0835C32.0528 39.0835 31.8379 39.0793 31.6862 39.0709C31.5703 39.0624 31.4818 38.9634 31.4881 38.8475C31.4965 38.7316 31.5935 38.6431 31.7114 38.6495C32.5449 38.6982 35.3727 38.5837 36.0161 38.5577ZM40.4051 38.6705C40.403 38.5546 40.3103 38.4682 40.1902 38.464L38.2454 38.5062L38.2538 38.9276L40.1986 38.8854C40.3145 38.8833 40.4072 38.7864 40.4051 38.6705ZM44.0882 50.0065H44.0756V50.0044C43.9639 50.0044 43.8712 49.918 43.8649 49.8063C43.8586 49.6904 43.9471 49.5914 44.063 49.5851C44.5291 49.5597 45.6448 49.578 45.9853 49.5836C46.0403 49.5845 46.0751 49.5851 46.0836 49.5851C46.1995 49.5872 46.2922 49.6841 46.2901 49.8C46.288 49.9159 46.1848 50.0107 46.0752 50.0065C46.0743 50.0065 46.0661 50.0063 46.0514 50.006C45.8603 50.0026 44.5754 49.9791 44.0882 50.0065Z" fill="black"></path><path d="M72.9552 81C72.1033 81 71.1648 80.9667 70.1532 80.8935C64.9617 80.5341 23.3898 79.9684 16.4012 80.7404C12.7073 81.1531 10.4443 80.7537 9.47922 79.5357C9.00666 78.9434 8.94011 78.2711 9.03994 77.7919L10.2513 14.223C10.1914 12.8652 11.0167 10.782 13.5459 10.5024C17.6126 10.0498 68.9485 8.78524 73.2481 9.0315C74.0335 9.07809 74.7257 9.09806 75.3447 9.11802C78.7058 9.23117 80.7358 9.29773 80.8689 13.3577C81.4413 31.0354 79.9571 76.1679 79.8972 77.9716C79.9105 78.2645 79.844 78.8302 79.3248 79.4026C78.3464 80.4742 76.2498 81 72.9552 81ZM34.5448 78.1647C49.081 78.1647 67.005 78.4775 70.3062 78.7038C76.2432 79.1164 77.5211 78.1114 77.7075 77.9184C77.7607 76.3942 79.2516 31.1019 78.6792 13.4309C78.6348 12.0954 77.5011 11.3898 75.2781 11.3144C74.6458 11.2944 73.9336 11.2678 73.1283 11.2212C68.8486 10.975 17.8322 12.2329 13.7922 12.6855C12.5409 12.8253 12.4344 13.7637 12.4477 14.1564V14.2296L11.223 78.1314L11.2097 78.178C11.3495 78.3177 12.2613 78.9833 16.155 78.5507C18.7574 78.2645 26.072 78.158 34.5382 78.158L34.5448 78.1647Z" fill="#171F1F"></path><path d="M31.7422 72C31.6888 72 31.6622 71.9733 31.6622 71.92V66.48C31.6622 66.4267 31.6888 66.4 31.7422 66.4H32.1502C32.2035 66.4 32.2302 66.4267 32.2302 66.48V71.472C32.2302 71.4933 32.2408 71.504 32.2622 71.504H35.0862C35.1395 71.504 35.1662 71.5307 35.1662 71.584V71.92C35.1662 71.9733 35.1395 72 35.0862 72H31.7422ZM37.641 72.064C37.257 72.064 36.9264 71.9653 36.649 71.768C36.3717 71.5707 36.1797 71.2987 36.073 70.952C35.9984 70.7067 35.961 70.3787 35.961 69.968C35.961 69.5573 35.9984 69.232 36.073 68.992C36.1744 68.6507 36.3637 68.3813 36.641 68.184C36.9184 67.9867 37.2544 67.888 37.649 67.888C38.0277 67.888 38.353 67.9867 38.625 68.184C38.9024 68.3813 39.0917 68.648 39.193 68.984C39.2677 69.2133 39.305 69.5413 39.305 69.968C39.305 70.4 39.2677 70.728 39.193 70.952C39.0917 71.2987 38.9024 71.5707 38.625 71.768C38.353 71.9653 38.025 72.064 37.641 72.064ZM37.641 71.568C37.897 71.568 38.1157 71.4987 38.297 71.36C38.4784 71.216 38.601 71.024 38.665 70.784C38.713 70.592 38.737 70.3227 38.737 69.976C38.737 69.624 38.7157 69.3547 38.673 69.168C38.609 68.928 38.4837 68.7387 38.297 68.6C38.1157 68.456 37.8944 68.384 37.633 68.384C37.3717 68.384 37.1504 68.456 36.969 68.6C36.7877 68.7387 36.665 68.928 36.601 69.168C36.5584 69.3547 36.537 69.624 36.537 69.976C36.537 70.328 36.5584 70.5973 36.601 70.784C36.6597 71.024 36.7797 71.216 36.961 71.36C37.1477 71.4987 37.3744 71.568 37.641 71.568ZM42.9524 68.032C42.9524 67.9787 42.9791 67.952 43.0324 67.952H43.4404C43.4937 67.952 43.5204 67.9787 43.5204 68.032V71.864C43.5204 72.4613 43.3471 72.8987 43.0004 73.176C42.6591 73.4533 42.1871 73.592 41.5844 73.592C41.4617 73.592 41.3684 73.5893 41.3044 73.584C41.2511 73.5787 41.2244 73.5493 41.2244 73.496L41.2404 73.128C41.2404 73.1013 41.2484 73.08 41.2644 73.064C41.2804 73.0533 41.2991 73.0507 41.3204 73.056L41.5364 73.064C42.0324 73.064 42.3924 72.9653 42.6164 72.768C42.8404 72.576 42.9524 72.2693 42.9524 71.848V71.552C42.9524 71.5413 42.9471 71.536 42.9364 71.536C42.9311 71.5307 42.9231 71.5333 42.9124 71.544C42.6671 71.864 42.3177 72.024 41.8644 72.024C41.5177 72.024 41.2084 71.9307 40.9364 71.744C40.6697 71.5573 40.4911 71.2933 40.4004 70.952C40.3364 70.7333 40.3044 70.408 40.3044 69.976C40.3044 69.7413 40.3097 69.544 40.3204 69.384C40.3364 69.224 40.3657 69.08 40.4084 68.952C40.5044 68.632 40.6777 68.376 40.9284 68.184C41.1791 67.9867 41.4804 67.888 41.8324 67.888C42.3071 67.888 42.6671 68.0453 42.9124 68.36C42.9231 68.3707 42.9311 68.3733 42.9364 68.368C42.9471 68.3627 42.9524 68.3547 42.9524 68.344V68.032ZM42.9124 70.776C42.9284 70.696 42.9391 70.5973 42.9444 70.48C42.9497 70.3627 42.9524 70.192 42.9524 69.968C42.9524 69.696 42.9497 69.5147 42.9444 69.424C42.9391 69.328 42.9257 69.24 42.9044 69.16C42.8617 68.936 42.7551 68.752 42.5844 68.608C42.4191 68.4587 42.2084 68.384 41.9524 68.384C41.7017 68.384 41.4884 68.456 41.3124 68.6C41.1417 68.744 41.0217 68.9307 40.9524 69.16C40.8991 69.3307 40.8724 69.5973 40.8724 69.96C40.8724 70.3493 40.8991 70.6187 40.9524 70.768C41.0057 70.992 41.1204 71.1787 41.2964 71.328C41.4777 71.472 41.6964 71.544 41.9524 71.544C42.2137 71.544 42.4271 71.472 42.5924 71.328C42.7631 71.184 42.8697 71 42.9124 70.776ZM45.1217 67.216C44.9937 67.216 44.887 67.1733 44.8017 67.088C44.7163 67.0027 44.6737 66.896 44.6737 66.768C44.6737 66.6347 44.7163 66.528 44.8017 66.448C44.887 66.3627 44.9937 66.32 45.1217 66.32C45.2497 66.32 45.3563 66.3627 45.4417 66.448C45.527 66.528 45.5697 66.6347 45.5697 66.768C45.5697 66.896 45.527 67.0027 45.4417 67.088C45.3563 67.1733 45.2497 67.216 45.1217 67.216ZM44.8977 71.992C44.8443 71.992 44.8177 71.9653 44.8177 71.912V68.024C44.8177 67.9707 44.8443 67.944 44.8977 67.944H45.3057C45.359 67.944 45.3857 67.9707 45.3857 68.024V71.912C45.3857 71.9653 45.359 71.992 45.3057 71.992H44.8977ZM48.1047 72.04C47.8061 72.04 47.5394 71.992 47.3047 71.896C47.0754 71.8 46.8967 71.672 46.7687 71.512C46.6461 71.352 46.5847 71.1733 46.5847 70.976V70.88C46.5847 70.8267 46.6114 70.8 46.6647 70.8H47.0487C47.1021 70.8 47.1287 70.8267 47.1287 70.88V70.944C47.1287 71.12 47.2194 71.2747 47.4007 71.408C47.5874 71.536 47.8194 71.6 48.0967 71.6C48.3741 71.6 48.5981 71.5387 48.7687 71.416C48.9394 71.288 49.0247 71.128 49.0247 70.936C49.0247 70.8027 48.9794 70.6933 48.8887 70.608C48.8034 70.5227 48.6994 70.456 48.5767 70.408C48.4594 70.36 48.2754 70.2987 48.0247 70.224C47.7261 70.1387 47.4807 70.0533 47.2887 69.968C47.0967 69.8827 46.9341 69.7653 46.8007 69.616C46.6727 69.4613 46.6087 69.2667 46.6087 69.032C46.6087 68.6907 46.7421 68.4187 47.0087 68.216C47.2754 68.0133 47.6274 67.912 48.0647 67.912C48.3581 67.912 48.6167 67.96 48.8407 68.056C49.0701 68.152 49.2461 68.2853 49.3687 68.456C49.4914 68.6213 49.5527 68.808 49.5527 69.016V69.04C49.5527 69.0933 49.5261 69.12 49.4727 69.12H49.0967C49.0434 69.12 49.0167 69.0933 49.0167 69.04V69.016C49.0167 68.8347 48.9287 68.6827 48.7527 68.56C48.5821 68.4373 48.3501 68.376 48.0567 68.376C47.7847 68.376 47.5661 68.432 47.4007 68.544C47.2354 68.6507 47.1527 68.8 47.1527 68.992C47.1527 69.1733 47.2327 69.312 47.3927 69.408C47.5527 69.504 47.8007 69.6 48.1367 69.696C48.4461 69.7867 48.6967 69.872 48.8887 69.952C49.0807 70.032 49.2461 70.1493 49.3847 70.304C49.5234 70.4533 49.5927 70.6507 49.5927 70.896C49.5927 71.2427 49.4567 71.52 49.1847 71.728C48.9127 71.936 48.5527 72.04 48.1047 72.04ZM52.4365 68.344C52.4365 68.3973 52.4098 68.424 52.3565 68.424H51.4525C51.4311 68.424 51.4205 68.4347 51.4205 68.456V70.816C51.4205 71.072 51.4765 71.2533 51.5885 71.36C51.7058 71.4613 51.8871 71.512 52.1325 71.512H52.3325C52.3858 71.512 52.4125 71.5387 52.4125 71.592V71.92C52.4125 71.9733 52.3858 72 52.3325 72C52.2685 72.0053 52.1698 72.008 52.0365 72.008C51.6525 72.008 51.3618 71.936 51.1645 71.792C50.9671 71.648 50.8685 71.3813 50.8685 70.992V68.456C50.8685 68.4347 50.8578 68.424 50.8365 68.424H50.3485C50.2951 68.424 50.2685 68.3973 50.2685 68.344V68.032C50.2685 67.9787 50.2951 67.952 50.3485 67.952H50.8365C50.8578 67.952 50.8685 67.9413 50.8685 67.92V66.992C50.8685 66.9387 50.8951 66.912 50.9485 66.912H51.3405C51.3938 66.912 51.4205 66.9387 51.4205 66.992V67.92C51.4205 67.9413 51.4311 67.952 51.4525 67.952H52.3565C52.4098 67.952 52.4365 67.9787 52.4365 68.032V68.344ZM53.9185 67.216C53.7905 67.216 53.6839 67.1733 53.5985 67.088C53.5132 67.0027 53.4705 66.896 53.4705 66.768C53.4705 66.6347 53.5132 66.528 53.5985 66.448C53.6839 66.3627 53.7905 66.32 53.9185 66.32C54.0465 66.32 54.1532 66.3627 54.2385 66.448C54.3239 66.528 54.3665 66.6347 54.3665 66.768C54.3665 66.896 54.3239 67.0027 54.2385 67.088C54.1532 67.1733 54.0465 67.216 53.9185 67.216ZM53.6945 71.992C53.6412 71.992 53.6145 71.9653 53.6145 71.912V68.024C53.6145 67.9707 53.6412 67.944 53.6945 67.944H54.1025C54.1559 67.944 54.1825 67.9707 54.1825 68.024V71.912C54.1825 71.9653 54.1559 71.992 54.1025 71.992H53.6945ZM57.1016 72.064C56.7176 72.064 56.3869 71.9653 56.1096 71.768C55.8376 71.5653 55.6509 71.2933 55.5496 70.952C55.4803 70.7173 55.4456 70.3867 55.4456 69.96C55.4456 69.576 55.4803 69.2507 55.5496 68.984C55.6456 68.6533 55.8323 68.3893 56.1096 68.192C56.3869 67.9893 56.7176 67.888 57.1016 67.888C57.4909 67.888 57.8269 67.9867 58.1096 68.184C58.3976 68.3813 58.5843 68.6267 58.6696 68.92C58.6963 69.016 58.7123 69.096 58.7176 69.16V69.176C58.7176 69.2133 58.6936 69.2373 58.6456 69.248L58.2456 69.304H58.2296C58.1923 69.304 58.1683 69.28 58.1576 69.232L58.1336 69.112C58.0856 68.9093 57.9683 68.7387 57.7816 68.6C57.5949 68.456 57.3683 68.384 57.1016 68.384C56.8349 68.384 56.6109 68.456 56.4296 68.6C56.2536 68.7387 56.1389 68.9253 56.0856 69.16C56.0376 69.3627 56.0136 69.632 56.0136 69.968C56.0136 70.32 56.0376 70.592 56.0856 70.784C56.1389 71.024 56.2536 71.216 56.4296 71.36C56.6109 71.4987 56.8349 71.568 57.1016 71.568C57.3629 71.568 57.5869 71.5013 57.7736 71.368C57.9656 71.2293 58.0856 71.0533 58.1336 70.84V70.808L58.1416 70.776C58.1469 70.7227 58.1789 70.7013 58.2376 70.712L58.6296 70.776C58.6829 70.7867 58.7069 70.816 58.7016 70.864L58.6696 71.024C58.5896 71.3333 58.4056 71.584 58.1176 71.776C57.8296 71.968 57.4909 72.064 57.1016 72.064Z" fill="black"></path></g><defs><clipPath id="clip0_15_8546"><rect width="90" height="90" fill="white"></rect></clipPath></defs></svg>` : `${stageId === "production" ? `<svg width="90" height="90" viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg" class="svelte-1j9izwh"><g clip-path="url(#clip0_15_8576)"><rect opacity="0.75" x="12" y="12" width="66" height="66" fill="white"></rect><path fill-rule="evenodd" clip-rule="evenodd" d="M43.7323 30.411C43.8641 30.3616 43.93 30.2134 43.8806 30.0816V30.0926C43.8311 29.9609 43.6829 29.895 43.5511 29.9444C43.2546 30.0597 42.9691 30.1146 42.6836 30.1146C42.3377 30.1146 41.9973 30.0377 41.6404 29.873L41.4976 29.8072L41.4806 29.7993C40.9071 29.5372 40.2006 29.2143 39.5265 29.2143C38.917 29.2143 38.4284 29.4833 38.0825 30.0048C37.8169 30.4084 37.7517 30.9044 37.6881 31.3886L37.6817 31.4375C37.5993 32.1127 37.5224 32.7001 36.9953 32.9691C36.8526 33.0405 36.6933 33.0734 36.5067 33.0734C36.2266 33.0734 35.9137 32.9965 35.6117 32.9197C35.2932 32.8373 34.9583 32.755 34.6399 32.755C34.0469 32.755 33.6186 33.0405 33.3166 33.6333C32.8829 34.4952 32.8938 35.5107 33.3551 36.5702C33.5417 37.0039 33.7833 37.4375 34.0743 37.8602C34.3049 38.1951 34.4697 38.4531 34.6289 38.7605C34.6728 38.8483 34.7607 38.8977 34.854 38.8977C34.9913 38.8922 35.1066 38.7824 35.1066 38.6397V38.5903C35.0846 38.1237 35.4085 37.5254 35.7325 37.2289C35.9634 37.0138 36.2394 36.8639 36.5367 36.7025L36.5367 36.7025L36.5367 36.7024L36.578 36.68C36.7647 36.5812 36.9569 36.4769 37.1381 36.3561C37.4895 36.1255 37.7695 35.873 37.9836 35.5876C38.1648 35.346 38.2472 35.121 38.3131 34.9398L38.3142 34.9366C38.4178 34.6532 38.4738 34.5002 38.8621 34.3634C39.1202 34.2701 39.4332 34.2646 39.7626 34.2591L39.8163 34.2575C40.1563 34.2473 40.5047 34.2369 40.8333 34.1274C41.9588 33.7541 42.3212 33.1667 42.6397 32.1512L42.6562 32.0963C42.8538 31.454 43.1009 30.6525 43.7323 30.411ZM41.4263 30.3287C41.86 30.5263 42.2993 30.6196 42.7275 30.6141H42.733C42.453 31.0258 42.2938 31.5309 42.1675 31.9426L42.151 31.9975C41.8655 32.9032 41.602 33.3314 40.674 33.6388C40.3995 33.7321 40.0865 33.7376 39.7516 33.7431L39.6998 33.7447C39.3642 33.7549 39.0156 33.7655 38.6919 33.8803C38.0815 34.0929 37.958 34.4298 37.8381 34.7569L37.8354 34.7642L37.8305 34.7774C37.7717 34.938 37.7109 35.1039 37.5773 35.2802C37.4016 35.5217 37.1655 35.7303 36.8636 35.9279C36.6933 36.0377 36.5231 36.131 36.3365 36.2298L36.3322 36.2321C36.0096 36.4071 35.6763 36.5878 35.3866 36.8502C35.123 37.0917 34.865 37.476 34.7167 37.8932C34.6677 37.8155 34.6156 37.7378 34.5604 37.6556L34.5602 37.6554L34.5602 37.6553L34.5026 37.5693C34.2336 37.174 34.0084 36.7678 33.8327 36.3671C33.4264 35.4394 33.41 34.5995 33.7833 33.8639C34.0469 33.3369 34.3653 33.2655 34.6454 33.2655C34.9034 33.2655 35.1889 33.3369 35.4909 33.4137L35.5355 33.4247L35.5355 33.4247C35.856 33.5037 36.1816 33.5839 36.5122 33.5839C36.7812 33.5839 37.0173 33.529 37.2314 33.4192C38.0001 33.0295 38.1044 32.2115 38.1923 31.4924C38.2472 31.0258 38.3021 30.5922 38.5107 30.2793C38.7633 29.9005 39.0873 29.7193 39.5265 29.7193C40.0975 29.7193 40.7564 30.0212 41.2835 30.2628L41.4263 30.3287ZM58.9316 32.9748C58.97 33.0461 58.9755 33.1285 58.9426 33.2053C58.2672 34.737 56.5431 35.3573 55.8348 35.5494C55.6755 35.5934 55.5053 35.6153 55.3131 35.6153C54.9068 35.6153 54.484 35.5165 54.0777 35.4177L54.0643 35.4146C53.6905 35.3279 53.3437 35.2475 53.0344 35.2475C52.8093 35.2475 52.6336 35.2914 52.4963 35.3847C52.2631 35.5366 52.1263 35.7848 51.9801 36.0501L51.9747 36.06C51.8154 36.3509 51.6507 36.6474 51.3542 36.8725C50.9863 37.1524 50.5031 37.2952 49.9321 37.2952C49.6685 37.2952 49.383 37.2677 49.059 37.2073C48.488 37.103 48.0432 36.7846 47.6094 36.4717L47.5978 36.4634C47.1629 36.1536 46.7541 35.8624 46.2752 35.8624C46.1379 35.8624 45.9951 35.8843 45.8469 35.9337C45.2813 36.1149 44.7542 36.4058 44.3149 36.7682C43.7823 37.2073 43.5572 37.5971 43.4803 38.2174C43.4693 38.3217 43.387 38.4096 43.2826 38.437C43.275 38.437 43.2662 38.4382 43.2567 38.4395C43.2458 38.4409 43.234 38.4425 43.2222 38.4425C43.1399 38.4425 43.0575 38.3986 43.0081 38.3272C42.8903 38.1452 42.7882 37.958 42.6915 37.7808L42.6841 37.7673C42.5743 37.5587 42.47 37.3665 42.3437 37.1799C42.0966 36.8285 41.8385 36.3949 41.8001 35.8788C41.7122 34.8687 42.3272 33.6061 43.3815 33.3371C43.4968 33.3096 43.6121 33.2932 43.7274 33.2932C44.1172 33.2932 44.4522 33.4578 44.7487 33.6061L44.7652 33.6141C45.006 33.7319 45.2314 33.8421 45.4515 33.8421C45.5998 33.8421 45.7425 33.7927 45.8908 33.6829C46.197 33.4642 46.4161 32.9896 46.6132 32.5628L46.6156 32.5575C46.6925 32.3874 46.7638 32.2336 46.8407 32.0909C47.3019 31.2345 47.9608 30.2518 48.9218 30.2518C49.383 30.2518 49.8442 30.4714 50.3384 30.9271C50.4274 31.0089 50.5094 31.0885 50.5876 31.1642L50.5878 31.1644L50.588 31.1646L50.588 31.1647C50.6303 31.2056 50.6714 31.2454 50.7118 31.2839C51.1346 31.6956 51.3707 31.9097 51.6617 31.9097C51.8813 31.9097 52.1669 31.7835 52.5347 31.52C53.1442 31.0863 53.6274 30.8173 54.16 30.8173C54.5773 30.8173 55.0111 30.982 55.5712 31.3498C55.6158 31.3795 55.6597 31.4086 55.703 31.4372L55.7032 31.4374L55.7042 31.438L55.7052 31.4387C55.7892 31.4942 55.8708 31.5483 55.9501 31.6023C56.8615 32.2172 57.5863 32.7058 58.7504 32.843C58.8328 32.854 58.9042 32.8979 58.9426 32.9693L58.9316 32.9748ZM55.703 35.0554C56.8835 34.7315 57.8334 34.0892 58.3166 33.2986C57.2363 33.0958 56.4955 32.5972 55.6567 32.0326L55.6536 32.0305C55.6052 31.9976 55.556 31.9646 55.5063 31.9313L55.506 31.9311L55.5058 31.931L55.5055 31.9308C55.4312 31.881 55.3557 31.8305 55.2802 31.778C54.8135 31.4706 54.4675 31.3278 54.1546 31.3278C53.7592 31.3278 53.3529 31.5584 52.8258 31.9317C52.3645 32.2611 51.9911 32.4148 51.6562 32.4148C51.1432 32.4148 50.7983 32.0785 50.3574 31.6485L50.3494 31.6407C50.3097 31.603 50.27 31.5645 50.2297 31.5255L50.2297 31.5254L50.2294 31.5251C50.1525 31.4507 50.0733 31.374 49.987 31.2949C49.5971 30.9381 49.2347 30.7569 48.9163 30.7569C48.3782 30.7569 47.8785 31.24 47.2855 32.327C47.2196 32.4532 47.1482 32.6015 47.0768 32.7661C46.8572 33.2492 46.6046 33.7927 46.1873 34.0947C45.9457 34.2648 45.7041 34.3472 45.4515 34.3472C45.1111 34.3472 44.8091 34.199 44.5236 34.0562L44.5084 34.0488C44.245 33.9198 43.9969 33.7982 43.7329 33.7982C43.656 33.7982 43.5846 33.8092 43.5132 33.8257C42.75 34.0233 42.2503 35.0444 42.3162 35.8294C42.3492 36.2247 42.5578 36.5705 42.772 36.8834C42.8942 37.0573 42.9922 37.2352 43.0868 37.4067L43.0868 37.4068L43.1344 37.4928C43.2936 37.0701 43.5682 36.7187 43.9964 36.3674C44.4851 35.9667 45.0727 35.6428 45.6986 35.4396C45.8963 35.3738 46.094 35.3408 46.2861 35.3408C46.9222 35.3408 47.4154 35.69 47.8956 36.03L47.9224 36.049C48.3232 36.34 48.7076 36.6144 49.1688 36.6968C49.4599 36.7517 49.7179 36.7736 49.9485 36.7736C50.4153 36.7736 50.7777 36.6693 51.0632 36.4552C51.2641 36.302 51.3937 36.0724 51.5304 35.8302L51.5305 35.8302L51.5464 35.802L51.5475 35.8C51.7173 35.4877 51.893 35.1647 52.2382 34.9456C52.4634 34.7973 52.7324 34.726 53.0619 34.726C53.4352 34.726 53.8361 34.8193 54.2204 34.9126L54.2593 34.9216C54.6259 35.0067 55.001 35.0938 55.3351 35.0938C55.4778 35.0938 55.6041 35.0773 55.7194 35.0444L55.703 35.0554ZM56.1363 33.7653C56.1857 33.897 56.1198 34.0452 55.9881 34.0946C55.2019 34.4003 54.4212 34.2392 53.7322 34.0971L53.7204 34.0946C52.9243 33.9245 52.238 33.7817 51.6066 34.2703C51.4034 34.4295 51.2606 34.6381 51.1124 34.8577L51.1121 34.8581C50.8432 35.2587 50.5411 35.7085 49.8331 35.747H49.7562C49.0973 35.747 48.2957 35.3023 47.7082 34.9729C47.6313 34.929 47.5545 34.8851 47.4886 34.8522C47.3623 34.7863 47.3184 34.6271 47.3843 34.5063C47.4502 34.3801 47.6094 34.3362 47.7302 34.402C47.8016 34.4405 47.8784 34.4844 47.9553 34.5283L47.966 34.5342L47.9661 34.5342L47.9661 34.5343C48.4933 34.8253 49.2876 35.2637 49.8056 35.2364C50.2614 35.2145 50.4425 34.9455 50.6896 34.5722C50.8434 34.3417 51.0245 34.0782 51.2936 33.8641C52.1107 33.2323 52.9711 33.4111 53.8104 33.5855L53.8303 33.5896L53.8376 33.5911C54.5158 33.7333 55.1613 33.8686 55.8069 33.617C55.9386 33.5676 56.0869 33.628 56.1418 33.7653H56.1363ZM55.0428 52.5393L55.0385 52.4249L54.9781 52.4798C54.9452 51.5959 54.9123 50.6791 54.9013 49.7788V49.7514V49.7294L54.8981 49.7235L54.897 49.7216C54.8932 49.7151 54.8903 49.71 54.8903 49.702C54.8848 49.6965 54.8848 49.6855 54.8848 49.68C54.8848 49.6773 54.8821 49.6731 54.8793 49.669C54.8766 49.6649 54.8738 49.6608 54.8738 49.658C54.8717 49.6539 54.8696 49.6505 54.8678 49.6476C54.8649 49.6429 54.8628 49.6395 54.8628 49.6361C54.8573 49.6251 54.8519 49.6196 54.8464 49.6141L54.8299 49.5977C54.8244 49.5949 54.8203 49.5908 54.8168 49.5874C54.8134 49.5839 54.8107 49.5812 54.8079 49.5812C54.8061 49.5794 54.8043 49.5769 54.8024 49.5745C54.7988 49.5696 54.7951 49.5647 54.7915 49.5647C54.7902 49.5647 54.7889 49.5646 54.7878 49.5643C54.7865 49.564 54.7854 49.5636 54.7843 49.5631C54.782 49.5621 54.7798 49.5606 54.7777 49.5592C54.7736 49.5565 54.7695 49.5537 54.764 49.5537C54.7585 49.5483 54.753 49.5428 54.7475 49.5428C54.7365 49.5373 54.7256 49.5318 54.7146 49.5318H54.7036H54.6542H53.0728L53.0738 49.4636C53.079 49.1104 53.0845 48.7369 53.0948 48.3295C53.0948 48.2881 53.0985 48.2357 53.1026 48.1764L53.1027 48.1763C53.1057 48.1334 53.1089 48.0869 53.1112 48.0386C53.1332 47.7586 53.1552 47.4292 53.1332 47.1218C53.1112 46.765 53.0289 46.4411 52.8257 46.2489C52.4963 45.936 51.8758 46.0129 51.3816 46.0787C51.3348 46.0836 51.2889 46.0889 51.245 46.094C51.1395 46.1062 51.0451 46.1172 50.9753 46.1172H49.9265C48.8284 46.1117 47.6863 46.1117 46.5661 46.1666C46.4618 46.1721 46.363 46.2489 46.3355 46.3532C46.2312 46.732 46.2422 47.1163 46.2971 47.4896V47.5171C46.3245 47.7092 46.363 47.8958 46.4014 48.077L46.4113 48.1264C46.4409 48.2736 46.4695 48.4163 46.4893 48.5546C46.5442 48.8895 46.5551 49.2298 46.5551 49.5702H46.017L46.0167 49.5658C45.7368 45.9825 45.4569 42.3992 45.1824 38.8213V38.7994C45.1824 38.7955 45.1831 38.7923 45.1838 38.7893C45.1849 38.7838 45.186 38.779 45.1824 38.7719C45.1803 38.7677 45.1782 38.7643 45.1764 38.7614C45.175 38.7591 45.1737 38.757 45.1729 38.7552L45.1719 38.7527C45.1716 38.7517 45.1714 38.7508 45.1714 38.75C45.166 38.739 45.1605 38.728 45.1605 38.7225C45.155 38.717 45.1495 38.706 45.1495 38.706C45.144 38.6951 45.1385 38.6841 45.133 38.6786C45.1275 38.6676 45.122 38.6676 45.122 38.6676L45.0946 38.6402C45.0836 38.6292 45.0561 38.6127 45.0561 38.6127L45.0464 38.6059C45.0348 38.5976 45.0252 38.5908 45.0122 38.5908C45.0012 38.5798 44.9848 38.5798 44.9683 38.5798H44.9518H44.9189C44.4467 38.6072 43.9744 38.6456 43.5132 38.6841C42.9257 38.7335 42.3162 38.7829 41.7232 38.8158H41.7012H41.6738L41.6715 38.8161C41.6698 38.8164 41.6677 38.817 41.6656 38.8176L41.6628 38.8186C41.6587 38.8199 41.6545 38.8213 41.6518 38.8213C41.6463 38.8268 41.6408 38.8323 41.6298 38.8323C41.6234 38.8323 41.6189 38.8361 41.6151 38.8392C41.6136 38.8404 41.6122 38.8416 41.6109 38.8423L41.6092 38.8431L41.6079 38.8433C41.6051 38.8433 41.601 38.846 41.5969 38.8488L41.5936 38.8509L41.5898 38.8531L41.5875 38.854L41.5859 38.8543C41.5841 38.8561 41.5823 38.8585 41.5804 38.861C41.5768 38.8658 41.5731 38.8707 41.5694 38.8707L41.553 38.8872C41.5519 38.8883 41.5505 38.8894 41.5491 38.8905L41.5463 38.8927C41.5414 38.8963 41.5365 38.9 41.5365 38.9037C41.5338 38.9091 41.5296 38.9133 41.5262 38.9167L41.5262 38.9167C41.5228 38.9201 41.52 38.9229 41.52 38.9256C41.5145 38.9311 41.509 38.9421 41.509 38.9476C41.5035 38.9531 41.4981 38.9641 41.4981 38.9695C41.4926 38.9805 41.4926 38.986 41.4926 38.997C41.4871 39.0025 41.4871 39.0135 41.4871 39.0189V39.0464V39.0629C41.4926 39.3593 41.5035 39.6612 41.52 39.9522C41.5255 40.0949 41.531 40.2377 41.5365 40.3859C41.5475 40.6 41.553 40.8086 41.553 41.0172C41.553 42.1206 41.5145 43.2845 41.4377 44.5691C41.3992 44.5361 41.3663 44.5087 41.3278 44.4812C40.9029 44.137 40.4674 43.8244 40.0471 43.5228L40.0471 43.5228L40.0471 43.5228L40.0471 43.5228L40.0471 43.5227L40.047 43.5227L40.047 43.5227L40.047 43.5227L40.021 43.5041C39.741 43.3064 39.4555 43.0978 39.1754 42.8892C39.1205 42.8398 39.0491 42.8288 38.9778 42.8398C38.9064 42.8508 38.846 42.8892 38.8075 42.9496C38.5 43.4107 38.0663 43.8609 37.627 44.3001L37.605 44.1464L37.566 43.8431L37.566 43.8429C37.3803 42.401 37.1897 40.9214 37.0614 39.4801V39.4636V39.4362C37.0559 39.4307 37.0559 39.4197 37.0559 39.4142C37.0505 39.4087 37.045 39.3977 37.045 39.3922C37.0429 39.3881 37.0408 39.3847 37.039 39.3818C37.0361 39.3771 37.034 39.3737 37.034 39.3703C37.0285 39.3648 37.0175 39.3538 37.0175 39.3483C37.0157 39.3465 37.0132 39.3447 37.0108 39.3428C37.0059 39.3392 37.001 39.3355 37.001 39.3319C36.9955 39.3209 36.9901 39.3154 36.9846 39.3099C36.9839 39.3099 36.9832 39.3097 36.9825 39.3094L36.9805 39.3082C36.9791 39.3072 36.9777 39.3058 36.9763 39.3044C36.9736 39.3017 36.9708 39.2989 36.9681 39.2989C36.9626 39.2934 36.9516 39.2825 36.9461 39.2825C36.9419 39.2804 36.9386 39.2783 36.9357 39.2765L36.9356 39.2765C36.931 39.2736 36.9276 39.2715 36.9242 39.2715C36.9187 39.266 36.9077 39.2605 36.9022 39.2605C36.8967 39.255 36.8857 39.255 36.8802 39.255H36.8583H36.8308H36.8198H33.4045H33.3551C33.346 39.255 33.3386 39.2583 33.332 39.2613C33.3265 39.2638 33.3216 39.266 33.3167 39.266H33.3057C33.3002 39.2687 33.2933 39.2728 33.2865 39.277L33.2864 39.277L33.2864 39.277C33.2795 39.2811 33.2727 39.2852 33.2672 39.2879C33.2563 39.2934 33.2453 39.3044 33.2343 39.3154C33.2233 39.3209 33.2123 39.3319 33.2068 39.3428L33.2014 39.3483C33.1959 39.3538 33.1849 39.3648 33.1849 39.3758C33.1794 39.3813 33.1794 39.3922 33.1794 39.3922C33.1684 39.4032 33.1684 39.4087 33.1684 39.4197C33.1629 39.4252 33.1629 39.4362 33.1629 39.4417V39.4691V39.4966C33.1629 40.3205 33.1375 41.1613 33.1128 41.982L33.1128 41.982V41.9821L33.1025 42.3238L33.092 42.6738V42.6738V42.6739V42.6739V42.6739V42.674V42.674V42.674V42.674V42.6741V42.6741V42.6741V42.6741V42.6742V42.6742V42.6742V42.6742C33.0673 43.4854 33.0421 44.3129 33.0421 45.1235C33.0367 46.1272 32.9093 47.2582 32.7746 48.454L32.7676 48.5162C32.7236 48.8895 32.6797 49.2738 32.6413 49.658C32.0153 49.6635 31.3839 49.6635 30.7524 49.6635H30.6591H30.6316H30.6097C30.6042 49.6635 30.5987 49.6663 30.5932 49.669C30.5877 49.6718 30.5822 49.6745 30.5767 49.6745H30.5602L30.5517 49.6785C30.5418 49.6829 30.5302 49.6881 30.5218 49.6965C30.5108 49.702 30.4998 49.7129 30.4889 49.7239C30.4834 49.7294 30.4793 49.7363 30.4751 49.7431C30.471 49.75 30.4669 49.7569 30.4614 49.7624C30.4504 49.7733 30.4394 49.7898 30.4394 49.8008V49.8063C30.434 49.8172 30.4285 49.8282 30.4285 49.8392V49.8557V49.8831V49.9051C30.434 52.3261 30.4724 54.7855 30.5108 57.1625L30.5602 60.5387V60.5661V60.5881C30.5602 60.5991 30.5602 60.6101 30.5657 60.6155C30.5712 60.621 30.5712 60.632 30.5712 60.6375C30.5712 60.6403 30.574 60.6444 30.5767 60.6485C30.5795 60.6526 30.5822 60.6567 30.5822 60.6595C30.5839 60.6628 30.5856 60.6656 30.5871 60.6681L30.5882 60.67C30.5911 60.6746 30.5932 60.678 30.5932 60.6814C30.5987 60.6924 30.6042 60.6979 30.6097 60.7034C30.6115 60.7052 30.6133 60.7077 30.6152 60.7101C30.6188 60.715 30.6225 60.7199 30.6261 60.7199C30.6371 60.7253 30.6426 60.7308 30.6481 60.7363C30.6499 60.7382 30.6518 60.7406 30.6536 60.743C30.6573 60.7479 30.6609 60.7528 30.6646 60.7528C30.6701 60.7583 30.681 60.7638 30.6865 60.7638C30.6907 60.7659 30.6941 60.768 30.697 60.7698C30.7017 60.7727 30.7051 60.7748 30.7085 60.7748C30.7195 60.7857 30.7305 60.7857 30.7414 60.7857H30.7579H30.8073H30.8128C31.3394 60.7673 31.8699 60.7333 32.3879 60.7L32.6797 60.6814C33.1464 60.6485 33.6296 60.6155 34.1073 60.5936C35.6064 60.5277 37.1328 60.5332 38.6154 60.5442H38.6758C39.1641 60.5497 39.6579 60.5497 40.1572 60.5497H40.1583C40.9215 60.5497 41.6957 60.5387 42.4645 60.5167C45.1715 60.4344 47.4282 60.3575 49.7728 60.1819C50.6513 60.116 51.5518 60.0666 52.4853 60.0281H52.4963C53.2266 60.0007 53.9843 59.9787 54.7695 59.9678H54.7915H54.8189C54.8299 59.9623 54.8464 59.9513 54.8464 59.9513H54.8683C54.8711 59.9513 54.8752 59.9485 54.8793 59.9458C54.8834 59.9431 54.8875 59.9403 54.8903 59.9403C54.9013 59.9348 54.9068 59.9293 54.9123 59.9293C54.9232 59.9238 54.9287 59.9184 54.9342 59.9129L54.9371 59.9096L54.9397 59.9062C54.9434 59.9013 54.947 59.8964 54.9507 59.8964C54.9562 59.8854 54.9617 59.8799 54.9672 59.8744C54.9682 59.8734 54.9694 59.8724 54.9708 59.8713L54.9739 59.869C54.9767 59.8668 54.9795 59.8647 54.9814 59.8626C54.9828 59.861 54.9836 59.8595 54.9836 59.858C54.9891 59.8525 54.9946 59.8415 54.9946 59.836C54.9967 59.8318 54.9988 59.8284 55.0006 59.8255C55.0035 59.8208 55.0056 59.8174 55.0056 59.814C55.0166 59.8031 55.0166 59.7976 55.0166 59.7866C55.0221 59.7811 55.0221 59.7701 55.0221 59.7646V59.7372V59.7152C55.0221 58.8588 55.0385 58.1122 55.077 57.4205C55.1628 55.7852 55.1019 54.1394 55.0428 52.5393ZM54.5224 52.4468C54.5883 54.0718 54.6487 55.7462 54.5608 57.3931H54.5553C54.5224 58.0244 54.5004 58.7051 54.5004 59.4627C53.9019 59.4737 53.3199 59.4847 52.7543 59.5066V59.4792C52.8147 58.5624 52.8751 57.6182 52.8532 56.6904C52.8441 56.2467 52.8201 55.7993 52.7966 55.3605L52.7818 55.0819C52.7434 54.3902 52.7049 53.671 52.7049 52.9684V52.9354V52.9189C52.6939 52.8695 52.6665 52.8256 52.6335 52.7927C52.6335 52.7872 52.6226 52.7817 52.6226 52.7817C52.5731 52.7433 52.5182 52.7158 52.4523 52.7158H52.0735C51.5683 52.7213 51.0467 52.7268 50.5305 52.7158C47.4231 52.6282 44.2227 52.7757 41.1312 52.9181L41.131 52.9181L41.1137 52.9189C40.6832 52.9371 40.2466 52.9565 39.8085 52.9759L39.8065 52.976L39.8005 52.9763C39.3136 52.9979 38.825 53.0196 38.3408 53.0397H38.3188H38.2914C38.2823 53.0397 38.2749 53.043 38.2683 53.046C38.2628 53.0485 38.2579 53.0507 38.253 53.0507H38.242C38.2376 53.0529 38.2342 53.0559 38.2309 53.0587C38.2258 53.0631 38.2212 53.0672 38.2145 53.0672C38.1926 53.0781 38.1706 53.0946 38.1541 53.1166C38.1267 53.1495 38.1102 53.1825 38.0992 53.2209C38.0937 53.2264 38.0937 53.2374 38.0937 53.2428V53.2593V53.2922V53.3307V53.3417C38.3573 54.4725 38.4122 55.6913 38.4122 56.91C38.4122 57.3162 38.4067 57.7225 38.4012 58.1287C38.4001 58.2499 38.3989 58.3716 38.3976 58.4939L38.3976 58.4942C38.3923 58.9978 38.3869 59.5093 38.3957 60.0172C36.9791 60.0062 35.5185 60.0007 34.0744 60.0666C33.5912 60.0885 33.108 60.1215 32.6358 60.1544C32.1142 60.1928 31.5761 60.2258 31.0489 60.2477L30.9995 57.1296C30.9611 54.8349 30.9281 52.4688 30.9172 50.1357C31.2404 50.1357 31.5651 50.1343 31.8904 50.1329H31.8911H31.8917H31.8923H31.893H31.8936H31.8943H31.8949H31.8956H31.8962H31.8969H31.8976H31.8982H31.8989H31.8996H31.9002H31.9009C32.2241 50.1315 32.548 50.1302 32.8719 50.1302C34.4533 50.1247 36.1335 50.1137 38.0114 50.0972C39.093 50.0918 40.1692 50.081 41.2507 50.0701L41.2516 50.0701L41.2839 50.0698L46.8462 50.0204C49.2457 49.9984 51.1016 49.9874 52.8532 49.9819H52.8971H54.4455C54.462 50.8109 54.4895 51.6398 54.5224 52.4468ZM52.6412 47.9144L52.639 47.9453L52.6335 47.9398C52.6335 47.9859 52.6305 48.029 52.6276 48.0699V48.0699L52.6276 48.07C52.625 48.1069 52.6226 48.142 52.6226 48.1758C52.3061 48.1875 51.9897 48.2008 51.6757 48.214L51.6757 48.214C51.4013 48.2255 51.1289 48.2369 50.86 48.2472L50.5164 48.2607L50.5163 48.2608C49.3664 48.3063 48.185 48.353 47.0219 48.368C47.0072 48.2691 46.9877 48.1703 46.9682 48.0715C46.9584 48.0221 46.9487 47.9727 46.9395 47.9233C46.9313 47.8849 46.9244 47.8464 46.9175 47.808C46.9107 47.7696 46.9038 47.7312 46.8956 47.6927C47.1646 47.7092 47.4337 47.7147 47.7082 47.7147C48.8481 47.7147 50.0192 47.6052 51.1657 47.498L51.1658 47.498L51.2553 47.4896C51.7221 47.4457 52.1998 47.4018 52.6665 47.3633C52.6665 47.5635 52.6521 47.7636 52.6412 47.9144ZM52.6109 48.7255C52.6056 48.9879 52.6006 49.2399 52.6006 49.4769V49.4714L51.605 49.4781L51.604 49.4781C50.2699 49.487 48.8304 49.4967 47.1042 49.5098C47.1042 49.3012 47.0987 49.0926 47.0823 48.8785C48.2304 48.8636 49.3919 48.8172 50.5263 48.7719L50.882 48.7577C51.2627 48.7431 51.6482 48.7285 52.0338 48.7138L52.6116 48.6919L52.6109 48.7255ZM52.5127 46.5618C52.5677 46.6167 52.6061 46.721 52.6281 46.8473C52.1558 46.8857 51.6726 46.9297 51.2059 46.9736L51.1888 46.9752C49.7336 47.1119 48.2298 47.2532 46.8187 47.1712C46.8022 46.9845 46.8022 46.7979 46.8297 46.6167C47.873 46.5728 48.9382 46.5728 49.965 46.5728H51.0137C51.1361 46.5728 51.2868 46.5539 51.4483 46.5336L51.486 46.5289C51.8099 46.485 52.359 46.4191 52.5127 46.5618ZM52.2506 59.3325L52.2437 59.4462L52.2327 59.4517V59.5286C51.3706 59.5615 50.536 59.6109 49.7179 59.6713C47.3843 59.847 45.133 59.9238 42.4315 60.0062C41.2565 60.0446 40.0649 60.0391 38.9009 60.0336C38.8899 59.4078 38.8954 58.771 38.9064 58.1507L38.9073 58.083V58.083C38.9291 56.5617 38.9514 54.9998 38.6538 53.5393C39.4829 53.5063 40.3175 53.4679 41.1302 53.4295L41.1465 53.4287C44.2273 53.2862 47.4172 53.1387 50.5086 53.2264C51.0357 53.2374 51.5628 53.2319 52.068 53.2264H52.1888C52.1998 53.8577 52.2327 54.4945 52.2657 55.1093L52.28 55.3764L52.28 55.3765C52.3037 55.8148 52.3279 56.2638 52.337 56.7014C52.3581 57.5641 52.3035 58.4621 52.2506 59.3325ZM45.5393 49.5208L41.5639 49.5592L41.5585 49.5537C41.6024 49.0267 41.6408 48.5711 41.6793 48.1484C41.7946 46.9626 41.8769 45.9854 41.9373 45.0796C42.0417 43.5864 42.0856 42.2469 42.0856 40.9843C42.0856 40.9191 42.0842 40.8512 42.0829 40.7826C42.0815 40.7126 42.0801 40.6419 42.0801 40.5725C42.6676 40.5176 43.2606 40.4298 43.8372 40.342C44.1556 40.2926 44.4851 40.2432 44.8145 40.1992L45.5393 49.5208ZM44.7267 39.0684L44.7761 39.6887H44.7706C44.5316 39.7195 44.2925 39.7558 44.0553 39.7918L44.0551 39.7918L44.0549 39.7918C43.9545 39.807 43.8544 39.8222 43.7548 39.8369C43.1947 39.9248 42.6237 40.0126 42.0581 40.062C42.0526 40.0071 42.0526 39.9577 42.0526 39.9028C42.0417 39.6942 42.0307 39.4801 42.0252 39.2715C42.392 39.2483 42.7588 39.2197 43.1218 39.1914C43.275 39.1795 43.4275 39.1676 43.5791 39.1562C43.7607 39.143 43.9436 39.1286 44.1271 39.1142L44.1273 39.1141L44.128 39.1141L44.1288 39.114L44.1289 39.114L44.1291 39.114L44.1293 39.114L44.1294 39.114L44.1298 39.1139C44.3283 39.0983 44.5275 39.0826 44.7267 39.0684ZM41.4212 45.1784C41.3608 46.0403 41.2839 46.9736 41.1741 48.1045L41.1796 48.099C41.1357 48.5381 41.0972 49.0103 41.0533 49.5592C40.5866 49.5647 40.1199 49.5688 39.6531 49.573C39.1864 49.5771 38.7197 49.5812 38.253 49.5867C38.1322 48.0001 37.9345 46.4081 37.7423 44.9094L37.8521 44.7996C38.2969 44.3605 38.7526 43.9048 39.1095 43.4272C39.3237 43.5864 39.5378 43.7401 39.752 43.8938L39.9314 44.024C40.2981 44.2899 40.6735 44.5621 41.0368 44.8545C41.1576 44.9533 41.2894 45.0631 41.4212 45.1784ZM37.2152 44.849C37.4074 46.3697 37.6105 47.9837 37.7368 49.5922L37.7313 49.5867C36.0786 49.6032 34.5796 49.6141 33.1574 49.6196C33.1778 49.4277 33.1997 49.2358 33.2215 49.0447L33.2215 49.0445L33.2216 49.0441C33.2409 48.8746 33.2602 48.7058 33.2782 48.5381L33.303 48.3161C33.4315 47.1634 33.5528 46.0761 33.5528 45.0906C33.5583 44.1683 33.5857 43.2241 33.6132 42.3073C33.6296 41.8791 33.6406 41.4454 33.6516 41.0062C34.3105 40.9898 34.9804 40.9678 35.6228 40.9404C35.8068 40.9349 35.9893 40.928 36.1719 40.9211L36.1727 40.9211C36.355 40.9143 36.5373 40.9074 36.721 40.9019C36.8418 41.9999 36.9846 43.1033 37.1273 44.1793L37.2152 44.849ZM36.1361 40.4106H36.1361H36.1361H36.1361H36.1361H36.1361H36.136H36.136H36.136H36.136H36.136H36.136H36.136H36.1359H36.1359H36.1359H36.1359C35.9589 40.4175 35.782 40.4243 35.6064 40.4298H35.6009C34.9694 40.4573 34.3105 40.4792 33.6626 40.4957L33.6629 40.4798C33.6683 40.2273 33.6736 39.9798 33.6736 39.7271H36.6002L36.6331 40.059L36.6661 40.3914C36.4904 40.3969 36.3132 40.4037 36.1361 40.4106ZM52.6497 51.2335C52.7265 51.3268 52.7265 51.4694 52.6442 51.5627C52.5948 51.6176 52.5235 51.6505 52.4521 51.6505C52.3918 51.6505 52.3314 51.6286 52.282 51.5847C52.1613 51.4804 52.1119 51.3268 52.1448 51.1676C52.1723 51.0304 52.3094 50.9427 52.4466 50.9701C52.5674 50.9975 52.6552 51.1073 52.6497 51.228V51.2335ZM51.3646 57.2392V57.2282L51.3701 57.2447C51.3489 56.7256 51.2919 56.1964 51.2386 55.7012L51.2328 55.6473L51.2054 55.4167C51.1725 55.1395 51.1436 54.8542 51.1153 54.5747L51.1011 54.4341V54.4231V54.3957C51.0956 54.3902 51.0956 54.3792 51.0956 54.3737C51.0901 54.3627 51.0846 54.3572 51.0846 54.3463C51.0825 54.3421 51.0804 54.3387 51.0786 54.3358C51.0757 54.3311 51.0736 54.3277 51.0736 54.3243C51.0709 54.3188 51.0667 54.3147 51.0633 54.3113L51.0619 54.3098C51.0607 54.3087 51.0597 54.3076 51.0589 54.3065C51.0578 54.3051 51.0571 54.3037 51.0571 54.3024C51.0553 54.3005 51.0529 54.2987 51.0504 54.2969C51.0455 54.2932 51.0407 54.2895 51.0407 54.2859L51.0242 54.2694L51.0215 54.2663L51.0187 54.2627C51.015 54.2578 51.0114 54.2529 51.0077 54.2529C50.9967 54.2529 50.9912 54.2475 50.9858 54.242C50.9803 54.2365 50.9693 54.231 50.9638 54.231C50.9583 54.2255 50.9473 54.22 50.9418 54.22C50.9309 54.209 50.9254 54.209 50.9144 54.209H50.8924H50.865H50.854C50.0743 54.2035 49.2288 54.2255 48.2899 54.2749C47.6974 54.3029 47.1049 54.3428 46.536 54.381L46.5353 54.3811L46.2364 54.4012C46.1705 54.4066 46.1046 54.4121 46.0332 54.4121C45.3743 54.4506 44.688 54.4451 44.0401 54.4286C43.9537 54.4286 43.8673 54.4259 43.7802 54.4232H43.7801H43.78H43.7799H43.7797H43.7796H43.7795H43.7793H43.7792H43.7791H43.7789H43.7788H43.7786H43.7785L43.7779 54.4232H43.7778H43.7777H43.7775H43.7774H43.7772H43.7771H43.777H43.7768H43.7767H43.7765H43.7764H43.7763H43.7761C43.6875 54.4204 43.5982 54.4176 43.5075 54.4176C42.9859 54.4066 42.4479 54.3957 41.9208 54.3957C41.1795 54.3957 40.5756 54.4286 40.021 54.5H40.01C39.999 54.5055 39.9935 54.5055 39.9826 54.5055C39.9771 54.5109 39.9606 54.5109 39.9606 54.5109L39.9386 54.5219C39.9345 54.524 39.9311 54.5261 39.9282 54.5279L39.9282 54.5279C39.9235 54.5308 39.9201 54.5329 39.9167 54.5329C39.9112 54.5357 39.9071 54.5398 39.9036 54.5432C39.9019 54.5449 39.9003 54.5465 39.8989 54.5476C39.898 54.5483 39.8972 54.5488 39.8963 54.5491L39.8947 54.5494L39.8782 54.5658C39.8764 54.5677 39.874 54.5695 39.8715 54.5713L39.8683 54.5738L39.8661 54.5757C39.865 54.5766 39.864 54.5776 39.8633 54.5786L39.8623 54.5801L39.862 54.5808L39.8618 54.5823L39.8453 54.5988L39.8343 54.6207C39.8288 54.6262 39.8233 54.6372 39.8233 54.6427C39.8178 54.6482 39.8124 54.6592 39.8124 54.6647C39.8069 54.6756 39.8069 54.6811 39.8069 54.6921V54.7141V54.7415V54.7525V55.1862C39.8069 55.4716 39.8069 55.79 39.8233 56.1029C39.8563 56.7507 39.9441 57.2118 40.1089 57.5631V57.5741C40.1116 57.5796 40.1143 57.5837 40.1171 57.5878L40.1212 57.5942C40.1226 57.5964 40.124 57.5988 40.1253 57.6015C40.1308 57.6125 40.1528 57.6345 40.1528 57.6345L40.1638 57.6454C40.1747 57.6564 40.1802 57.6619 40.1912 57.6674C40.1939 57.6701 40.1967 57.6715 40.1987 57.6722C40.2008 57.6729 40.2022 57.6729 40.2022 57.6729C40.2132 57.6784 40.2406 57.6948 40.2406 57.6948H40.2461L40.2791 57.7113H40.29H40.334H40.592C41.0477 57.7113 41.5364 57.7058 42.0745 57.6894C42.5396 57.6809 43.008 57.6627 43.4697 57.6447L43.4706 57.6447L43.4716 57.6446L43.4724 57.6446L43.4733 57.6446L43.4743 57.6445L43.4751 57.6445L43.476 57.6445C43.6116 57.6392 43.7467 57.6339 43.8809 57.629L44.2872 57.6125C45.001 57.5851 45.5995 57.5631 46.2034 57.5521H46.2254C46.7297 57.5416 47.2441 57.5613 47.7926 57.5822L47.8671 57.5851C48.0483 57.596 48.2295 57.6015 48.4107 57.607C49.3166 57.6345 50.272 57.6399 51.1505 57.4917H51.1615C51.1724 57.4862 51.1779 57.4862 51.1889 57.4862C51.1917 57.4835 51.1958 57.4821 51.1999 57.4808C51.204 57.4794 51.2081 57.478 51.2109 57.4753C51.2164 57.4698 51.2273 57.4643 51.2328 57.4643C51.2393 57.4643 51.2438 57.4605 51.2476 57.4574L51.251 57.4548L51.2527 57.4538C51.2534 57.4535 51.2541 57.4533 51.2548 57.4533C51.2603 57.4506 51.2644 57.4464 51.2678 57.443C51.2713 57.4396 51.274 57.4368 51.2768 57.4368L51.2799 57.4341L51.2835 57.4313C51.2883 57.4277 51.2932 57.424 51.2932 57.4204C51.2951 57.4185 51.2975 57.4167 51.2999 57.4149C51.303 57.4126 51.306 57.4103 51.3079 57.408C51.309 57.4066 51.3097 57.4053 51.3097 57.4039C51.3124 57.3984 51.3166 57.3943 51.32 57.3909C51.3234 57.3874 51.3262 57.3847 51.3262 57.3819C51.3317 57.3765 51.3372 57.3655 51.3372 57.36C51.3426 57.3545 51.3481 57.3435 51.3481 57.338C51.3591 57.3325 51.3591 57.3216 51.3591 57.3161C51.3646 57.3051 51.3646 57.2996 51.3646 57.2886V57.2667V57.2392ZM50.7442 55.9437C50.7826 56.295 50.8155 56.6573 50.8375 57.0196H50.843C50.1402 57.113 49.388 57.1185 48.6577 57.0965C48.6193 56.7507 48.5919 56.3938 48.5754 56.0315C49.3166 56.026 50.0414 56.0151 50.7442 55.9437ZM50.6124 54.6976C50.6344 54.9446 50.6618 55.1916 50.6893 55.4332C50.0084 55.4991 49.2892 55.521 48.5534 55.521C48.5479 55.2575 48.5479 55.005 48.5479 54.7525C49.2892 54.7141 49.97 54.6976 50.6124 54.6976ZM48.1261 57.0845H48.1261H48.126H48.126C48.044 57.0794 47.9665 57.0745 47.889 57.0745H47.8945C47.4169 57.0581 46.9227 57.0416 46.456 57.0416C46.4231 56.7342 46.3956 56.4103 46.3736 56.07C46.9172 56.0425 47.4773 56.037 48.0648 56.037C48.0812 56.3883 48.1087 56.7397 48.1416 57.0855L48.1261 57.0845ZM48.0426 55.5125L48.0428 55.521C47.9491 55.5219 47.855 55.5227 47.7608 55.5234L47.7566 55.5235H47.7562C47.2835 55.5273 46.8064 55.5311 46.3407 55.5539C46.3297 55.3344 46.3187 55.1148 46.3078 54.8897C46.8623 54.8513 47.4498 54.8129 48.0373 54.7799C48.0319 55.0188 48.0372 55.263 48.0426 55.5125ZM45.863 56.0919C45.885 56.4268 45.9124 56.7452 45.9399 57.0471L45.9214 57.0475H45.9212C45.477 57.0584 45.0269 57.0693 44.5233 57.091C44.5013 56.7891 44.4684 56.4817 44.43 56.1852C44.681 56.1677 44.9336 56.1518 45.1877 56.1357L45.1898 56.1356C45.413 56.1215 45.6374 56.1073 45.863 56.0919ZM45.7916 54.9172C45.8026 55.1422 45.8136 55.3618 45.8246 55.5814H45.8191L45.818 55.5815L45.8179 55.5815L45.8177 55.5815L45.8176 55.5815L45.8175 55.5815L45.8174 55.5815L45.8173 55.5815L45.8172 55.5816L45.8171 55.5816L45.817 55.5816L45.8169 55.5816L45.8168 55.5816L45.8167 55.5816L45.8165 55.5816L45.8164 55.5816C45.3287 55.6145 44.8409 55.6473 44.3586 55.6747C44.3311 55.4332 44.3092 55.1807 44.2927 54.9281C44.7814 54.9391 45.292 54.9391 45.7916 54.9172ZM44.0072 57.1184H43.8644V57.1239C43.6163 57.1319 43.3656 57.141 43.1136 57.1503L43.1131 57.1503C42.8411 57.1603 42.5676 57.1703 42.2941 57.1788C42.2667 56.8934 42.2557 56.5969 42.2557 56.3005L42.4395 56.2924H42.4396H42.4397C42.8822 56.2729 43.36 56.2519 43.9138 56.2182C43.9214 56.2857 43.9291 56.3535 43.937 56.4216L43.937 56.4217C43.9635 56.6523 43.9902 56.8854 44.0072 57.1184ZM43.7876 54.9227C43.7985 55.1916 43.826 55.4551 43.8534 55.7077L43.8589 55.7131C43.2495 55.7461 42.7389 55.7735 42.2557 55.79C42.2557 55.4881 42.2447 55.1862 42.2172 54.8952C42.6455 54.8952 43.0738 54.9062 43.4966 54.9172C43.5954 54.9227 43.6887 54.9227 43.7876 54.9227ZM41.7451 56.3115C41.7451 56.6079 41.756 56.8989 41.7835 57.1898H41.789C41.3333 57.2008 40.9105 57.2008 40.5152 57.2008C40.4383 56.9757 40.3834 56.6903 40.3504 56.3335C40.7897 56.3335 41.2509 56.328 41.7451 56.3115ZM41.7011 54.8897C41.7339 55.179 41.7395 55.4791 41.7396 55.7955C41.2399 55.812 40.7677 55.8174 40.3175 55.8174C40.312 55.5979 40.312 55.3838 40.312 55.1697V54.9611C40.7238 54.9227 41.1795 54.8952 41.7011 54.8897ZM50.4862 51.228V51.3981C50.4862 51.5408 50.371 51.656 50.2283 51.656C50.0857 51.656 49.9704 51.5408 49.9704 51.3981V51.228C49.9704 51.0853 50.0857 50.9701 50.2283 50.9701C50.371 50.9701 50.4862 51.0853 50.4862 51.228ZM50.3273 32.7495C50.3767 32.6178 50.3108 32.4697 50.179 32.4203H50.1845C49.7398 32.2502 49.004 32.316 48.4769 32.5684C48.12 32.744 47.8839 32.98 47.7961 33.2653C47.7522 33.4025 47.8235 33.5452 47.9608 33.5891C47.9883 33.6001 48.0102 33.6001 48.0377 33.6001C48.1475 33.6001 48.2518 33.5287 48.2848 33.419C48.3287 33.2763 48.4769 33.1336 48.6966 33.0294C49.1413 32.8154 49.7178 32.7934 49.9978 32.8977C50.1296 32.9471 50.2778 32.8812 50.3273 32.7495ZM47.977 51.1292C48.0648 51.2389 48.0483 51.398 47.9385 51.4858C47.8892 51.5243 47.8343 51.5407 47.7794 51.5407C47.7026 51.5407 47.6313 51.5078 47.5764 51.4419C47.4941 51.3432 47.4557 51.2279 47.4611 51.1017C47.4666 50.9591 47.5874 50.8493 47.73 50.8548C47.8727 50.8603 47.9824 50.981 47.977 51.1237V51.1292ZM44.7703 48.2471C44.913 48.2416 45.0227 48.1208 45.0172 47.9781H45.0118C45.0063 47.8354 45.0008 47.6872 45.0008 47.5334L45.0005 47.5167V47.5167C44.9896 46.9719 44.9773 46.359 44.8307 45.8482C44.7923 45.7109 44.6496 45.6341 44.5124 45.6725C44.3752 45.7109 44.2984 45.8537 44.3368 45.9909C44.4683 46.4457 44.4794 46.9989 44.4904 47.5414V47.5415L44.4905 47.5444C44.4905 47.6981 44.4959 47.8518 44.5014 48.0001C44.5124 48.1373 44.6222 48.2471 44.7593 48.2471H44.7703ZM44.7592 44.1298C44.7811 44.2725 44.6824 44.3988 44.5397 44.4207H44.5013C44.3751 44.4207 44.2653 44.3274 44.2489 44.2011C44.1007 43.1911 44.0239 42.1316 44.0184 41.149C44.0184 41.0063 44.1336 40.891 44.2763 40.891C44.419 40.891 44.5342 41.0063 44.5342 41.1435C44.5342 42.1042 44.6165 43.1362 44.7592 44.1243V44.1298ZM41.3387 31.0424C41.476 31.0698 41.5638 31.2071 41.5364 31.3498C41.3058 32.4202 40.4877 33.0899 39.1095 33.3425H39.0656C38.9448 33.3425 38.835 33.2546 38.813 33.1339C38.7856 32.9966 38.8789 32.8594 39.0217 32.8374C40.2077 32.6233 40.8501 32.1183 41.0367 31.24C41.0642 31.1028 41.2015 31.0149 41.3387 31.0424ZM40.5974 46.8857V46.8637C40.5777 46.5378 40.5268 46.2253 40.4769 45.9181L40.4769 45.9181L40.4602 45.8152L40.448 45.7391L40.4355 45.6615C40.4272 45.6107 40.419 45.56 40.4108 45.5078V45.5023C40.4108 45.4968 40.4094 45.4927 40.408 45.4886L40.4068 45.4848L40.4059 45.481C40.4055 45.4791 40.4053 45.4771 40.4053 45.4749C40.3998 45.4639 40.3998 45.4584 40.3998 45.4529C40.3998 45.4474 40.397 45.4433 40.3943 45.4392C40.3915 45.4351 40.3888 45.4309 40.3888 45.4255C40.3833 45.42 40.3778 45.4145 40.3778 45.409C40.3751 45.4062 40.3723 45.4021 40.3696 45.398C40.3668 45.3939 40.3641 45.3898 40.3613 45.387C40.3613 45.3815 40.3504 45.3706 40.3504 45.3706C40.3449 45.3678 40.3408 45.3637 40.3373 45.3603C40.3339 45.3568 40.3311 45.3541 40.3284 45.3541C40.3229 45.3541 40.3119 45.3431 40.3119 45.3431C40.3092 45.3431 40.3051 45.3404 40.3009 45.3376C40.2968 45.3349 40.2927 45.3321 40.29 45.3321C40.2858 45.33 40.2824 45.3279 40.2795 45.3262C40.2748 45.3233 40.2714 45.3212 40.268 45.3212C40.2625 45.3102 40.257 45.3102 40.246 45.3102C40.2406 45.3047 40.2296 45.3047 40.2241 45.3047H40.2021H40.1747C39.8672 45.3102 39.5542 45.3321 39.2522 45.3541C39.1136 45.3592 38.9797 45.3692 38.8417 45.3794L38.813 45.3815H38.7965H38.7691C38.7636 45.3815 38.7526 45.3815 38.7471 45.387C38.7416 45.3925 38.7306 45.398 38.7251 45.398C38.7239 45.398 38.7227 45.3986 38.7214 45.3994L38.7179 45.4021C38.7142 45.4052 38.7096 45.409 38.7032 45.409C38.6967 45.409 38.6922 45.4128 38.6884 45.4159C38.6858 45.4181 38.6835 45.42 38.6812 45.42C38.6702 45.4255 38.6647 45.4309 38.6593 45.4364L38.6564 45.439L38.6525 45.4419C38.6477 45.4456 38.6428 45.4493 38.6428 45.4529C38.6415 45.4542 38.6402 45.4552 38.6389 45.4561L38.6373 45.4572C38.6336 45.4596 38.63 45.4621 38.6263 45.4694C38.6208 45.4804 38.6153 45.4858 38.6098 45.4913C38.6043 45.4968 38.5989 45.5078 38.5989 45.5133C38.5934 45.5188 38.5879 45.5298 38.5879 45.5353C38.5824 45.5462 38.5824 45.5517 38.5824 45.5627C38.5769 45.5682 38.5769 45.5737 38.5769 45.5847V45.6121V45.6286C38.5714 46.0568 38.5824 46.5453 38.6867 46.9845V46.99C38.6882 46.9929 38.6897 46.9955 38.691 46.9978C38.6947 47.0043 38.6977 47.0094 38.6977 47.0174V47.0284L38.7017 47.0369C38.7061 47.0468 38.7113 47.0584 38.7197 47.0668V47.0723C38.7251 47.0833 38.7306 47.0888 38.7416 47.0997L38.7526 47.1107C38.7581 47.1217 38.7636 47.1272 38.7746 47.1327C38.78 47.1382 38.791 47.1437 38.791 47.1437C38.7965 47.1437 38.8006 47.1464 38.8048 47.1492C38.8089 47.1519 38.813 47.1546 38.8185 47.1546C38.824 47.1601 38.8295 47.1601 38.835 47.1601C38.8404 47.1711 38.8514 47.1711 38.8624 47.1711H38.8789H38.9283C39.3895 47.1711 39.8837 47.1656 40.3723 47.1272H40.3943H40.4217C40.4272 47.1217 40.4327 47.1162 40.4437 47.1162C40.4492 47.1107 40.4602 47.1052 40.4657 47.1052C40.4721 47.1052 40.4766 47.1015 40.4804 47.0984C40.482 47.097 40.4835 47.0958 40.4849 47.095C40.4858 47.0945 40.4867 47.0943 40.4876 47.0943C40.4986 47.0943 40.5041 47.0888 40.5096 47.0833L40.5261 47.0668L40.5425 47.0503C40.5449 47.0455 40.5484 47.0428 40.5515 47.0404C40.5555 47.0373 40.559 47.0346 40.559 47.0284C40.559 47.022 40.5628 47.0174 40.5659 47.0136C40.5681 47.011 40.57 47.0087 40.57 47.0064L40.5717 47.0044L40.5732 47.0016C40.5741 46.9997 40.5748 46.9976 40.5755 46.9955L40.5755 46.9955L40.5755 46.9955C40.5769 46.9913 40.5782 46.9872 40.581 46.9845C40.5865 46.979 40.592 46.968 40.592 46.9625C40.5974 46.9515 40.5974 46.946 40.5974 46.9351V46.9131V46.8857ZM39.955 45.8976C39.999 46.1556 40.0374 46.3971 40.0649 46.6441C39.7464 46.6606 39.4334 46.6716 39.126 46.6716C39.082 46.4081 39.0656 46.1281 39.0656 45.8646C39.0867 45.8629 39.1084 45.8605 39.1303 45.8582L39.1303 45.8582C39.1767 45.8532 39.224 45.8481 39.2687 45.8481C39.375 45.8428 39.4827 45.8362 39.591 45.8296C39.7063 45.8225 39.8224 45.8154 39.9386 45.8097C39.9402 45.818 39.9424 45.8267 39.9446 45.8356L39.9446 45.8357C39.9497 45.8565 39.955 45.8784 39.955 45.8976ZM40.0045 30.7514C40.0209 30.894 39.9221 31.0202 39.7794 31.0367C39.5103 31.0696 39.2083 31.2397 39.2358 31.6184C39.2468 31.761 39.1424 31.8818 38.9997 31.8927H38.9777C38.8459 31.8927 38.7306 31.7885 38.7197 31.6568C38.6757 31.0641 39.082 30.6032 39.7135 30.5264C39.8562 30.5099 39.9825 30.6087 39.999 30.7514H40.0045ZM36.8963 48.9772C37.039 48.9772 37.1487 48.8619 37.1487 48.7192H37.1542C37.149 48.3469 37.0786 47.9795 37.0102 47.622L37.0102 47.622L37.0006 47.5719C36.9128 47.1272 36.8305 46.7046 36.8634 46.2928C36.8744 46.1556 36.7701 46.0293 36.6274 46.0184C36.4848 46.0074 36.364 46.1117 36.3531 46.2544C36.3156 46.7255 36.4034 47.1862 36.4892 47.6365L36.4957 47.6707L36.5022 47.7036C36.5713 48.0543 36.6384 48.3947 36.6384 48.7247C36.6439 48.8619 36.7536 48.9772 36.8963 48.9772ZM36.9571 34.8028C37.0449 34.9125 37.0339 35.0717 36.9241 35.165C36.2982 35.6863 35.6228 36.1637 34.9091 36.1637H34.8761C34.7334 36.1637 34.6235 36.0429 34.6235 35.9003C34.6235 35.7631 34.7389 35.6479 34.8816 35.6479H34.8871C35.4471 35.6588 36.0346 35.2308 36.5947 34.7699C36.7045 34.6821 36.8637 34.693 36.9571 34.8028ZM36.512 44.9477C36.6491 44.9148 36.7369 44.7776 36.7095 44.6403H36.704C36.5998 44.1627 36.5778 43.6522 36.5613 43.1582L36.5609 43.146C36.5446 42.6941 36.5277 42.2263 36.4461 41.7693C36.4242 41.6321 36.287 41.5388 36.1498 41.5607C36.0071 41.5827 35.9138 41.7199 35.9413 41.8572C36.0181 42.2798 36.0346 42.7135 36.051 43.1746L36.0515 43.1868C36.0733 43.699 36.0958 44.2272 36.2047 44.7446C36.2321 44.8654 36.3364 44.9477 36.4571 44.9477H36.512ZM36.2486 57.7334V57.7498V57.7773C36.2486 57.7883 36.2486 57.7938 36.2431 57.8047C36.2431 57.8102 36.2431 57.8212 36.2377 57.8267C36.2377 57.8322 36.2322 57.8432 36.2267 57.8487C36.2267 57.852 36.2246 57.8554 36.2217 57.8601C36.2199 57.863 36.2178 57.8664 36.2157 57.8706C36.2157 57.8717 36.2152 57.8729 36.2144 57.8741C36.2133 57.8757 36.2115 57.8775 36.2095 57.8795C36.2061 57.883 36.202 57.8871 36.1992 57.8926C36.1992 57.8962 36.1943 57.8999 36.1895 57.9035C36.187 57.9054 36.1846 57.9072 36.1827 57.909L36.1663 57.9255C36.1626 57.9255 36.159 57.9304 36.1553 57.9353C36.1535 57.9377 36.1516 57.9401 36.1498 57.942C36.1471 57.942 36.1429 57.9447 36.1388 57.9475C36.1347 57.9502 36.1306 57.953 36.1278 57.953C36.1251 57.953 36.121 57.9557 36.1169 57.9584C36.1127 57.9612 36.1086 57.9639 36.1059 57.9639C36.1004 57.9639 36.0894 57.9694 36.0785 57.9749L36.0784 57.9749C36.0729 57.9749 36.062 57.9749 36.0565 57.9804H36.029H36.0125C35.865 57.9889 35.7174 57.9989 35.5706 58.0088L35.57 58.0089C35.433 58.0181 35.2966 58.0273 35.1615 58.0353C34.5465 58.0792 33.9096 58.1231 33.2837 58.1231H33.2617H33.2123H33.1959C33.1849 58.1231 33.1739 58.1176 33.1684 58.1121C33.1684 58.1121 33.1574 58.1121 33.1519 58.1067C33.1453 58.1067 33.1406 58.1026 33.1356 58.0982C33.1331 58.0961 33.1305 58.0939 33.1276 58.092C33.1266 58.0913 33.1256 58.0907 33.1245 58.0902C33.1245 58.0902 33.1135 58.0847 33.1135 58.0792C33.108 58.0765 33.1039 58.0723 33.0998 58.0682C33.0956 58.0641 33.0915 58.06 33.086 58.0573L33.0805 58.0518C33.0696 58.0408 33.0586 58.0298 33.0531 58.0133V58.0078L33.0366 57.9749C33.0366 57.9694 33.0366 57.9639 33.0311 57.9584C33.0311 57.953 33.0311 57.9475 33.0256 57.942C32.8829 57.426 32.795 56.91 32.7676 56.4433V56.4269V56.3994V56.3775C32.7676 56.372 32.7676 56.361 32.7731 56.35C32.7731 56.3445 32.7731 56.3336 32.7841 56.3281C32.7841 56.3226 32.7895 56.3116 32.795 56.3061C32.795 56.3006 32.8005 56.2896 32.806 56.2842C32.806 56.2814 32.8088 56.2787 32.8122 56.2752C32.8156 56.2718 32.8197 56.2677 32.8225 56.2622C32.8225 56.2585 32.8274 56.2549 32.8323 56.2512C32.8347 56.2494 32.8371 56.2476 32.839 56.2457L32.8554 56.2293C32.8582 56.2293 32.8609 56.2265 32.8644 56.2231C32.8678 56.2196 32.8719 56.2155 32.8774 56.2128C32.8797 56.2128 32.8819 56.2109 32.8846 56.2087C32.8884 56.2056 32.8929 56.2018 32.8994 56.2018C32.9048 56.2018 32.9158 56.1963 32.9213 56.1908C32.9241 56.1881 32.9282 56.1867 32.9323 56.1853C32.9364 56.184 32.9405 56.1826 32.9433 56.1799C32.9543 56.1799 32.9598 56.1799 32.9707 56.1744H32.9817C33.7559 56.0591 34.5795 56.103 35.3866 56.1469C35.5733 56.1579 35.76 56.1689 35.9412 56.1744H35.9521H35.9851H35.9961C36.007 56.1744 36.018 56.1799 36.029 56.1853H36.04C36.0473 56.1853 36.0546 56.1902 36.062 56.1951C36.0642 56.1966 36.0664 56.1981 36.0687 56.1994C36.0701 56.2003 36.0715 56.2011 36.0729 56.2018H36.0839C36.0839 56.2018 36.1004 56.2238 36.1114 56.2347L36.1223 56.2457C36.1278 56.2512 36.1333 56.2622 36.1388 56.2732C36.1388 56.2732 36.1443 56.2842 36.1498 56.2896C36.1498 56.2951 36.1525 56.2992 36.1553 56.3034C36.1572 56.3063 36.1592 56.3092 36.1602 56.3126C36.1605 56.314 36.1608 56.3155 36.1608 56.3171C36.1608 56.3226 36.1663 56.3336 36.1718 56.339C36.1745 56.3418 36.1745 56.3459 36.1745 56.3507C36.1745 56.3555 36.1745 56.361 36.1773 56.3665V56.3939V56.4049L36.1773 56.4059C36.1883 56.5483 36.1992 56.6907 36.2102 56.8386C36.2322 57.1295 36.2541 57.426 36.2541 57.7224L36.2486 57.7334ZM35.6977 56.9338L35.6977 56.9338L35.6941 56.888C35.6941 56.8387 35.6888 56.7893 35.6838 56.7418C35.6815 56.7206 35.6793 56.6997 35.6776 56.6794H35.6776C35.5678 56.6739 35.458 56.6684 35.3427 56.6629C34.6509 56.6245 33.9371 56.5861 33.2837 56.6574C33.3166 56.9648 33.3716 57.2887 33.4539 57.6236C34.0085 57.6181 34.574 57.5797 35.1231 57.5358C35.2246 57.5275 35.3262 57.5207 35.4278 57.5138C35.5294 57.5069 35.6309 57.5001 35.7325 57.4918C35.7274 57.3087 35.7129 57.1257 35.6977 56.9338ZM35.8863 53.2812V53.2647L35.9028 53.2592C35.8973 53.1989 35.8904 53.1385 35.8835 53.0781C35.8767 53.0177 35.8698 52.9573 35.8643 52.8969C35.8149 52.4907 35.771 52.0735 35.8314 51.7386V51.7222V51.7057V51.6947V51.6673V51.6453C35.8286 51.6398 35.8286 51.6344 35.8286 51.6295C35.8286 51.6247 35.8286 51.6206 35.8259 51.6179C35.8204 51.6124 35.8204 51.6014 35.8204 51.5959C35.8183 51.5917 35.8162 51.5883 35.8144 51.5854C35.8115 51.5808 35.8094 51.5774 35.8094 51.574C35.8094 51.5706 35.8073 51.5672 35.8044 51.5625C35.8026 51.5596 35.8005 51.5562 35.7984 51.552C35.7957 51.5465 35.7916 51.5424 35.7881 51.539C35.7847 51.5355 35.782 51.5328 35.782 51.53C35.7765 51.5246 35.7655 51.5191 35.7655 51.5136C35.7637 51.5118 35.7618 51.5093 35.76 51.5069C35.7563 51.502 35.7527 51.4971 35.749 51.4971C35.738 51.4916 35.7271 51.4806 35.7271 51.4806L35.7051 51.4697C35.6996 51.4642 35.6941 51.4587 35.6831 51.4587C35.6776 51.4532 35.6667 51.4532 35.6612 51.4532C35.6502 51.4477 35.6447 51.4477 35.6337 51.4477H35.6227H35.6063H35.5898C34.4477 51.3873 33.4979 51.4038 32.7621 51.5026H32.7457C32.7347 51.5081 32.7292 51.5081 32.7182 51.5081C32.7127 51.5136 32.7017 51.5191 32.6962 51.5191C32.6907 51.5246 32.6853 51.53 32.6743 51.53C32.6678 51.53 32.6633 51.5338 32.6595 51.5369C32.6569 51.5391 32.6546 51.541 32.6523 51.541C32.6413 51.5465 32.6358 51.552 32.6303 51.5575C32.6285 51.5593 32.6267 51.5618 32.6249 51.5642C32.6212 51.5691 32.6175 51.574 32.6139 51.574C32.612 51.5758 32.6096 51.5776 32.6072 51.5795C32.6023 51.5831 32.5974 51.5868 32.5974 51.5904C32.5919 51.6014 32.5809 51.6124 32.5809 51.6124L32.57 51.6344C32.5677 51.6366 32.5673 51.6397 32.5669 51.643C32.5662 51.6478 32.5655 51.653 32.559 51.6563C32.548 51.6618 32.548 51.6673 32.548 51.6783C32.5425 51.6838 32.5425 51.6892 32.5425 51.7002V51.7277V51.7551V51.7716C32.5481 51.8585 32.5523 51.9483 32.5565 52.0388C32.5605 52.1254 32.5646 52.2127 32.57 52.2986C32.5864 52.7048 32.6084 53.133 32.6743 53.5337C32.6798 53.5447 32.6798 53.5502 32.6798 53.5557C32.6798 53.5612 32.6811 53.5653 32.6825 53.5694C32.6839 53.5735 32.6853 53.5776 32.6853 53.5831C32.6907 53.5886 32.6962 53.5941 32.6962 53.5996C32.6962 53.606 32.7 53.6124 32.7031 53.6178C32.7053 53.6215 32.7072 53.6248 32.7072 53.627C32.7127 53.6325 32.7182 53.6435 32.7182 53.6435C32.7237 53.6545 32.7292 53.66 32.7347 53.6655L32.7511 53.6819C32.7566 53.6874 32.7676 53.6984 32.7731 53.6984C32.7786 53.7039 32.7841 53.7094 32.7896 53.7094C32.7923 53.7094 32.7964 53.7121 32.8006 53.7149C32.8047 53.7176 32.8088 53.7203 32.8115 53.7203C32.817 53.7258 32.8225 53.7313 32.828 53.7313C32.8335 53.7368 32.8445 53.7423 32.8555 53.7423H32.8719H32.9214H32.9817C33.6845 53.7423 34.7058 53.7039 35.6831 53.5337H35.6996C35.7106 53.5282 35.7161 53.5282 35.7271 53.5282C35.7325 53.5227 35.7435 53.5172 35.749 53.5172C35.7545 53.5118 35.7655 53.5063 35.771 53.5063C35.782 53.5063 35.7875 53.5008 35.7929 53.4953L35.8094 53.4788L35.8259 53.4623C35.8277 53.4605 35.8302 53.4587 35.8326 53.4569C35.8375 53.4532 35.8424 53.4495 35.8424 53.4459C35.8424 53.4431 35.8451 53.439 35.8478 53.4349C35.8506 53.4308 35.8533 53.4267 35.8533 53.4239C35.8588 53.4184 35.8643 53.4075 35.8643 53.402C35.8698 53.3965 35.8753 53.3855 35.8753 53.38C35.8808 53.3745 35.8808 53.3635 35.8808 53.358C35.8863 53.3471 35.8863 53.3416 35.8863 53.3306V53.3086V53.2812ZM35.3372 52.9628C35.3427 52.9957 35.3482 53.0342 35.3482 53.0726H35.3537C34.5576 53.1934 33.7504 53.2318 33.141 53.2318C33.1025 52.9189 33.0861 52.595 33.0696 52.2711C33.0678 52.2382 33.0653 52.2053 33.0629 52.1723C33.058 52.1064 33.0531 52.0406 33.0531 51.9747C33.6571 51.9143 34.4038 51.9033 35.2768 51.9418C35.2604 52.2711 35.2988 52.6225 35.3372 52.9628Z" fill="#262D2E"></path><path d="M72.9552 81C72.1033 81 71.1648 80.9667 70.1532 80.8935C64.9617 80.5341 23.3898 79.9684 16.4012 80.7404C12.7073 81.1531 10.4443 80.7537 9.47922 79.5357C9.00666 78.9434 8.94011 78.2711 9.03994 77.7919L10.2513 14.223C10.1914 12.8652 11.0167 10.782 13.5459 10.5024C17.6126 10.0498 68.9485 8.78524 73.2481 9.0315C74.0335 9.07809 74.7257 9.09806 75.3447 9.11802C78.7058 9.23117 80.7358 9.29773 80.8689 13.3577C81.4413 31.0354 79.9571 76.1679 79.8972 77.9716C79.9105 78.2645 79.844 78.8302 79.3248 79.4026C78.3464 80.4742 76.2498 81 72.9552 81ZM34.5448 78.1647C49.081 78.1647 67.005 78.4775 70.3062 78.7038C76.2432 79.1164 77.5211 78.1114 77.7075 77.9184C77.7607 76.3942 79.2516 31.1019 78.6792 13.4309C78.6348 12.0954 77.5011 11.3898 75.2781 11.3144C74.6458 11.2944 73.9336 11.2678 73.1283 11.2212C68.8486 10.975 17.8322 12.2329 13.7922 12.6855C12.5409 12.8253 12.4344 13.7637 12.4477 14.1564V14.2296L11.223 78.1314L11.2097 78.178C11.3495 78.3177 12.2613 78.9833 16.155 78.5507C18.7574 78.2645 26.072 78.158 34.5382 78.158L34.5448 78.1647Z" fill="#171F1F"></path><path d="M28.7511 66.392C29.2204 66.392 29.5964 66.536 29.8791 66.824C30.1671 67.112 30.3111 67.4907 30.3111 67.96C30.3111 68.424 30.1644 68.7973 29.8711 69.08C29.5831 69.3627 29.2018 69.504 28.7271 69.504H27.1671C27.1458 69.504 27.1351 69.5147 27.1351 69.536V71.92C27.1351 71.9733 27.1084 72 27.0551 72H26.6471C26.5938 72 26.5671 71.9733 26.5671 71.92V66.472C26.5671 66.4187 26.5938 66.392 26.6471 66.392H28.7511ZM28.6871 69.032C29.0018 69.032 29.2578 68.936 29.4551 68.744C29.6524 68.5467 29.7511 68.288 29.7511 67.968C29.7511 67.6427 29.6524 67.3813 29.4551 67.184C29.2578 66.9867 29.0018 66.888 28.6871 66.888H27.1671C27.1458 66.888 27.1351 66.8987 27.1351 66.92V69C27.1351 69.0213 27.1458 69.032 27.1671 69.032H28.6871ZM32.8775 67.912C33.0535 67.912 33.2055 67.9467 33.3335 68.016C33.3761 68.0373 33.3921 68.072 33.3815 68.12L33.2935 68.512C33.2775 68.5653 33.2428 68.5813 33.1895 68.56C33.0988 68.5227 32.9948 68.504 32.8775 68.504L32.7735 68.512C32.4961 68.5227 32.2668 68.6267 32.0855 68.824C31.9041 69.016 31.8135 69.2613 31.8135 69.56V71.92C31.8135 71.9733 31.7868 72 31.7335 72H31.3255C31.2721 72 31.2455 71.9733 31.2455 71.92V68.032C31.2455 67.9787 31.2721 67.952 31.3255 67.952H31.7335C31.7868 67.952 31.8135 67.9787 31.8135 68.032V68.52C31.8135 68.536 31.8161 68.5467 31.8215 68.552C31.8321 68.552 31.8401 68.5467 31.8455 68.536C31.9575 68.3387 32.0988 68.1867 32.2695 68.08C32.4455 67.968 32.6481 67.912 32.8775 67.912ZM35.6645 72.064C35.2805 72.064 34.9498 71.9653 34.6725 71.768C34.3951 71.5707 34.2031 71.2987 34.0965 70.952C34.0218 70.7067 33.9845 70.3787 33.9845 69.968C33.9845 69.5573 34.0218 69.232 34.0965 68.992C34.1978 68.6507 34.3871 68.3813 34.6645 68.184C34.9418 67.9867 35.2778 67.888 35.6725 67.888C36.0511 67.888 36.3765 67.9867 36.6485 68.184C36.9258 68.3813 37.1151 68.648 37.2165 68.984C37.2911 69.2133 37.3285 69.5413 37.3285 69.968C37.3285 70.4 37.2911 70.728 37.2165 70.952C37.1151 71.2987 36.9258 71.5707 36.6485 71.768C36.3765 71.9653 36.0485 72.064 35.6645 72.064ZM35.6645 71.568C35.9205 71.568 36.1391 71.4987 36.3205 71.36C36.5018 71.216 36.6245 71.024 36.6885 70.784C36.7365 70.592 36.7605 70.3227 36.7605 69.976C36.7605 69.624 36.7391 69.3547 36.6965 69.168C36.6325 68.928 36.5071 68.7387 36.3205 68.6C36.1391 68.456 35.9178 68.384 35.6565 68.384C35.3951 68.384 35.1738 68.456 34.9925 68.6C34.8111 68.7387 34.6885 68.928 34.6245 69.168C34.5818 69.3547 34.5605 69.624 34.5605 69.976C34.5605 70.328 34.5818 70.5973 34.6245 70.784C34.6831 71.024 34.8031 71.216 34.9845 71.36C35.1711 71.4987 35.3978 71.568 35.6645 71.568ZM40.9918 66.48C40.9918 66.4267 41.0185 66.4 41.0718 66.4H41.4798C41.5332 66.4 41.5598 66.4267 41.5598 66.48V71.92C41.5598 71.9733 41.5332 72 41.4798 72H41.0718C41.0185 72 40.9918 71.9733 40.9918 71.92V71.584C40.9918 71.5733 40.9865 71.568 40.9758 71.568C40.9705 71.5627 40.9625 71.5653 40.9518 71.576C40.8345 71.7307 40.6878 71.8507 40.5118 71.936C40.3412 72.0213 40.1492 72.064 39.9358 72.064C39.5625 72.064 39.2478 71.968 38.9918 71.776C38.7412 71.584 38.5678 71.3227 38.4718 70.992C38.3972 70.752 38.3598 70.4133 38.3598 69.976C38.3598 69.5333 38.3918 69.2027 38.4558 68.984C38.5518 68.6427 38.7278 68.376 38.9838 68.184C39.2398 67.9867 39.5572 67.888 39.9358 67.888C40.1438 67.888 40.3358 67.9307 40.5118 68.016C40.6878 68.096 40.8345 68.2133 40.9518 68.368C40.9625 68.3787 40.9705 68.384 40.9758 68.384C40.9865 68.3787 40.9918 68.3707 40.9918 68.36V66.48ZM40.8478 70.952C40.8958 70.8453 40.9305 70.72 40.9518 70.576C40.9732 70.432 40.9838 70.232 40.9838 69.976C40.9838 69.72 40.9732 69.52 40.9518 69.376C40.9305 69.2267 40.8932 69.096 40.8398 68.984C40.7758 68.8027 40.6692 68.6587 40.5198 68.552C40.3758 68.44 40.2025 68.384 39.9998 68.384C39.7865 68.384 39.6025 68.4373 39.4478 68.544C39.2932 68.6507 39.1812 68.792 39.1118 68.968C39.0478 69.0853 38.9998 69.2187 38.9678 69.368C38.9412 69.512 38.9278 69.7147 38.9278 69.976C38.9278 70.2267 38.9385 70.424 38.9598 70.568C38.9812 70.7067 39.0185 70.832 39.0718 70.944C39.1358 71.136 39.2478 71.288 39.4078 71.4C39.5732 71.512 39.7678 71.568 39.9918 71.568C40.2052 71.568 40.3838 71.512 40.5278 71.4C40.6718 71.288 40.7785 71.1387 40.8478 70.952ZM45.295 68.032C45.295 67.9787 45.3217 67.952 45.375 67.952H45.783C45.8364 67.952 45.863 67.9787 45.863 68.032V71.92C45.863 71.9733 45.8364 72 45.783 72H45.375C45.3217 72 45.295 71.9733 45.295 71.92V71.576C45.295 71.5653 45.2897 71.5573 45.279 71.552C45.2684 71.5467 45.2604 71.5493 45.255 71.56C45.031 71.8907 44.6764 72.056 44.191 72.056C43.935 72.056 43.6977 72.0053 43.479 71.904C43.2657 71.7973 43.095 71.6453 42.967 71.448C42.8444 71.2507 42.783 71.0133 42.783 70.736V68.032C42.783 67.9787 42.8097 67.952 42.863 67.952H43.271C43.3244 67.952 43.351 67.9787 43.351 68.032V70.568C43.351 70.872 43.4364 71.1147 43.607 71.296C43.7777 71.472 44.0097 71.56 44.303 71.56C44.607 71.56 44.847 71.4693 45.023 71.288C45.2044 71.1067 45.295 70.8667 45.295 70.568V68.032ZM47.2161 72C47.1628 72 47.1361 71.9733 47.1361 71.92V66.48C47.1361 66.4267 47.1628 66.4 47.2161 66.4H47.6241C47.6774 66.4 47.7041 66.4267 47.7041 66.48V69.752C47.7041 69.7627 47.7068 69.7707 47.7121 69.776C47.7228 69.7813 47.7334 69.7787 47.7441 69.768L49.4401 67.992C49.4668 67.9653 49.4988 67.952 49.5361 67.952H50.0161C50.0481 67.952 50.0694 67.9627 50.0801 67.984C50.0908 68.0053 50.0854 68.0267 50.0641 68.048L49.0401 69.184C49.0294 69.1947 49.0268 69.208 49.0321 69.224L50.2561 71.904L50.2641 71.936C50.2641 71.9787 50.2401 72 50.1921 72H49.7601C49.7174 72 49.6881 71.9787 49.6721 71.936L48.6401 69.6C48.6294 69.5787 48.6161 69.576 48.6001 69.592L47.7201 70.52C47.7094 70.5307 47.7041 70.544 47.7041 70.56V71.92C47.7041 71.9733 47.6774 72 47.6241 72H47.2161ZM52.9599 68.344C52.9599 68.3973 52.9332 68.424 52.8799 68.424H51.9759C51.9546 68.424 51.9439 68.4347 51.9439 68.456V70.816C51.9439 71.072 51.9999 71.2533 52.1119 71.36C52.2292 71.4613 52.4106 71.512 52.6559 71.512H52.8559C52.9092 71.512 52.9359 71.5387 52.9359 71.592V71.92C52.9359 71.9733 52.9092 72 52.8559 72C52.7919 72.0053 52.6932 72.008 52.5599 72.008C52.1759 72.008 51.8852 71.936 51.6879 71.792C51.4906 71.648 51.3919 71.3813 51.3919 70.992V68.456C51.3919 68.4347 51.3812 68.424 51.3599 68.424H50.8719C50.8186 68.424 50.7919 68.3973 50.7919 68.344V68.032C50.7919 67.9787 50.8186 67.952 50.8719 67.952H51.3599C51.3812 67.952 51.3919 67.9413 51.3919 67.92V66.992C51.3919 66.9387 51.4186 66.912 51.4719 66.912H51.8639C51.9172 66.912 51.9439 66.9387 51.9439 66.992V67.92C51.9439 67.9413 51.9546 67.952 51.9759 67.952H52.8799C52.9332 67.952 52.9599 67.9787 52.9599 68.032V68.344ZM54.442 67.216C54.314 67.216 54.2073 67.1733 54.122 67.088C54.0366 67.0027 53.994 66.896 53.994 66.768C53.994 66.6347 54.0366 66.528 54.122 66.448C54.2073 66.3627 54.314 66.32 54.442 66.32C54.57 66.32 54.6766 66.3627 54.762 66.448C54.8473 66.528 54.89 66.6347 54.89 66.768C54.89 66.896 54.8473 67.0027 54.762 67.088C54.6766 67.1733 54.57 67.216 54.442 67.216ZM54.218 71.992C54.1646 71.992 54.138 71.9653 54.138 71.912V68.024C54.138 67.9707 54.1646 67.944 54.218 67.944H54.626C54.6793 67.944 54.706 67.9707 54.706 68.024V71.912C54.706 71.9653 54.6793 71.992 54.626 71.992H54.218ZM57.641 72.064C57.257 72.064 56.9264 71.9653 56.649 71.768C56.3717 71.5707 56.1797 71.2987 56.073 70.952C55.9984 70.7067 55.961 70.3787 55.961 69.968C55.961 69.5573 55.9984 69.232 56.073 68.992C56.1744 68.6507 56.3637 68.3813 56.641 68.184C56.9184 67.9867 57.2544 67.888 57.649 67.888C58.0277 67.888 58.353 67.9867 58.625 68.184C58.9024 68.3813 59.0917 68.648 59.193 68.984C59.2677 69.2133 59.305 69.5413 59.305 69.968C59.305 70.4 59.2677 70.728 59.193 70.952C59.0917 71.2987 58.9024 71.5707 58.625 71.768C58.353 71.9653 58.025 72.064 57.641 72.064ZM57.641 71.568C57.897 71.568 58.1157 71.4987 58.297 71.36C58.4784 71.216 58.601 71.024 58.665 70.784C58.713 70.592 58.737 70.3227 58.737 69.976C58.737 69.624 58.7157 69.3547 58.673 69.168C58.609 68.928 58.4837 68.7387 58.297 68.6C58.1157 68.456 57.8944 68.384 57.633 68.384C57.3717 68.384 57.1504 68.456 56.969 68.6C56.7877 68.7387 56.665 68.928 56.601 69.168C56.5584 69.3547 56.537 69.624 56.537 69.976C56.537 70.328 56.5584 70.5973 56.601 70.784C56.6597 71.024 56.7797 71.216 56.961 71.36C57.1477 71.4987 57.3744 71.568 57.641 71.568ZM62.1364 67.896C62.5631 67.896 62.9017 68.0213 63.1524 68.272C63.4084 68.5227 63.5364 68.8587 63.5364 69.28V71.92C63.5364 71.9733 63.5097 72 63.4564 72H63.0484C62.9951 72 62.9684 71.9733 62.9684 71.92V69.392C62.9684 69.0987 62.8777 68.8587 62.6964 68.672C62.5204 68.4853 62.2911 68.392 62.0084 68.392C61.7151 68.392 61.4777 68.4827 61.2964 68.664C61.1151 68.8453 61.0244 69.0827 61.0244 69.376V71.92C61.0244 71.9733 60.9977 72 60.9444 72H60.5364C60.4831 72 60.4564 71.9733 60.4564 71.92V68.032C60.4564 67.9787 60.4831 67.952 60.5364 67.952H60.9444C60.9977 67.952 61.0244 67.9787 61.0244 68.032V68.376C61.0244 68.3867 61.0271 68.3947 61.0324 68.4C61.0431 68.4053 61.0511 68.4027 61.0564 68.392C61.2911 68.0613 61.6511 67.896 62.1364 67.896Z" fill="black"></path></g><defs><clipPath id="clip0_15_8576"><rect width="90" height="90" fill="white"></rect></clipPath></defs></svg>` : `${stageId === "sales" ? `<svg width="90" height="90" viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg" class="svelte-1j9izwh"><g clip-path="url(#clip0_15_8539)"><rect opacity="0.75" x="12" y="12" width="66" height="66" fill="white"></rect><path fill-rule="evenodd" clip-rule="evenodd" d="M60.1682 55.1935C60.1316 54.8638 60.0195 54.6828 59.7674 54.5492C59.748 54.5384 59.5993 54.5298 59.345 54.5211V39.998C59.345 39.8817 59.3213 39.7804 59.2825 39.692C59.6725 39.6856 60.0152 39.5994 60.1079 39.3364C60.3255 38.7222 57.1188 34.9896 57.0864 34.953C56.4033 34.1707 55.8365 34.1448 55.8063 34.1491C54.1555 33.9897 36.5614 34.1211 33.5702 34.1448H33.5508C33.4205 34.1448 33.319 34.1458 33.2495 34.1464L33.2495 34.1464C33.2132 34.1467 33.1856 34.147 33.1672 34.147C33.1241 34.147 33.081 34.1621 33.0443 34.1858C32.109 34.8495 30.4712 37.4895 30.4087 37.5908C30.1307 37.9852 29.691 38.6942 29.8634 39.0326C29.9259 39.1532 30.0466 39.2222 30.1996 39.2222H31.1586C30.8828 41.4915 30.6802 52.9587 30.6543 54.5018C30.5229 54.5168 30.4022 54.5341 30.2945 54.5621C29.7018 54.7086 29.8182 55.4888 29.857 55.7452C29.8598 55.7606 29.8617 55.7733 29.8632 55.7838L29.8656 55.7991C29.8656 55.8616 29.885 55.9219 29.9281 55.9694C30.0789 56.1439 30.538 56.2646 35.1003 56.2344H35.5356C36.6412 56.228 48.52 56.2064 56.2179 56.2474C56.3894 56.2474 56.5526 56.248 56.7082 56.2485H56.7082H56.7083H56.7084H56.7084H56.7085H56.7085H56.7086H56.7086C56.8501 56.249 56.9852 56.2495 57.1145 56.2495C59.6316 56.2495 59.8256 56.1719 59.9549 55.9844C60.1725 55.6698 60.1984 55.4478 60.1682 55.1914V55.1935ZM56.7653 35.2353C57.7006 36.3085 59.5713 38.7136 59.6919 39.1963C59.5756 39.2696 59.1467 39.2739 58.6855 39.2157C58.6338 39.2007 58.5842 39.192 58.5411 39.1856C58.3924 39.1683 58.2286 39.1511 58.0541 39.136C57.6231 38.0692 56.4873 35.6124 56.0412 34.6556C56.2179 34.7353 56.4744 34.8991 56.7653 35.2332V35.2353ZM51.1449 38.8472L50.4014 38.8343C50.3798 36.9658 50.2096 35.1448 50.1449 34.5047H51.1535C51.1729 35.1146 51.2462 37.5757 51.1449 38.8451V38.8472ZM51.9487 34.5069H51.5846C51.6062 35.1502 51.6749 37.5513 51.5759 38.8537C51.9552 38.8623 52.3237 38.8709 52.6858 38.8796C52.4724 37.6145 52.0436 35.0715 51.9487 34.5069ZM53.1254 38.8925L52.823 37.0997C52.6441 36.0388 52.4587 34.9396 52.3862 34.5112C52.629 34.5112 52.8625 34.5133 53.0858 34.5153C53.1836 34.5162 53.2794 34.517 53.3732 34.5177C53.481 35.022 53.912 37.1167 54.0823 38.9227C53.9083 38.9166 53.7316 38.9112 53.5522 38.9058L53.552 38.9058L53.5516 38.9058C53.4112 38.9015 53.2691 38.8972 53.1254 38.8925ZM54.5176 38.9377C54.356 37.1943 53.9508 35.1707 53.815 34.5241C54.1081 34.5284 54.3754 34.5327 54.6146 34.5371C54.6641 34.7439 55.4313 37.9938 55.6318 38.9852L55.3935 38.9749C55.1106 38.9627 54.8176 38.95 54.5154 38.9399L54.5176 38.9377ZM56.0779 39.0045C55.9249 38.2072 55.2158 35.1987 55.0607 34.5457C55.2438 34.55 55.3969 34.5565 55.524 34.5629C55.7934 35.1405 57.0347 37.8085 57.5735 39.0972C57.1317 39.0627 56.6296 39.0326 56.0779 39.0045ZM49.7118 34.5026C49.7721 35.0866 49.9467 36.9292 49.9704 38.8235C49.8793 38.8225 49.7877 38.8209 49.6956 38.8193L49.6954 38.8193H49.6954H49.6953H49.6953H49.6953H49.6953H49.6953H49.6953H49.6952C49.6 38.8176 49.5042 38.816 49.4079 38.8149C49.3605 37.6037 49.1083 35.1663 49.0372 34.5026H49.7096H49.7118ZM33.7189 38.7804C33.9385 37.6565 34.2097 35.3217 34.294 34.5715L34.2038 34.5724L34.2037 34.5724C34.022 34.5743 33.8625 34.5759 33.7253 34.5759L32.2233 38.7912C32.4605 38.7899 32.7448 38.7877 33.0705 38.7852L33.0712 38.7852L33.7189 38.7804ZM34.7275 34.5672C34.8503 34.5672 34.9774 34.5672 35.1132 34.5651C35.083 35.3021 34.9947 37.7007 35.0723 38.774C34.9061 38.774 34.745 38.7751 34.5885 38.7762H34.5885H34.5884H34.5884H34.5884H34.5883H34.5883H34.5883H34.5883H34.5882C34.4404 38.7772 34.2966 38.7783 34.1564 38.7783C34.3848 37.5671 34.652 35.2439 34.7275 34.5672ZM35.5442 34.5629C35.5162 35.2698 35.4236 37.7438 35.5033 38.7718C35.7843 38.7696 36.0759 38.7675 36.3783 38.7675V38.7567L36.3847 38.6964L36.3871 38.6696C36.5248 37.1355 36.5298 37.0805 36.6476 34.5543C36.2853 34.5583 35.9448 34.5604 35.6278 34.5624L35.5442 34.5629ZM36.8157 38.7352C36.958 37.162 36.9601 37.1253 37.0808 34.55C37.2403 34.55 37.4019 34.55 37.5679 34.5478C37.598 35.2525 37.7101 37.7805 37.8049 38.7632C37.4644 38.7632 37.1325 38.7632 36.8114 38.7653V38.7352H36.8157ZM38.2424 38.761C38.1476 37.8451 38.0334 35.2741 38.0032 34.5457C38.132 34.5457 38.2629 34.5446 38.3954 34.5436C38.5311 34.5425 38.6685 34.5414 38.807 34.5414C38.8286 35.1577 38.8911 37.2913 38.835 38.761H38.2424ZM39.238 34.5371C39.4817 34.5371 39.7275 34.535 39.9773 34.5329L39.9902 34.5327C40.0613 35.1663 40.3264 37.6231 40.363 38.7589H39.2661C39.3199 37.2848 39.2596 35.1728 39.238 34.5371ZM40.794 38.7589C40.7595 37.6231 40.5031 35.2375 40.4233 34.5306C40.5774 34.5306 40.7326 34.5295 40.8888 34.5285C41.0472 34.5274 41.2067 34.5263 41.3673 34.5263C41.3824 35.1965 41.4319 37.746 41.3953 38.7589H40.794ZM42.6043 34.5198C42.3349 34.522 42.0655 34.5241 41.8005 34.5241C41.8156 35.2104 41.8651 37.7147 41.8285 38.7589C42.169 38.761 42.5116 38.761 42.8586 38.761C42.8306 36.7158 42.6409 34.8646 42.6043 34.5198L42.6043 34.5198ZM43.2896 38.7632C43.2616 36.7783 43.0849 34.9702 43.0375 34.5177C43.3694 34.5177 43.7034 34.5155 44.0396 34.5134L44.046 34.5134C44.0741 35.1297 44.1732 37.5499 44.059 38.7653C43.9307 38.7653 43.8025 38.7648 43.6743 38.7643C43.5461 38.7637 43.4178 38.7632 43.2896 38.7632ZM44.4771 34.5112H44.8391C44.9339 35.0758 45.352 37.5563 45.5589 38.7761L44.4943 38.7696C44.6042 37.5111 44.5094 35.1599 44.4792 34.5134L44.4771 34.5112ZM45.4541 35.563L45.454 35.562L45.2766 34.509C45.5934 34.509 45.908 34.509 46.2227 34.5069C46.2938 35.1771 46.5438 37.6037 46.589 38.7826C46.4899 38.7826 46.3908 38.7815 46.2916 38.7804C46.1925 38.7793 46.0934 38.7783 45.9942 38.7783H45.9964C45.863 37.9915 45.6278 36.5946 45.456 35.5742L45.4557 35.5723L45.4541 35.563ZM47.0222 38.7869C46.9769 37.6124 46.7334 35.2418 46.6558 34.5047H47.4295C47.464 35.0651 47.5868 37.2913 47.5287 38.7933C47.4449 38.7933 47.3606 38.7923 47.276 38.7912C47.1908 38.7901 47.1054 38.789 47.0201 38.789L47.0222 38.7869ZM47.8627 34.5026H48.6083C48.6687 35.0801 48.9295 37.5887 48.979 38.8106L47.9597 38.7977C48.0179 37.2977 47.8972 35.106 47.8605 34.5047L47.8627 34.5026ZM30.2557 38.789C30.2901 38.6123 30.5078 38.1942 30.7686 37.8279L30.78 37.8097C30.9256 37.5781 32.4047 35.2245 33.2426 34.578H33.2663L31.7664 38.789H30.2557ZM31.5918 39.2287C31.6694 39.2287 31.7707 39.2287 31.8914 39.2265C31.8957 39.2265 31.8994 39.2276 31.9032 39.2287C31.907 39.2298 31.9108 39.2308 31.9151 39.2308C31.9243 39.2308 31.9319 39.2293 31.9406 39.2275L31.9452 39.2265C35.2878 39.1963 53.3237 39.0627 58.317 39.5972C58.4054 39.6144 58.5023 39.6295 58.6036 39.6425C58.7308 39.6812 58.914 39.7761 58.914 39.998V54.5082C56.3063 54.4522 48.2053 54.4393 41.5483 54.4414C41.5871 53.3057 41.5397 49.4352 41.5375 49.2606C41.5375 48.8899 41.4901 48.0171 41.0419 47.8964C40.8048 47.8318 39.6303 47.8382 37.4062 47.8749L36.9348 47.8819L36.9338 47.8819L36.9332 47.8819L36.9326 47.8819C36.6934 47.8856 36.4954 47.8886 36.361 47.89H35.7834C35.4408 47.89 35.1542 48.1529 35.1175 48.4977C35.0615 49.0084 34.9947 49.7907 34.9947 50.6226C34.9947 52.4005 34.8675 53.9307 34.8201 54.4479C33.0745 54.45 31.9625 54.4522 31.9108 54.4543H31.9L31.7614 54.4562C31.5124 54.4595 31.2903 54.4625 31.0897 54.4716C31.1177 52.8402 31.3267 41.2609 31.594 39.2308L31.5918 39.2287ZM37.8954 48.2973C37.9191 48.7067 37.9385 49.9524 37.8631 51.6851C37.8308 52.4178 37.8114 53.894 37.8049 54.4436C36.8696 54.4436 36.0097 54.4436 35.2511 54.4457C35.3029 53.8854 35.4235 52.3725 35.4235 50.6204C35.4235 49.7649 35.499 48.9524 35.5442 48.5429C35.5572 48.4158 35.6606 48.321 35.7834 48.321H36.3632C36.4995 48.321 36.7023 48.3175 36.9475 48.3133C37.0898 48.3109 37.2464 48.3083 37.4127 48.3059L37.4616 48.3052C37.5953 48.3032 37.742 48.3011 37.8954 48.2973ZM38.2941 51.7045C38.3329 50.795 38.3523 49.8769 38.348 49.1162C38.3458 48.7154 38.3394 48.4611 38.3286 48.293C39.4428 48.2779 40.7466 48.2671 40.9212 48.3102C41.016 48.3727 41.1043 48.8339 41.1065 49.2627L41.1076 49.3659C41.115 50.0084 41.1547 53.4565 41.1194 54.4414H38.2381C38.2446 53.8919 38.2639 52.4264 38.2963 51.7023L38.2941 51.7045ZM59.6144 55.7194C59.373 55.8207 57.7675 55.825 56.2201 55.8164C52.5608 55.797 47.9554 55.7905 44.0137 55.7905C39.6626 55.7905 36.1153 55.797 35.5356 55.7991H35.1003C34.0314 55.8077 30.8785 55.8271 30.288 55.6784L30.2874 55.6744C30.2631 55.5089 30.1927 55.0293 30.4022 54.978C30.7276 54.8983 31.2211 54.8918 31.9065 54.8832H31.9172C33.5982 54.8638 58.4916 54.8616 59.6014 54.9457C59.6747 54.9866 59.72 55.0362 59.7437 55.2388C59.7609 55.3875 59.7609 55.5039 59.6187 55.7194H59.6144ZM33.6973 47.2736C34.5033 47.3814 35.0356 46.9568 35.3395 46.5064C35.3848 46.5926 35.4408 46.6788 35.5162 46.7607C35.7447 47.0085 36.0722 47.14 36.486 47.1529C37.2769 47.1788 37.7898 46.9072 38.0937 46.6055C38.1196 46.6637 38.1519 46.7241 38.1928 46.7801C38.3782 47.0473 38.6799 47.2176 39.0894 47.2844C39.251 47.3102 39.4062 47.3253 39.557 47.3253C40.029 47.3253 40.4384 47.196 40.7423 46.9439C40.8845 46.8253 40.9966 46.6874 41.0742 46.5301C41.3565 46.8878 41.822 47.2391 42.4836 47.2391H42.5181C43.0245 47.2305 43.4232 47.0689 43.7034 46.7585C44.018 46.4116 44.1603 45.8965 44.1107 45.2737C44.1107 45.2543 44.1042 45.2349 44.0978 45.2155L44.0978 45.2155C44.0978 45.2133 44.0967 45.2117 44.0956 45.2101C44.0945 45.2085 44.0935 45.2069 44.0935 45.2047C44.0892 45.1918 44.0827 45.181 44.0762 45.1702L44.0762 45.1702C44.0245 45.0927 42.7853 43.2608 41.5224 42.6639C41.4987 42.6531 41.4707 42.6466 41.4449 42.6445C41.2617 42.6316 36.9235 42.3514 35.3697 42.6488C35.3374 42.6553 35.3072 42.6682 35.2813 42.6876L35.2566 42.7059C35.0065 42.8917 33.1172 44.2948 32.4064 45.0733C32.3741 45.1099 32.3547 45.1552 32.3504 45.2026C32.3008 45.8491 32.5207 47.1163 33.6995 47.2758L33.6973 47.2736ZM42.5095 46.8081C41.5591 46.8297 41.2078 45.9288 41.1949 45.89C41.1582 45.7931 41.0569 45.7349 40.9578 45.7521C40.8565 45.7694 40.7811 45.8556 40.7789 45.959C40.7725 46.2219 40.6669 46.4461 40.4686 46.6098C40.1712 46.8555 39.6949 46.946 39.1626 46.8577C38.8738 46.8103 38.6691 46.7025 38.5506 46.5366C38.3954 46.3167 38.4385 46.0517 38.4385 46.0517C38.4601 45.9396 38.389 45.8275 38.2769 45.8017C38.2597 45.7974 38.2424 45.7952 38.2252 45.7952C38.1325 45.7952 38.0463 45.8556 38.0183 45.9504C37.9364 46.2305 37.5161 46.7499 36.5011 46.7219C36.208 46.7133 35.9839 46.6292 35.8373 46.4698C35.6164 46.2339 35.6237 45.8954 35.624 45.8839L35.624 45.8836C35.6283 45.7737 35.5529 45.6788 35.4451 45.6616C35.3395 45.6444 35.2339 45.709 35.2016 45.8146L35.2011 45.8162C35.18 45.883 34.8294 46.9921 33.7577 46.8469C32.8978 46.7305 32.7857 45.8038 32.7771 45.4095C32.7814 45.4095 32.7857 45.4105 32.79 45.4116C32.7944 45.4127 32.7987 45.4138 32.803 45.4138L32.8226 45.4129C33.0823 45.4002 35.9308 45.2611 43.6905 45.5021C43.6905 45.8232 43.6301 46.2004 43.3866 46.4698C43.1883 46.6874 42.8952 46.8016 42.5116 46.8103L42.5095 46.8081ZM38.4822 44.9232C38.4909 44.7977 38.578 43.5468 38.5657 42.9548C39.0894 42.9656 39.598 42.985 40.0376 43.0022C40.1734 43.3384 40.544 44.2802 40.7143 44.9871C39.8975 44.9677 39.1519 44.9547 38.4773 44.9461C38.4773 44.9442 38.4782 44.9422 38.4791 44.9401C38.4803 44.9375 38.4816 44.9346 38.4816 44.931L38.4822 44.9232ZM43.4642 45.0625C42.6409 45.0366 41.8737 45.0172 41.1582 45C41.016 44.347 40.6906 43.485 40.5096 43.0259C40.8949 43.045 41.1874 43.0624 41.3257 43.0706L41.3263 43.0707L41.3264 43.0707L41.3716 43.0733C42.2013 43.4828 43.0526 44.5173 43.4642 45.0625ZM38.1347 42.9484C38.1476 43.416 38.0829 44.4871 38.0528 44.903C38.0528 44.9106 38.0538 44.917 38.0549 44.9235C38.056 44.9299 38.0571 44.9364 38.0571 44.944C37.1843 44.9332 36.4364 44.9289 35.8007 44.931L36.9407 42.9548C37.32 42.9462 37.7273 42.944 38.1347 42.9505V42.9484ZM35.4947 43.0626C35.7447 43.0195 36.0658 42.9893 36.4321 42.9699L35.3029 44.9289C34.2016 44.9332 33.5034 44.9526 33.1262 44.9655C33.9366 44.2263 35.2512 43.2436 35.4968 43.0626H35.4947ZM52.7116 52.4372C52.4767 52.2518 52.3647 51.8833 52.3668 51.3101L52.3647 51.3122V50.8834C52.3582 49.0171 52.3582 46.8167 52.4056 46.3857C52.4509 45.9698 52.5263 45.8232 52.7375 45.7306L52.8258 45.9267L52.7396 45.7284C52.9875 45.6207 56.5929 45.4892 57.2007 45.8642C57.3407 45.9504 57.3731 46.0581 57.3774 46.1336C57.3989 46.5538 57.4097 47.0193 57.414 48.4072C57.4162 49.4438 57.4119 50.2411 57.3882 51.4825C57.3795 51.9566 57.3364 52.2454 57.1382 52.4092C57.0196 52.5083 56.8623 52.5406 56.6684 52.5083C55.6555 52.3424 53.4982 52.504 53.384 52.5191C53.3732 52.5212 53.3625 52.5234 53.3474 52.5277C53.2913 52.5428 53.1987 52.5643 53.0931 52.5643C52.9746 52.5643 52.8366 52.5363 52.7116 52.4372ZM52.886 46.145C52.8783 46.1711 52.8558 46.2475 52.8345 46.431V46.4288C52.7827 46.89 52.7914 49.7864 52.7957 50.8769V51.3101C52.7935 51.8898 52.9207 52.0536 52.9767 52.0967C53.0435 52.1506 53.1362 52.1333 53.2418 52.1075L53.2635 52.1027L53.2636 52.1027L53.2638 52.1026C53.2846 52.098 53.3027 52.094 53.3172 52.0924C53.4271 52.0773 55.6619 51.907 56.7352 52.0837C56.7977 52.0945 56.8429 52.0902 56.8602 52.0773C56.9442 52.0083 56.9528 51.6053 56.955 51.4739C56.9808 50.2347 56.983 49.4416 56.9808 48.4072C56.9787 47.0969 56.9679 46.6141 56.9485 46.2155C56.802 46.1443 56.246 46.043 54.9271 46.043H54.8969C53.9336 46.043 53.0435 46.0969 52.9013 46.1271L52.8883 46.1336C52.8894 46.1336 52.8884 46.1368 52.886 46.145ZM45.7464 52.0471C45.7507 52.1225 45.783 52.2303 45.9231 52.3165C46.2291 52.5061 47.2916 52.5665 48.3045 52.5665C49.3174 52.5665 50.2613 52.5061 50.3841 52.4523L50.2979 52.254L50.3863 52.4501C50.5975 52.3574 50.6708 52.2109 50.7182 51.795C50.7656 51.3639 50.7656 49.1636 50.7591 47.2973V46.8684C50.7591 46.3943 50.6427 46.0517 50.4057 45.8469C50.1535 45.6271 49.8583 45.6444 49.7441 45.6594C49.6105 45.6745 47.5674 45.7413 46.436 45.6681C46.2356 45.6551 46.0804 45.6982 45.9662 45.8038C45.7658 45.987 45.7442 46.3167 45.7356 46.696C45.7119 47.9417 45.7076 48.7369 45.7098 49.7713C45.7119 51.1592 45.7248 51.6247 45.7464 52.045V52.0471ZM46.1666 46.7047C46.1688 46.5516 46.1774 46.1939 46.2572 46.1206C46.2852 46.0948 46.3627 46.0948 46.4059 46.0969C47.5674 46.1745 49.6493 46.1077 49.8023 46.0862C49.8475 46.0797 50.0005 46.0668 50.1212 46.1724C50.257 46.2909 50.3281 46.5301 50.3259 46.8663V47.2973C50.3303 48.3878 50.3389 51.2842 50.2872 51.7454C50.2659 51.9288 50.2433 52.0052 50.2356 52.0313C50.2332 52.0396 50.2322 52.0428 50.2333 52.0428L50.2203 52.0493C50.0781 52.0794 49.1881 52.1333 48.2226 52.1333H48.1924C46.8735 52.1333 46.3175 52.032 46.1709 51.9609C46.1516 51.5622 46.1408 51.0795 46.1386 49.7692C46.1365 48.7391 46.1386 47.9438 46.1645 46.7025L46.1666 46.7047ZM49.3928 46.9934H48.5911C48.4726 46.9934 48.3756 46.8965 48.3756 46.7779C48.3756 46.6594 48.4726 46.5624 48.5911 46.5624H49.4596C49.4898 46.5624 49.5178 46.5689 49.5436 46.5797C49.6902 46.64 49.9294 46.8684 49.9057 47.3383C49.8855 47.7391 49.9033 48.2427 49.9055 48.3058L49.9057 48.3124C49.91 48.4309 49.8173 48.5322 49.6988 48.5365H49.6902C49.5738 48.5365 49.479 48.446 49.4747 48.3296L49.4737 48.2975V48.2974C49.4695 48.1713 49.454 47.7066 49.4747 47.3145C49.4855 47.1206 49.4273 47.0301 49.3928 46.9934ZM49.6794 49.0731C49.5609 49.0796 49.4704 49.183 49.4768 49.3015L49.5846 51.1592C49.5911 51.2734 49.6859 51.3618 49.8001 51.3618H49.813C49.9316 51.3553 50.0221 51.2519 50.0156 51.1334L49.9079 49.2757C49.9014 49.1571 49.7958 49.0666 49.6794 49.0731ZM53.5155 46.9525H53.4982L53.5004 46.9546C53.3883 46.9546 53.2935 46.8684 53.2849 46.7542C53.2763 46.6357 53.3646 46.5323 53.4832 46.5236L54.3409 46.4611C54.4637 46.4504 54.5628 46.5409 54.5715 46.6594C54.5801 46.7779 54.4917 46.8814 54.3732 46.89L53.5155 46.9525ZM55.1383 46.8059C55.1383 46.8059 55.6533 46.7866 55.8861 46.8059L55.8877 46.8061C56.0376 46.8189 56.1275 46.8266 56.1425 47.1788C56.1605 47.609 56.1451 48.3978 56.1428 48.5153L56.1425 48.53C56.1404 48.6485 56.233 48.7477 56.3537 48.7498H56.358C56.4744 48.7498 56.5714 48.6572 56.5735 48.5386L56.5745 48.4836C56.5785 48.2801 56.5922 47.5725 56.5735 47.1572C56.552 46.6508 56.3494 46.4094 55.9227 46.3728C55.6984 46.3541 55.2781 46.3678 55.1563 46.3718L55.1232 46.3728C55.0046 46.3771 54.912 46.4784 54.9163 46.5969C54.9206 46.7154 55.0327 46.8081 55.1404 46.8038L55.1383 46.8059ZM56.1123 49.3339C56.108 49.2132 56.2007 49.114 56.3192 49.1097C56.4356 49.1033 56.5391 49.1981 56.5434 49.3166L56.5843 50.4243C56.5886 50.545 56.496 50.6442 56.3774 50.6485H56.3688C56.2524 50.6485 56.1576 50.558 56.1533 50.4416L56.1123 49.3339ZM40.3652 48.7347C40.2466 48.7412 40.1561 48.8425 40.1626 48.9632L40.1655 49.0195C40.179 49.2737 40.2353 50.3359 40.2466 51.1484C40.2466 51.267 40.3436 51.3618 40.4621 51.3618H40.4643C40.5828 51.3618 40.6776 51.2627 40.6776 51.1441C40.6663 50.3256 40.6099 49.2538 40.5965 48.9981L40.5936 48.9416C40.5871 48.8231 40.4837 48.7326 40.3673 48.7391L40.3652 48.7347ZM40.2466 52.0019C40.2466 51.8833 40.3436 51.7863 40.4621 51.7863C40.5807 51.7863 40.6776 51.8833 40.6776 52.0019V53.4371C40.6776 53.5557 40.5807 53.6527 40.4621 53.6527C40.3436 53.6527 40.2466 53.5557 40.2466 53.4371V52.0019Z" fill="black"></path><path d="M72.9552 81C72.1033 81 71.1648 80.9667 70.1532 80.8935C64.9617 80.5341 23.3898 79.9684 16.4012 80.7404C12.7073 81.1531 10.4443 80.7537 9.47922 79.5357C9.00666 78.9434 8.94011 78.2711 9.03994 77.7919L10.2513 14.223C10.1914 12.8652 11.0167 10.782 13.5459 10.5024C17.6126 10.0498 68.9485 8.78524 73.2481 9.0315C74.0335 9.07809 74.7257 9.09806 75.3447 9.11802C78.7058 9.23117 80.7358 9.29773 80.8689 13.3577C81.4413 31.0354 79.9571 76.1679 79.8972 77.9716C79.9105 78.2645 79.844 78.8302 79.3248 79.4026C78.3464 80.4742 76.2498 81 72.9552 81ZM34.5448 78.1647C49.081 78.1647 67.005 78.4775 70.3062 78.7038C76.2432 79.1164 77.5211 78.1114 77.7075 77.9184C77.7607 76.3942 79.2516 31.1019 78.6792 13.4309C78.6348 12.0954 77.5011 11.3898 75.2781 11.3144C74.6458 11.2944 73.9336 11.2678 73.1283 11.2212C68.8486 10.975 17.8322 12.2329 13.7922 12.6855C12.5409 12.8253 12.4344 13.7637 12.4477 14.1564V14.2296L11.223 78.1314L11.2097 78.178C11.3495 78.3177 12.2613 78.9833 16.155 78.5507C18.7574 78.2645 26.072 78.158 34.5382 78.158L34.5448 78.1647Z" fill="#171F1F"></path><path d="M36.9087 66.48C36.9087 66.4267 36.9353 66.4 36.9887 66.4H37.3967C37.45 66.4 37.4767 66.4267 37.4767 66.48V71.92C37.4767 71.9733 37.45 72 37.3967 72H36.9887C36.9353 72 36.9087 71.9733 36.9087 71.92V69.464C36.9087 69.4427 36.898 69.432 36.8767 69.432H34.3247C34.3033 69.432 34.2927 69.4427 34.2927 69.464V71.92C34.2927 71.9733 34.266 72 34.2127 72H33.8047C33.7513 72 33.7247 71.9733 33.7247 71.92V66.48C33.7247 66.4267 33.7513 66.4 33.8047 66.4H34.2127C34.266 66.4 34.2927 66.4267 34.2927 66.48V68.904C34.2927 68.9253 34.3033 68.936 34.3247 68.936H36.8767C36.898 68.936 36.9087 68.9253 36.9087 68.904V66.48ZM40.247 67.888C40.727 67.888 41.0977 68.0107 41.359 68.256C41.6204 68.5013 41.751 68.8267 41.751 69.232V71.92C41.751 71.9733 41.7244 72 41.671 72H41.263C41.2097 72 41.183 71.9733 41.183 71.92V71.592C41.183 71.5813 41.1777 71.5733 41.167 71.568C41.1617 71.5627 41.1537 71.5653 41.143 71.576C41.0097 71.736 40.8364 71.8587 40.623 71.944C40.4097 72.024 40.1724 72.064 39.911 72.064C39.5324 72.064 39.215 71.968 38.959 71.776C38.703 71.584 38.575 71.2907 38.575 70.896C38.575 70.496 38.719 70.1813 39.007 69.952C39.3004 69.7173 39.7057 69.6 40.223 69.6H41.151C41.1724 69.6 41.183 69.5893 41.183 69.568V69.264C41.183 68.992 41.1057 68.7787 40.951 68.624C40.8017 68.464 40.567 68.384 40.247 68.384C39.991 68.384 39.783 68.4347 39.623 68.536C39.463 68.632 39.3644 68.768 39.327 68.944C39.311 68.9973 39.279 69.0213 39.231 69.016L38.799 68.96C38.7404 68.9493 38.7164 68.928 38.727 68.896C38.7697 68.5973 38.9297 68.3547 39.207 68.168C39.4844 67.9813 39.831 67.888 40.247 67.888ZM40.023 71.576C40.3377 71.576 40.6097 71.4987 40.839 71.344C41.0684 71.184 41.183 70.9707 41.183 70.704V70.08C41.183 70.0587 41.1724 70.048 41.151 70.048H40.311C39.959 70.048 39.6764 70.12 39.463 70.264C39.2497 70.408 39.143 70.608 39.143 70.864C39.143 71.0987 39.223 71.2773 39.383 71.4C39.5484 71.5173 39.7617 71.576 40.023 71.576ZM44.613 67.896C45.0396 67.896 45.3783 68.0213 45.629 68.272C45.885 68.5227 46.013 68.8587 46.013 69.28V71.92C46.013 71.9733 45.9863 72 45.933 72H45.525C45.4716 72 45.445 71.9733 45.445 71.92V69.392C45.445 69.0987 45.3543 68.8587 45.173 68.672C44.997 68.4853 44.7676 68.392 44.485 68.392C44.1916 68.392 43.9543 68.4827 43.773 68.664C43.5916 68.8453 43.501 69.0827 43.501 69.376V71.92C43.501 71.9733 43.4743 72 43.421 72H43.013C42.9596 72 42.933 71.9733 42.933 71.92V68.032C42.933 67.9787 42.9596 67.952 43.013 67.952H43.421C43.4743 67.952 43.501 67.9787 43.501 68.032V68.376C43.501 68.3867 43.5036 68.3947 43.509 68.4C43.5196 68.4053 43.5276 68.4027 43.533 68.392C43.7676 68.0613 44.1276 67.896 44.613 67.896ZM49.7028 66.48C49.7028 66.4267 49.7294 66.4 49.7828 66.4H50.1908C50.2441 66.4 50.2708 66.4267 50.2708 66.48V71.92C50.2708 71.9733 50.2441 72 50.1908 72H49.7828C49.7294 72 49.7028 71.9733 49.7028 71.92V71.584C49.7028 71.5733 49.6974 71.568 49.6868 71.568C49.6814 71.5627 49.6734 71.5653 49.6628 71.576C49.5454 71.7307 49.3988 71.8507 49.2228 71.936C49.0521 72.0213 48.8601 72.064 48.6468 72.064C48.2734 72.064 47.9588 71.968 47.7028 71.776C47.4521 71.584 47.2788 71.3227 47.1828 70.992C47.1081 70.752 47.0708 70.4133 47.0708 69.976C47.0708 69.5333 47.1028 69.2027 47.1668 68.984C47.2628 68.6427 47.4388 68.376 47.6948 68.184C47.9508 67.9867 48.2681 67.888 48.6468 67.888C48.8548 67.888 49.0468 67.9307 49.2228 68.016C49.3988 68.096 49.5454 68.2133 49.6628 68.368C49.6734 68.3787 49.6814 68.384 49.6868 68.384C49.6974 68.3787 49.7028 68.3707 49.7028 68.36V66.48ZM49.5588 70.952C49.6068 70.8453 49.6414 70.72 49.6628 70.576C49.6841 70.432 49.6948 70.232 49.6948 69.976C49.6948 69.72 49.6841 69.52 49.6628 69.376C49.6414 69.2267 49.6041 69.096 49.5508 68.984C49.4868 68.8027 49.3801 68.6587 49.2308 68.552C49.0868 68.44 48.9134 68.384 48.7108 68.384C48.4974 68.384 48.3134 68.4373 48.1588 68.544C48.0041 68.6507 47.8921 68.792 47.8228 68.968C47.7588 69.0853 47.7108 69.2187 47.6788 69.368C47.6521 69.512 47.6388 69.7147 47.6388 69.976C47.6388 70.2267 47.6494 70.424 47.6708 70.568C47.6921 70.7067 47.7294 70.832 47.7828 70.944C47.8468 71.136 47.9588 71.288 48.1188 71.4C48.2841 71.512 48.4788 71.568 48.7028 71.568C48.9161 71.568 49.0948 71.512 49.2388 71.4C49.3828 71.288 49.4894 71.1387 49.5588 70.952ZM54.662 69.296C54.6833 69.4453 54.694 69.632 54.694 69.856V70.112C54.694 70.1653 54.6673 70.192 54.614 70.192H52.03C52.0086 70.192 51.998 70.2027 51.998 70.224C52.0086 70.5173 52.0246 70.7067 52.046 70.792C52.1046 71.032 52.23 71.2213 52.422 71.36C52.614 71.4987 52.8593 71.568 53.158 71.568C53.382 71.568 53.5793 71.5173 53.75 71.416C53.9206 71.3147 54.054 71.1707 54.15 70.984C54.182 70.936 54.2193 70.9253 54.262 70.952L54.574 71.136C54.6166 71.1627 54.6273 71.2 54.606 71.248C54.4726 71.504 54.2726 71.7067 54.006 71.856C53.7393 72 53.4326 72.072 53.086 72.072C52.7073 72.0667 52.39 71.976 52.134 71.8C51.878 71.624 51.694 71.3787 51.582 71.064C51.486 70.808 51.438 70.44 51.438 69.96C51.438 69.736 51.4406 69.5547 51.446 69.416C51.4566 69.272 51.478 69.144 51.51 69.032C51.6006 68.6853 51.782 68.408 52.054 68.2C52.3313 67.992 52.6646 67.888 53.054 67.888C53.5393 67.888 53.9126 68.0107 54.174 68.256C54.4353 68.5013 54.598 68.848 54.662 69.296ZM53.054 68.384C52.7926 68.384 52.574 68.4533 52.398 68.592C52.2273 68.7253 52.1153 68.9067 52.062 69.136C52.03 69.248 52.0086 69.4293 51.998 69.68C51.998 69.7013 52.0086 69.712 52.03 69.712H54.102C54.1233 69.712 54.134 69.7013 54.134 69.68C54.1233 69.44 54.1073 69.2693 54.086 69.168C54.0273 68.928 53.9073 68.7387 53.726 68.6C53.55 68.456 53.326 68.384 53.054 68.384ZM55.9036 72C55.8503 72 55.8236 71.9733 55.8236 71.92V66.48C55.8236 66.4267 55.8503 66.4 55.9036 66.4H56.3116C56.3649 66.4 56.3916 66.4267 56.3916 66.48V71.92C56.3916 71.9733 56.3649 72 56.3116 72H55.9036Z" fill="black"></path></g><defs><clipPath id="clip0_15_8539"><rect width="90" height="90" fill="white"></rect></clipPath></defs></svg>` : `${stageId === "storage" ? `<svg width="90" height="90" viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg" class="svelte-1j9izwh"><g clip-path="url(#clip0_15_8553)"><rect opacity="0.75" x="12" y="12" width="66" height="66" fill="white"></rect><path fill-rule="evenodd" clip-rule="evenodd" d="M60.0751 40.3554C60.037 38.9741 60.0032 37.7295 59.9842 36.4718C59.98 36.1509 59.7221 35.8929 59.4094 35.8929H59.4072L57.7609 35.8994C55.4995 35.9124 53.1578 35.9319 50.1673 35.9666L43.136 36.0533L43.0859 36.054C41.7226 36.0711 40.3613 36.0882 39 36.1032C36.652 36.1314 34.5259 36.1509 32.5055 36.1618C31.8038 36.1661 31.1 36.1704 30.3963 36.1726C30.242 36.1726 30.0983 36.2355 29.9905 36.3461C29.8806 36.461 29.8214 36.6084 29.8214 36.7646C29.8256 38.0656 29.8341 39.4208 29.8447 40.776V40.7804V40.7847C29.8658 43.6491 29.8975 46.5179 29.925 48.9074L29.9461 50.6334C29.9588 51.5485 29.9694 52.4115 29.9799 53.4176C29.9799 53.5781 30.0454 53.7277 30.1574 53.8383C30.2716 53.9489 30.4195 54.0074 30.5801 54.0009C31.4974 53.9662 33.4819 53.9185 34.006 53.9532C35.8405 54.0758 41.5997 54.0917 44.7533 54.1005L44.8288 54.1007C45.6467 54.1028 46.2934 54.105 46.6654 54.1072L57.6468 53.9359C58.2279 53.9077 58.8324 53.8838 59.496 53.8665C59.8088 53.8578 60.0561 53.6019 60.0582 53.2854C60.0645 52.0516 60.0835 50.3667 60.1237 49.3433C60.2336 46.5374 60.1575 43.2328 60.0772 40.3532L60.0751 40.3554ZM44.0324 50.3147V50.3146L44.0321 50.2995L44.0257 50.0328C44.025 49.9846 44.0236 49.9213 44.022 49.846L44.022 49.8458C44.0192 49.7177 44.0157 49.5551 44.0131 49.3736L44.0115 49.2881C43.999 48.5862 43.9828 47.674 43.9666 47.3679C43.937 46.828 43.9095 46.301 43.9032 45.7698C43.9032 45.6505 43.8081 45.5551 43.6918 45.5551H43.5861C43.1635 45.5616 42.7281 45.566 42.2843 45.5551C41.5065 45.5334 40.7225 45.5313 39.9363 45.5378C39.9701 44.163 39.9299 41.6304 39.9172 40.8715C44.254 40.8172 47.5298 40.776 50.0363 40.7435L50.037 40.8558L50.037 40.8565L50.037 40.8577C50.0471 42.59 50.094 50.6283 50.0321 52.2142L44.0701 52.3616C44.0638 51.6463 44.0451 50.8523 44.0324 50.3147ZM30.3688 50.6269L30.3477 48.9009C30.3202 46.5699 30.2906 43.7857 30.2695 40.9929L31.603 40.9755C34.5597 40.9387 37.174 40.9061 39.4946 40.878C39.5072 41.6347 39.5495 44.1782 39.5136 45.5443C37.8238 45.57 36.1258 45.6485 34.4582 45.7256L34.3927 45.7286L34.1138 45.7416C33.5584 45.768 32.9938 45.7924 32.4321 45.8168L32.3153 45.8218C32.254 45.824 32.1948 45.8544 32.1567 45.9042C32.1187 45.9541 32.1039 46.0192 32.1166 46.082C32.3723 47.3701 32.3427 51.0433 32.3258 52.1383V52.1817L30.3857 52.1058L30.3667 50.6269H30.3688ZM43.5439 47.3917C43.5481 47.4915 43.5544 47.6584 43.5608 47.8601C42.5871 47.8357 35.9713 47.8536 33.5141 47.8602L32.7083 47.8623C32.6999 47.665 32.6893 47.4741 32.6766 47.292L32.9229 47.285C34.8001 47.2319 41.8864 47.0313 43.5249 47.0209L43.5439 47.3896V47.3917ZM32.7253 48.2959C33.8285 48.2916 42.6182 48.2656 43.5692 48.2959C43.5735 48.4497 43.5756 48.6099 43.5777 48.7702L43.5777 48.7708L32.7422 48.9421C32.7379 48.7253 32.7316 48.5106 32.7231 48.2981L32.7253 48.2959ZM32.6449 46.8605C32.6259 46.6328 32.6027 46.4246 32.5752 46.2447C33.0951 46.223 33.6192 46.1991 34.1349 46.1753L34.4244 46.1623C37.0113 46.0408 39.6848 45.9172 42.2737 45.991C42.6858 46.0018 43.1064 45.9996 43.4847 45.9953C43.4888 46.1906 43.497 46.3839 43.5053 46.5791L43.5058 46.5916C41.9057 46.6014 35.4413 46.7838 33.2126 46.8467H33.2126L32.6449 46.8627V46.8605ZM32.7527 49.3758L43.5883 49.2045C43.5883 49.2652 43.5904 49.3259 43.5925 49.3845C43.5938 49.4829 43.5959 49.5748 43.5978 49.6587V49.6588L43.5978 49.659L43.5978 49.6591L43.5978 49.6594L43.5978 49.6597L43.5979 49.6617L43.5979 49.6619C43.599 49.7135 43.6001 49.7621 43.6009 49.8073C41.4558 49.6837 33.9574 49.8073 32.7591 49.829C32.7591 49.7305 32.7572 49.632 32.7554 49.5323C32.7544 49.4805 32.7535 49.4284 32.7527 49.3758ZM50.459 40.7392C57.3424 40.6481 58.1645 40.6264 59.6587 40.5722C59.7369 43.3954 59.8088 46.6003 59.701 49.3281C59.6735 50.0241 59.6545 51.0216 59.6439 51.9778L50.4548 52.2055C50.5159 50.547 50.471 42.8134 50.4601 40.9284L50.459 40.7392ZM30.2885 36.6561C30.3181 36.6258 30.3561 36.6106 30.3984 36.6106C31.1021 36.6084 31.8059 36.6041 32.5076 36.5998C34.5301 36.5889 36.6541 36.5694 39.0042 36.5412C40.3843 36.526 41.7622 36.5087 43.1401 36.4914L43.1402 36.4914L50.1716 36.4046C53.16 36.3699 55.4995 36.3482 57.7609 36.3374L59.4094 36.3309C59.4918 36.3309 59.5615 36.3981 59.5615 36.4827C59.5784 37.6709 59.6101 38.8505 59.6461 40.1429C57.5897 40.2166 56.8162 40.2318 39.708 40.4465C39.7059 40.4465 39.7043 40.4459 39.7027 40.4454C39.7011 40.4448 39.6996 40.4443 39.6974 40.4443C39.6953 40.4443 39.6932 40.4448 39.6911 40.4454C39.689 40.4459 39.6869 40.4465 39.6848 40.4465C37.3156 40.4768 34.6379 40.5093 31.5967 40.5462L30.2652 40.5635L30.265 40.5222C30.2566 39.2524 30.2483 37.9894 30.2441 36.7689C30.2441 36.7277 30.2589 36.6908 30.2885 36.6605V36.6561ZM30.5632 53.5651C30.5146 53.5672 30.4787 53.5521 30.4491 53.5217C30.4195 53.4935 30.4026 53.4523 30.4026 53.4111C30.4006 53.2682 30.3991 53.1281 30.3976 52.9903L30.3976 52.9903C30.3959 52.8376 30.3943 52.6876 30.392 52.5394L32.3195 52.6153C32.3153 52.9037 32.3131 53.1639 32.3195 53.5174C31.677 53.5282 31.0092 53.5477 30.5632 53.5651ZM33.3699 53.5065C33.1796 53.5065 32.9662 53.5065 32.7422 53.5109C32.7343 53.1236 32.7392 52.8496 32.745 52.5222L32.7464 52.4419L32.7506 52.1426C32.757 51.7588 32.7633 51.0606 32.7591 50.2583C33.9088 50.2388 41.5488 50.1152 43.6073 50.2388V50.3082C43.6305 51.1734 43.6749 52.9731 43.6305 53.6605C40.3885 53.6496 35.6523 53.6258 34.0314 53.5174C33.8919 53.5087 33.6573 53.5044 33.3699 53.5044V53.5065ZM59.4833 53.435C58.8155 53.4523 58.2089 53.4762 57.632 53.5044L46.6633 53.6757C46.2956 53.6735 45.6488 53.6713 44.8288 53.6692C44.5858 53.6692 44.3258 53.6692 44.0553 53.667C44.068 53.4502 44.0722 53.1466 44.0722 52.7975L59.6397 52.4137C59.6376 52.7172 59.6355 53.0143 59.6334 53.2854C59.6334 53.3678 59.5679 53.4328 59.4833 53.435ZM44.1188 39.2972H44.6915C45.8116 39.2907 46.9846 39.2604 47.0945 39.2517C47.2044 39.243 47.3714 39.2278 47.4749 39.0479C47.532 38.9481 47.5594 38.7616 47.5447 38.0157V37.9355C47.5447 37.8358 47.5087 37.7425 47.439 37.671C47.2572 37.4888 46.8937 37.491 46.5683 37.5062H46.5133C46.4119 37.5105 44.0786 37.5452 42.9818 37.5105C42.6584 37.4997 42.4724 37.517 42.3562 37.6384C42.2907 37.7078 42.2611 37.7967 42.2674 37.9073C42.2793 38.1176 42.269 38.2167 42.259 38.3135L42.2569 38.3345L42.2561 38.3412C42.25 38.3952 42.2441 38.4478 42.2421 38.5145C42.2421 38.5352 42.2403 38.5587 42.2385 38.5831L42.2385 38.5831L42.2385 38.5832C42.2375 38.5969 42.2365 38.611 42.2357 38.625L42.2346 38.6418V38.6418V38.6418V38.6418V38.6418C42.2264 38.7656 42.2173 38.9033 42.2294 39.0132C42.2526 39.2235 42.2611 39.2994 44.1209 39.2994L44.1188 39.2972ZM42.6611 38.5825L42.6611 38.5825C42.6625 38.5649 42.6638 38.5479 42.6648 38.5318C42.6662 38.4906 42.6698 38.4558 42.6733 38.4222C42.6748 38.408 42.6762 38.3941 42.6774 38.38L42.6798 38.3577C42.69 38.2609 42.702 38.1472 42.6922 37.942C42.7387 37.9377 42.8233 37.9333 42.967 37.9377C43.9221 37.9695 45.8066 37.9463 46.3667 37.9394C46.4548 37.9383 46.5101 37.9377 46.5239 37.9377H46.5873C46.9318 37.9203 47.067 37.9442 47.122 37.9659V38.0201C47.1325 38.534 47.122 38.7335 47.1093 38.8115C47.1019 38.8115 47.0934 38.8126 47.085 38.8137C47.0765 38.8148 47.0681 38.8159 47.0607 38.8159C46.7479 38.8419 43.3664 38.9004 42.6478 38.8202C42.6478 38.7763 42.6517 38.731 42.6554 38.6875L42.6584 38.6511L42.6563 38.6532C42.6575 38.6288 42.6593 38.6051 42.6611 38.5825ZM32.4337 39.1259C32.3639 39.0544 32.328 38.9611 32.328 38.8614L32.3259 38.8592V38.779C32.3111 38.0331 32.3386 37.8466 32.3956 37.7469C32.4992 37.5669 32.6662 37.5517 32.7761 37.543C32.886 37.5344 34.0589 37.504 35.179 37.4975C37.6095 37.4845 37.6179 37.5517 37.6433 37.7816C37.6553 37.8929 37.6464 38.0279 37.6382 38.1509L37.6369 38.1697C37.6361 38.1851 37.6351 38.1999 37.634 38.2142C37.6323 38.2382 37.6306 38.2607 37.6306 38.2824C37.6286 38.3491 37.6226 38.4017 37.6166 38.4557V38.4558V38.4558L37.6158 38.4624L37.6136 38.4834C37.6036 38.5802 37.5934 38.6793 37.6052 38.8896C37.6116 39.0002 37.582 39.0891 37.5165 39.1585C37.4002 39.2799 37.2143 39.2972 36.8909 39.2864C35.7919 39.2517 33.4735 39.2842 33.3594 39.2907H33.3044C33.2283 39.2951 33.1523 39.2972 33.0762 39.2972C32.8204 39.2972 32.5732 39.2647 32.4337 39.1259ZM32.7877 37.9789L32.7877 37.9789C32.7792 37.98 32.7708 37.981 32.7634 37.981L32.7613 37.9789C32.7486 38.0569 32.738 38.2564 32.7486 38.7703V38.8245C32.8035 38.8484 32.9388 38.8722 33.2833 38.8527H33.3467C33.4629 38.8506 35.7961 38.8159 36.9036 38.8527C37.0473 38.8571 37.1318 38.8527 37.1783 38.8484C37.1685 38.6432 37.1805 38.5295 37.1908 38.4327L37.1931 38.4104C37.1943 38.3979 37.1956 38.3854 37.1969 38.3727C37.2005 38.3389 37.2043 38.3033 37.2058 38.2608C37.2067 38.2467 37.2079 38.2312 37.2091 38.2149C37.211 38.1909 37.213 38.1651 37.2143 38.1393L37.217 38.1073L37.217 38.1072C37.2208 38.0639 37.2248 38.0174 37.2248 37.9724C36.5063 37.8921 33.1248 37.9507 32.812 37.9767C32.8046 37.9767 32.7961 37.9778 32.7877 37.9789L32.7877 37.9789ZM53.6819 39.2972H54.2546C55.3747 39.2907 56.5477 39.2604 56.6576 39.2517C56.7675 39.243 56.9344 39.2278 57.038 39.0479C57.0951 38.9481 57.1225 38.7616 57.1077 38.0157V37.9355C57.1077 37.8358 57.0718 37.7425 57.0021 37.671C56.8203 37.4888 56.4568 37.491 56.1313 37.5062H56.0764C55.975 37.5105 53.6417 37.5452 52.5449 37.5105C52.2215 37.4997 52.0355 37.517 51.9193 37.6384C51.8538 37.7078 51.8242 37.7967 51.8305 37.9073C51.8424 38.1176 51.8321 38.2167 51.8221 38.3135L51.82 38.3345L51.8192 38.3412C51.8131 38.3952 51.8072 38.4478 51.8052 38.5145C51.8052 38.5352 51.8034 38.5587 51.8016 38.5831C51.8006 38.5969 51.7996 38.611 51.7988 38.625L51.7977 38.6418C51.7895 38.7655 51.7804 38.9032 51.7925 39.0132C51.8157 39.2235 51.8242 39.2994 53.684 39.2994L53.6819 39.2972ZM52.2194 38.6532C52.2206 38.6288 52.2224 38.6051 52.2242 38.5824C52.2256 38.5649 52.2269 38.5479 52.2278 38.5318C52.2293 38.4906 52.2329 38.4558 52.2364 38.4221C52.2378 38.408 52.2393 38.3941 52.2405 38.38L52.2429 38.3577V38.3577C52.2531 38.2609 52.2651 38.1472 52.2553 37.942C52.3018 37.9377 52.3864 37.9333 52.5301 37.9377C53.4852 37.9676 55.3697 37.9458 55.9298 37.9393C56.0178 37.9383 56.0732 37.9377 56.087 37.9377H56.1504C56.4949 37.9203 56.6301 37.9442 56.6851 37.9659V38.0201C56.6956 38.534 56.6851 38.7335 56.6724 38.8115C56.665 38.8115 56.6565 38.8126 56.6481 38.8137C56.6396 38.8148 56.6312 38.8159 56.6238 38.8159C56.311 38.8419 52.9295 38.9004 52.2109 38.8202C52.2109 38.7763 52.2148 38.731 52.2185 38.6875L52.2215 38.6511L52.2194 38.6532ZM58.7796 39.1671H58.7669C58.6549 39.1671 58.5619 39.0782 58.5555 38.9633L58.4372 36.9554C58.4309 36.8361 58.5196 36.7321 58.6359 36.7256C58.7542 36.719 58.8535 36.8101 58.8599 36.9294L58.9782 38.9373C58.9846 39.0565 58.8958 39.1606 58.7796 39.1671ZM58.9148 45.5638H58.9233C59.0395 45.5595 59.1304 45.4575 59.1261 45.3383L58.9782 41.3788C58.974 41.2596 58.8746 41.1642 58.7584 41.1707C58.6422 41.175 58.5513 41.2769 58.5555 41.3962L58.7035 45.3556C58.7077 45.4727 58.8007 45.5638 58.9148 45.5638ZM58.7035 46.648C58.7035 46.5287 58.7986 46.4312 58.9148 46.4312C59.031 46.4312 59.1261 46.5287 59.1261 46.648V48.825C59.1261 48.9443 59.031 49.0419 58.9148 49.0419C58.7986 49.0419 58.7035 48.9443 58.7035 48.825V46.648Z" fill="black"></path><path d="M72.9552 81C72.1033 81 71.1648 80.9667 70.1532 80.8935C64.9617 80.5341 23.3898 79.9684 16.4012 80.7404C12.7073 81.1531 10.4443 80.7537 9.47922 79.5357C9.00666 78.9434 8.94011 78.2711 9.03994 77.7919L10.2513 14.223C10.1914 12.8652 11.0167 10.782 13.5459 10.5024C17.6126 10.0498 68.9485 8.78524 73.2481 9.0315C74.0335 9.07809 74.7257 9.09806 75.3447 9.11802C78.7058 9.23117 80.7358 9.29773 80.8689 13.3577C81.4413 31.0354 79.9571 76.1679 79.8972 77.9716C79.9105 78.2645 79.844 78.8302 79.3248 79.4026C78.3464 80.4742 76.2498 81 72.9552 81ZM34.5448 78.1647C49.081 78.1647 67.005 78.4775 70.3062 78.7038C76.2432 79.1164 77.5211 78.1114 77.7075 77.9184C77.7607 76.3942 79.2516 31.1019 78.6792 13.4309C78.6348 12.0954 77.5011 11.3898 75.2781 11.3144C74.6458 11.2944 73.9336 11.2678 73.1283 11.2212C68.8486 10.975 17.8322 12.2329 13.7922 12.6855C12.5409 12.8253 12.4344 13.7637 12.4477 14.1564V14.2296L11.223 78.1314L11.2097 78.178C11.3495 78.3177 12.2613 78.9833 16.155 78.5507C18.7574 78.2645 26.072 78.158 34.5382 78.158L34.5448 78.1647Z" fill="#171F1F"></path><path d="M29.3437 72C29.2904 72 29.2637 71.9733 29.2637 71.92V66.48C29.2637 66.4267 29.2904 66.4 29.3437 66.4H29.7517C29.8051 66.4 29.8317 66.4267 29.8317 66.48V71.472C29.8317 71.4933 29.8424 71.504 29.8637 71.504H32.6877C32.7411 71.504 32.7677 71.5307 32.7677 71.584V71.92C32.7677 71.9733 32.7411 72 32.6877 72H29.3437ZM35.0986 67.888C35.5786 67.888 35.9493 68.0107 36.2106 68.256C36.4719 68.5013 36.6026 68.8267 36.6026 69.232V71.92C36.6026 71.9733 36.5759 72 36.5226 72H36.1146C36.0613 72 36.0346 71.9733 36.0346 71.92V71.592C36.0346 71.5813 36.0293 71.5733 36.0186 71.568C36.0133 71.5627 36.0053 71.5653 35.9946 71.576C35.8613 71.736 35.6879 71.8587 35.4746 71.944C35.2613 72.024 35.0239 72.064 34.7626 72.064C34.3839 72.064 34.0666 71.968 33.8106 71.776C33.5546 71.584 33.4266 71.2907 33.4266 70.896C33.4266 70.496 33.5706 70.1813 33.8586 69.952C34.1519 69.7173 34.5573 69.6 35.0746 69.6H36.0026C36.0239 69.6 36.0346 69.5893 36.0346 69.568V69.264C36.0346 68.992 35.9573 68.7787 35.8026 68.624C35.6533 68.464 35.4186 68.384 35.0986 68.384C34.8426 68.384 34.6346 68.4347 34.4746 68.536C34.3146 68.632 34.2159 68.768 34.1786 68.944C34.1626 68.9973 34.1306 69.0213 34.0826 69.016L33.6506 68.96C33.5919 68.9493 33.5679 68.928 33.5786 68.896C33.6213 68.5973 33.7813 68.3547 34.0586 68.168C34.3359 67.9813 34.6826 67.888 35.0986 67.888ZM34.8746 71.576C35.1893 71.576 35.4613 71.4987 35.6906 71.344C35.9199 71.184 36.0346 70.9707 36.0346 70.704V70.08C36.0346 70.0587 36.0239 70.048 36.0026 70.048H35.1626C34.8106 70.048 34.5279 70.12 34.3146 70.264C34.1013 70.408 33.9946 70.608 33.9946 70.864C33.9946 71.0987 34.0746 71.2773 34.2346 71.4C34.3999 71.5173 34.6133 71.576 34.8746 71.576ZM40.2805 68.032C40.2805 67.9787 40.3072 67.952 40.3605 67.952H40.7685C40.8219 67.952 40.8485 67.9787 40.8485 68.032V71.864C40.8485 72.4613 40.6752 72.8987 40.3285 73.176C39.9872 73.4533 39.5152 73.592 38.9125 73.592C38.7899 73.592 38.6965 73.5893 38.6325 73.584C38.5792 73.5787 38.5525 73.5493 38.5525 73.496L38.5685 73.128C38.5685 73.1013 38.5765 73.08 38.5925 73.064C38.6085 73.0533 38.6272 73.0507 38.6485 73.056L38.8645 73.064C39.3605 73.064 39.7205 72.9653 39.9445 72.768C40.1685 72.576 40.2805 72.2693 40.2805 71.848V71.552C40.2805 71.5413 40.2752 71.536 40.2645 71.536C40.2592 71.5307 40.2512 71.5333 40.2405 71.544C39.9952 71.864 39.6459 72.024 39.1925 72.024C38.8459 72.024 38.5365 71.9307 38.2645 71.744C37.9979 71.5573 37.8192 71.2933 37.7285 70.952C37.6645 70.7333 37.6325 70.408 37.6325 69.976C37.6325 69.7413 37.6379 69.544 37.6485 69.384C37.6645 69.224 37.6939 69.08 37.7365 68.952C37.8325 68.632 38.0059 68.376 38.2565 68.184C38.5072 67.9867 38.8085 67.888 39.1605 67.888C39.6352 67.888 39.9952 68.0453 40.2405 68.36C40.2512 68.3707 40.2592 68.3733 40.2645 68.368C40.2752 68.3627 40.2805 68.3547 40.2805 68.344V68.032ZM40.2405 70.776C40.2565 70.696 40.2672 70.5973 40.2725 70.48C40.2779 70.3627 40.2805 70.192 40.2805 69.968C40.2805 69.696 40.2779 69.5147 40.2725 69.424C40.2672 69.328 40.2539 69.24 40.2325 69.16C40.1899 68.936 40.0832 68.752 39.9125 68.608C39.7472 68.4587 39.5365 68.384 39.2805 68.384C39.0299 68.384 38.8165 68.456 38.6405 68.6C38.4699 68.744 38.3499 68.9307 38.2805 69.16C38.2272 69.3307 38.2005 69.5973 38.2005 69.96C38.2005 70.3493 38.2272 70.6187 38.2805 70.768C38.3339 70.992 38.4485 71.1787 38.6245 71.328C38.8059 71.472 39.0245 71.544 39.2805 71.544C39.5419 71.544 39.7552 71.472 39.9205 71.328C40.0912 71.184 40.1979 71 40.2405 70.776ZM45.1698 69.296C45.1911 69.4453 45.2018 69.632 45.2018 69.856V70.112C45.2018 70.1653 45.1751 70.192 45.1218 70.192H42.5378C42.5164 70.192 42.5058 70.2027 42.5058 70.224C42.5164 70.5173 42.5324 70.7067 42.5538 70.792C42.6124 71.032 42.7378 71.2213 42.9298 71.36C43.1218 71.4987 43.3671 71.568 43.6658 71.568C43.8898 71.568 44.0871 71.5173 44.2578 71.416C44.4284 71.3147 44.5618 71.1707 44.6578 70.984C44.6898 70.936 44.7271 70.9253 44.7698 70.952L45.0818 71.136C45.1244 71.1627 45.1351 71.2 45.1138 71.248C44.9804 71.504 44.7804 71.7067 44.5138 71.856C44.2471 72 43.9404 72.072 43.5938 72.072C43.2151 72.0667 42.8978 71.976 42.6418 71.8C42.3858 71.624 42.2018 71.3787 42.0898 71.064C41.9938 70.808 41.9458 70.44 41.9458 69.96C41.9458 69.736 41.9484 69.5547 41.9538 69.416C41.9644 69.272 41.9858 69.144 42.0178 69.032C42.1084 68.6853 42.2898 68.408 42.5618 68.2C42.8391 67.992 43.1724 67.888 43.5618 67.888C44.0471 67.888 44.4204 68.0107 44.6818 68.256C44.9431 68.5013 45.1058 68.848 45.1698 69.296ZM43.5618 68.384C43.3004 68.384 43.0818 68.4533 42.9058 68.592C42.7351 68.7253 42.6231 68.9067 42.5698 69.136C42.5378 69.248 42.5164 69.4293 42.5058 69.68C42.5058 69.7013 42.5164 69.712 42.5378 69.712H44.6098C44.6311 69.712 44.6418 69.7013 44.6418 69.68C44.6311 69.44 44.6151 69.2693 44.5938 69.168C44.5351 68.928 44.4151 68.7387 44.2338 68.6C44.0578 68.456 43.8338 68.384 43.5618 68.384ZM47.9634 67.912C48.1394 67.912 48.2914 67.9467 48.4194 68.016C48.4621 68.0373 48.4781 68.072 48.4674 68.12L48.3794 68.512C48.3634 68.5653 48.3287 68.5813 48.2754 68.56C48.1847 68.5227 48.0807 68.504 47.9634 68.504L47.8594 68.512C47.5821 68.5227 47.3527 68.6267 47.1714 68.824C46.9901 69.016 46.8994 69.2613 46.8994 69.56V71.92C46.8994 71.9733 46.8727 72 46.8194 72H46.4114C46.3581 72 46.3314 71.9733 46.3314 71.92V68.032C46.3314 67.9787 46.3581 67.952 46.4114 67.952H46.8194C46.8727 67.952 46.8994 67.9787 46.8994 68.032V68.52C46.8994 68.536 46.9021 68.5467 46.9074 68.552C46.9181 68.552 46.9261 68.5467 46.9314 68.536C47.0434 68.3387 47.1847 68.1867 47.3554 68.08C47.5314 67.968 47.7341 67.912 47.9634 67.912ZM51.6935 68.032C51.6935 67.9787 51.7201 67.952 51.7735 67.952H52.1815C52.2348 67.952 52.2615 67.9787 52.2615 68.032V71.92C52.2615 71.9733 52.2348 72 52.1815 72H51.7735C51.7201 72 51.6935 71.9733 51.6935 71.92V71.576C51.6935 71.5653 51.6881 71.5573 51.6775 71.552C51.6668 71.5467 51.6588 71.5493 51.6535 71.56C51.4295 71.8907 51.0748 72.056 50.5895 72.056C50.3335 72.056 50.0961 72.0053 49.8775 71.904C49.6641 71.7973 49.4935 71.6453 49.3655 71.448C49.2428 71.2507 49.1815 71.0133 49.1815 70.736V68.032C49.1815 67.9787 49.2081 67.952 49.2615 67.952H49.6695C49.7228 67.952 49.7495 67.9787 49.7495 68.032V70.568C49.7495 70.872 49.8348 71.1147 50.0055 71.296C50.1761 71.472 50.4081 71.56 50.7015 71.56C51.0055 71.56 51.2455 71.4693 51.4215 71.288C51.6028 71.1067 51.6935 70.8667 51.6935 70.568V68.032ZM55.2145 67.896C55.6412 67.896 55.9799 68.0213 56.2305 68.272C56.4865 68.5227 56.6145 68.8587 56.6145 69.28V71.92C56.6145 71.9733 56.5879 72 56.5345 72H56.1265C56.0732 72 56.0465 71.9733 56.0465 71.92V69.392C56.0465 69.0987 55.9559 68.8587 55.7745 68.672C55.5985 68.4853 55.3692 68.392 55.0865 68.392C54.7932 68.392 54.5559 68.4827 54.3745 68.664C54.1932 68.8453 54.1025 69.0827 54.1025 69.376V71.92C54.1025 71.9733 54.0759 72 54.0225 72H53.6145C53.5612 72 53.5345 71.9733 53.5345 71.92V68.032C53.5345 67.9787 53.5612 67.952 53.6145 67.952H54.0225C54.0759 67.952 54.1025 67.9787 54.1025 68.032V68.376C54.1025 68.3867 54.1052 68.3947 54.1105 68.4C54.1212 68.4053 54.1292 68.4027 54.1345 68.392C54.3692 68.0613 54.7292 67.896 55.2145 67.896ZM60.343 68.032C60.343 67.9787 60.3697 67.952 60.423 67.952H60.831C60.8844 67.952 60.911 67.9787 60.911 68.032V71.864C60.911 72.4613 60.7377 72.8987 60.391 73.176C60.0497 73.4533 59.5777 73.592 58.975 73.592C58.8524 73.592 58.759 73.5893 58.695 73.584C58.6417 73.5787 58.615 73.5493 58.615 73.496L58.631 73.128C58.631 73.1013 58.639 73.08 58.655 73.064C58.671 73.0533 58.6897 73.0507 58.711 73.056L58.927 73.064C59.423 73.064 59.783 72.9653 60.007 72.768C60.231 72.576 60.343 72.2693 60.343 71.848V71.552C60.343 71.5413 60.3377 71.536 60.327 71.536C60.3217 71.5307 60.3137 71.5333 60.303 71.544C60.0577 71.864 59.7084 72.024 59.255 72.024C58.9084 72.024 58.599 71.9307 58.327 71.744C58.0604 71.5573 57.8817 71.2933 57.791 70.952C57.727 70.7333 57.695 70.408 57.695 69.976C57.695 69.7413 57.7004 69.544 57.711 69.384C57.727 69.224 57.7564 69.08 57.799 68.952C57.895 68.632 58.0684 68.376 58.319 68.184C58.5697 67.9867 58.871 67.888 59.223 67.888C59.6977 67.888 60.0577 68.0453 60.303 68.36C60.3137 68.3707 60.3217 68.3733 60.327 68.368C60.3377 68.3627 60.343 68.3547 60.343 68.344V68.032ZM60.303 70.776C60.319 70.696 60.3297 70.5973 60.335 70.48C60.3404 70.3627 60.343 70.192 60.343 69.968C60.343 69.696 60.3404 69.5147 60.335 69.424C60.3297 69.328 60.3164 69.24 60.295 69.16C60.2524 68.936 60.1457 68.752 59.975 68.608C59.8097 68.4587 59.599 68.384 59.343 68.384C59.0924 68.384 58.879 68.456 58.703 68.6C58.5324 68.744 58.4124 68.9307 58.343 69.16C58.2897 69.3307 58.263 69.5973 58.263 69.96C58.263 70.3493 58.2897 70.6187 58.343 70.768C58.3964 70.992 58.511 71.1787 58.687 71.328C58.8684 71.472 59.087 71.544 59.343 71.544C59.6044 71.544 59.8177 71.472 59.983 71.328C60.1537 71.184 60.2604 71 60.303 70.776Z" fill="black"></path></g><defs><clipPath id="clip0_15_8553"><rect width="90" height="90" fill="white"></rect></clipPath></defs></svg>` : ``}`}`}`}`}`}`;
});
const css$7 = {
  code: ".stage.svelte-1cs5tf8{bottom:0;left:0;position:absolute;right:0;top:0}",
  map: null
};
const Stage_1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { coordinate } = $$props;
  const stage = BOARD_SUPPLY_CHAINS.flat().filter((stage2) => isEqual(stage2.coordinate, coordinate))[0];
  if ($$props.coordinate === void 0 && $$bindings.coordinate && coordinate !== void 0)
    $$bindings.coordinate(coordinate);
  $$result.css.add(css$7);
  return `${stage ? `<div class="stage svelte-1cs5tf8">${validate_component(Stage, "Stage").$$render($$result, { stageId: stage.id }, {}, {})}</div>` : ``}`;
});
const css$6 = {
  code: ".square.svelte-152p90b.svelte-152p90b{--_inactive-opacity:0;display:block;grid-column:var(--_column);grid-row:var(--_row);isolation:isolate;position:relative}.square.svelte-152p90b.svelte-152p90b,.square.svelte-152p90b>.svelte-152p90b{min-height:0;min-width:0}.move-button.svelte-152p90b.svelte-152p90b{background:transparent;bottom:0;cursor:pointer;display:block;left:0;position:absolute;right:0;top:0;transition:background .3s ease-out}.move-button.svelte-152p90b span.svelte-152p90b{display:none}.move-button.svelte-152p90b.svelte-152p90b:hover{background:hsla(0,0%,100%,.133);transition-duration:0ms}",
  map: null
};
const Square = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $canMove, $$unsubscribe_canMove;
  let $isPossibleMove, $$unsubscribe_isPossibleMove;
  let $canPlace, $$unsubscribe_canPlace;
  let $isPossiblePlacement, $$unsubscribe_isPossiblePlacement;
  let { coordinate } = $$props;
  const { machine: machine2 } = getGameContext();
  const isPossibleMove = useSelector(machine2.service, (state) => {
    const moving = state.matches("Playing.Gameloop.Playing.Moving");
    if (!moving)
      return false;
    const gameState = GameState.fromContext(state.context);
    return gameState.isValidMove(coordinate);
  });
  $$unsubscribe_isPossibleMove = subscribe(isPossibleMove, (value) => $isPossibleMove = value);
  const isPossiblePlacement = useSelector(machine2.service, (state) => {
    const placing = state.matches("Playing.Gameloop.Playing.Placing");
    if (!placing)
      return false;
    const gameState = GameState.fromContext(state.context);
    return gameState.isValidPlacement(coordinate);
  });
  $$unsubscribe_isPossiblePlacement = subscribe(isPossiblePlacement, (value) => $isPossiblePlacement = value);
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
  const getPlacementEvent = (to, context) => {
    return {
      type: "apply game event",
      gameEvent: {
        type: "placement",
        finalized: true,
        playerId: GameState.fromContext(context).activePlayer.id,
        coordinate: to
      }
    };
  };
  const canMove = useSelector(machine2.service, (state) => state.can(getMoveEvent(coordinate, machine2.service.getSnapshot().context)));
  $$unsubscribe_canMove = subscribe(canMove, (value) => $canMove = value);
  const canPlace = useSelector(machine2.service, (state) => state.can(getPlacementEvent(coordinate, machine2.service.getSnapshot().context)));
  $$unsubscribe_canPlace = subscribe(canPlace, (value) => $canPlace = value);
  if ($$props.coordinate === void 0 && $$bindings.coordinate && coordinate !== void 0)
    $$bindings.coordinate(coordinate);
  $$result.css.add(css$6);
  $$unsubscribe_canMove();
  $$unsubscribe_isPossibleMove();
  $$unsubscribe_canPlace();
  $$unsubscribe_isPossiblePlacement();
  return `<div class="square svelte-152p90b"${add_styles({
    "--_row": coordinate[1] + 1,
    "--_column": coordinate[0] + 1
  })}>${validate_component(Stage_1, "Stage").$$render($$result, { coordinate }, {}, {})} ${validate_component(Items, "Items").$$render($$result, { coordinate }, {}, {})} ${validate_component(Players$1, "Players").$$render($$result, { coordinate }, {}, {})} ${$canMove && $isPossibleMove ? `<button class="move-button unstyled svelte-152p90b" data-svelte-h="svelte-1xw0taw"><span class="svelte-152p90b">Move</span></button>` : ``} ${$canPlace && $isPossiblePlacement ? `<button class="move-button unstyled svelte-152p90b" data-svelte-h="svelte-4t2lbw"><span class="svelte-152p90b">Place</span></button>` : ``} </div>`;
});
const css$5 = {
  code: ".board.svelte-1hrfbni{grid-gap:0;display:grid;gap:0;grid-template-columns:repeat(var(--column-count),1fr);grid-template-rows:repeat(var(--row-count),1fr);height:var(--board-height);position:relative;width:var(--board-width)}",
  map: null
};
const Board = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$5);
  return `<div class="board svelte-1hrfbni">${validate_component(Backdrop, "Backdrop").$$render($$result, {}, {}, {})} ${validate_component(StageLines, "StageLines").$$render($$result, {}, {}, {})} ${each([...new Array(ROW_COUNT)], (_, y) => {
    return `${each([...new Array(COLUMN_COUNT)], (_2, x) => {
      return `${validate_component(Square, "Square").$$render($$result, { coordinate: [x, y] }, {}, {})}`;
    })}`;
  })} ${validate_component(Grid, "Grid").$$render($$result, {}, {}, {})} ${validate_component(Dimming, "Dimming").$$render($$result, {}, {}, {})} </div>`;
});
const css$4 = {
  code: '.players-container.svelte-1clf3xk.svelte-1clf3xk{grid-gap:1rem;align-content:start;display:grid;flex:1;gap:1rem;grid-template-areas:"defense defense" "attack admin";margin-left:1rem;margin-right:1rem}.players-container.svelte-1clf3xk .attack.svelte-1clf3xk{grid-area:attack}.players-container.svelte-1clf3xk .defense.svelte-1clf3xk{grid-area:defense}.players-container.svelte-1clf3xk .admin.svelte-1clf3xk{grid-area:admin}h3.svelte-1clf3xk.svelte-1clf3xk{font:var(--text-small);margin-bottom:.25rem;margin-top:0}.players.svelte-1clf3xk.svelte-1clf3xk{-moz-column-gap:1rem;column-gap:1rem;display:flex;flex-wrap:wrap}.players.svelte-1clf3xk .player.svelte-1clf3xk{width:4.875rem}.players.svelte-1clf3xk .player-role.svelte-1clf3xk{text-wrap:nowrap;font-size:.625rem;height:1.5em;margin-bottom:.25rem;overflow:hidden;text-align:center;text-overflow:ellipsis;width:100%}',
  map: null
};
const Players = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $defensePlayers, $$unsubscribe_defensePlayers;
  let $users, $$unsubscribe_users;
  let $activePlayerId, $$unsubscribe_activePlayerId;
  let $attackPlayers, $$unsubscribe_attackPlayers;
  let $defenseAdmins, $$unsubscribe_defenseAdmins;
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
  $$result.css.add(css$4);
  $$unsubscribe_defensePlayers();
  $$unsubscribe_users();
  $$unsubscribe_activePlayerId();
  $$unsubscribe_attackPlayers();
  $$unsubscribe_defenseAdmins();
  $$unsubscribe_attackAdmins();
  return `<div class="players-container svelte-1clf3xk"><div class="defense svelte-1clf3xk"><h3 class="svelte-1clf3xk" data-svelte-h="svelte-1krh9a0">Verteidiger:innen</h3> <div class="players svelte-1clf3xk">${each($defensePlayers, (player) => {
    let user = getUserForPlayer(player, $users), character = getCharacter(player.character);
    return `  <div class="player svelte-1clf3xk"><div class="player-role svelte-1clf3xk">${escape(character.name)}</div> ${validate_component(Player, "Player").$$render(
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
    )} </div>`;
  })}</div></div> <div class="attack svelte-1clf3xk"><h3 class="svelte-1clf3xk" data-svelte-h="svelte-1fki2a7">Angreifer:innen</h3> <div class="players svelte-1clf3xk">${each($attackPlayers, (player) => {
    let user = getUserForPlayer(player, $users), character = getCharacter(player.character);
    return `  <div class="player svelte-1clf3xk"><div class="player-role svelte-1clf3xk">${escape(character.name)}</div> ${validate_component(Player, "Player").$$render(
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
    )} </div>`;
  })}</div></div> <div class="admin svelte-1clf3xk"><h3 class="svelte-1clf3xk" data-svelte-h="svelte-1m660uj">Spielleitung</h3> <div class="players svelte-1clf3xk">${each([...$defenseAdmins, ...$attackAdmins], (admin) => {
    return `<div class="player svelte-1clf3xk"><div class="player-role svelte-1clf3xk">${escape(admin.side === "attack" ? "Angriff" : "Verteidigung")}</div> ${validate_component(Player, "Player").$$render(
      $$result,
      {
        name: admin.name,
        side: "admin",
        isConnected: admin.isConnected
      },
      {},
      {}
    )} </div>`;
  })}</div></div> </div>`;
});
const css$3 = {
  code: ".rounds.svelte-190qug7.svelte-190qug7{align-items:flex-end;display:flex;flex-direction:column-reverse;gap:.5rem;width:100%}.rounds.svelte-190qug7 .round.svelte-190qug7{--_base-width:3.5rem;--_min-percent:10%;--_max-percent:65%;--_percent:calc(var(--_min-percent) + (var(--_max-percent) - var(--_min-percent))*var(--round)/12);align-items:center;background-color:#dadcdf;background:color-mix(in oklab,var(--color-blue-spielbrett2) calc(10% + 55%*var(--round)/12),#fff);color:var(--color-blue-transp-10);display:flex;font-size:.875rem;font-weight:500;height:2.125rem;justify-content:flex-end;padding:.3125rem 0;position:relative;width:3.5rem;width:var(--_base-width)}@supports (color:color-mix(in lch,red,blue)) and (top:var(--f )){.rounds.svelte-190qug7 .round.svelte-190qug7{background:color-mix(in oklab,var(--color-blue-spielbrett2) var(--_percent),#fff)}}.rounds.svelte-190qug7 .round span.svelte-190qug7{text-align:center;width:var(--_base-width)}.rounds.svelte-190qug7 .round.current.svelte-190qug7{font-size:1rem;font-weight:700;width:calc(var(--_base-width) + 1.375rem)}.rounds.svelte-190qug7 .round .global-attack.svelte-190qug7{position:absolute;right:-.75rem;top:1.5rem;width:2rem}.rounds.svelte-190qug7 .round .attacker-reveal.svelte-190qug7{left:-1.25rem;position:absolute;top:1.5rem;width:2rem}.rounds.svelte-190qug7 .round .attacker-reveal .eye.svelte-190qug7{left:-.75rem;position:absolute;top:.25rem}",
  map: null
};
const Rounds = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $currentRound, $$unsubscribe_currentRound;
  const { machine: machine2 } = getGameContext();
  const currentRound = useSelector(machine2.service, ({ context }) => GameState.fromContext(context).currentRound);
  $$unsubscribe_currentRound = subscribe(currentRound, (value) => $currentRound = value);
  $$result.css.add(css$3);
  $$unsubscribe_currentRound();
  return `<div class="rounds svelte-190qug7">${each(new Array(TOTAL_ROUNDS), (_, i) => {
    return `<div class="${["round svelte-190qug7", $currentRound === i ? "current" : ""].join(" ").trim()}"${add_styles({ "--round": i })}><span class="svelte-190qug7">${escape(i + 1)}</span> ${NEW_GLOBAL_ATTACK_ROUNDS.includes(i) ? `<div class="global-attack svelte-190qug7">${validate_component(Polygon, "Polygon").$$render($$result, { color: "orange" }, {}, {})}</div>` : ``} ${ATTACKER_REVEAL_ROUNDS.includes(i) ? `<div class="attacker-reveal svelte-190qug7">${validate_component(Polygon, "Polygon").$$render($$result, { color: "red-angriff" }, {}, {})} <svg class="eye svelte-190qug7" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 21"><g clip-path="url(#a2)"><path d="M25.5 12.9c.4 0 .7 0 1-.2.3-.3.6-.8.1-1.3-.8-.9-7.9-7.4-16.3-5.1-8.5 2.2-9.8 6-9.8 6s1.7 4.2 10.3 5.4A17.5 17.5 0 0 0 24.9 13s.3-.3.6-.2Z" stroke="#fff" stroke-linecap="round" stroke-linejoin="round"></path><path d="M13 7.3s-2.6.6-3 2.3c-.4 1.7-.7 5.3 2.5 6.4 3.2 1.2 6-3.1 4.8-6.4-1-3.3-4.2-2.3-4.2-2.3Z" fill="#fff"></path><path d="M1.5 5S4 7 5 8.3M13.9.5l-.2 5.3M22 8l3.2-2.5M6.7 1.8 9 6.6m9.7-.2L20.5 2m5.1 12.4s0 2.4-3.3 4m-2.4 1.2s-1 .5-2.4.8" stroke="#fff" stroke-linecap="round" stroke-linejoin="round"></path><path d="M13.5 8.6s-2.4.4-2.3 2.8" stroke="#1F2134" stroke-linecap="round" stroke-linejoin="round"></path><path d="M13.5 10s-1 .3-1.2.9c-.1.6-.3 2 1 2.4 1.2.5 2.2-1.2 1.8-2.4-.4-1.3-1.6-.9-1.6-.9Z" fill="#1F2134"></path></g><defs><clipPath id="a2"><path fill="#fff" d="M0 0h27.4v20.9H0z"></path></clipPath></defs></svg> </div>` : ``} </div>`;
  })} </div>`;
});
const Status = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${validate_component(Rounds, "Rounds").$$render($$result, {}, {}, {})}`;
});
const InventoryIcon = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="m27.96.69-.01-.12V.55c-.12-.44-.16-.6-5.04-.54-2.35.03-5.01.1-6.13.17-2.6.14-6.62.11-8.5.04h-.1c-.19.03-.94.26-2.8 2.03a62.45 62.45 0 0 0-4.35 4.82c-.4.41-.76 1.45-.94 4.18-.11 1.89-.09 3.76-.09 3.77.08 5.34.18 11.77.27 12.09.1.4.15.59 4.87.78a115.9 115.9 0 0 0 6.05.08c2.6-.14 6.61-.11 8.5-.03a1.27 1.27 0 0 0 .95-.39c1.3-1.14 6.06-5.42 6.59-6.5.55-1.14.7-6.79.73-7.91.04-5.21.07-11.42 0-12.45ZM6.06 2.97c1.45-1.37 2.1-1.7 2.26-1.76 1.95.08 5.92.1 8.51-.04 2.08-.11 7.59-.24 9.66-.14a182.9 182.9 0 0 1-6.25 5.89c-1.77-.08-13.31-.6-17.57-.26a52.5 52.5 0 0 1 3.4-3.69Zm5.07 24.01a87.6 87.6 0 0 1-9.9-.36c-.07-1.41-.17-7.5-.23-11.61-.05-3.4.25-6.57.69-7.17l.02-.03.03-.03c1.99-.5 12.84-.14 18.49.13.28.78.14 4.21.06 6.1l-.06 1.73c-.03.93-.05 2.48-.07 4.12-.03 2.57-.07 5.49-.14 6.82 0 .06-.03.11-.06.15l-.07.07a.3.3 0 0 1-.16.04c-1.9-.07-5.96-.1-8.6.04Zm15.83-13.86c-.06 2.51-.28 6.77-.64 7.5-.3.62-3.03 3.2-5.27 5.23.05-1.52.08-3.86.11-5.97.02-1.64.04-3.19.07-4.1l.06-1.72c.16-3.8.17-5.75-.17-6.59a187.8 187.8 0 0 0 5.87-5.53c.02 2.32 0 7.5-.03 11.19Z" fill="currentColor"></path></svg>`;
});
const ScenariosIcon = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="m16.6 38-.09-.01a.36.36 0 0 1-.26-.31c-.1-.99.49-13.73.55-15.16-.15 0-.59.05-1.56.44-1.52.61-2.68.75-3.45.41-.5-.21-.65-.55-.67-.61a.33.33 0 0 1-.03-.13c0-1.33 3.97-15.6 4.42-17.23a.37.37 0 0 1 .26-.25l11.9-3.03c.81-.2 1.36-.15 1.7.16.32.3.25.72.24.76a.3.3 0 0 1-.02.08l-4.97 11.64c2.4-.5 4.58-.26 4.68-.25a.36.36 0 0 1 .29.5C25.04 25.8 16.99 37.72 16.9 37.84a.36.36 0 0 1-.3.16Zm.92-15.53c-.18 4.04-.5 11.15-.56 13.98 1.99-3.03 8-12.47 11.77-21.26-.86-.05-2.75-.08-4.63.43a.36.36 0 0 1-.36-.12.37.37 0 0 1-.06-.37L28.9 2.89a.14.14 0 0 0-.04-.1c-.04-.02-.25-.17-1.03.03l-11.7 2.97c-1.72 6.18-4.2 15.42-4.33 16.75.14.16.81.7 3.16-.25 1.66-.66 2.13-.53 2.38-.3.16.14.2.34.17.48Z" fill="currentColor"></path><path d="M16.16 12.19a.36.36 0 0 1-.35-.44l.42-1.71a.36.36 0 0 1 .7.17l-.42 1.7a.36.36 0 0 1-.35.28Zm.8-3.57-.1-.01a.36.36 0 0 1-.25-.45l.46-1.59a.35.35 0 0 1 .26-.25l3.23-.76a.36.36 0 0 1 .16.7l-3.02.7-.4 1.4a.36.36 0 0 1-.34.26Zm6.19 15.08a.36.36 0 0 1-.3-.55c.38-.59 2.13-4.16 3.01-5.97a.36.36 0 0 1 .65.31c-.1.22-2.56 5.27-3.06 6.05a.36.36 0 0 1-.3.16Zm6.69-12.36a.36.36 0 0 1-.19-.67l7.48-4.54a.36.36 0 0 1 .37.62l-7.48 4.53a.37.37 0 0 1-.18.06Zm1.93 3.62a.36.36 0 0 1-.01-.72l6.53-.26c.2 0 .37.15.38.34 0 .2-.15.37-.35.38l-6.53.26h-.02Zm4.03 7.41a.38.38 0 0 1-.15-.03l-5.28-2.35a.36.36 0 0 1 .3-.66l5.27 2.36a.36.36 0 0 1-.14.68Zm-24.87-9.99a.4.4 0 0 1-.15-.03L3.56 9.03a.36.36 0 0 1-.17-.47c.08-.18.3-.26.47-.18l7.22 3.32c.18.08.26.3.18.47a.36.36 0 0 1-.33.21ZM9.6 16.82l-8.24-.26a.36.36 0 0 1-.35-.37c0-.2.16-.36.37-.35l8.24.27a.36.36 0 0 1 0 .71Zm-5.17 6.31a.36.36 0 0 1-.14-.68L9.1 20.2a.36.36 0 1 1 .3.65L4.59 23.1a.36.36 0 0 1-.16.03Z" fill="currentColor"></path></svg>`;
});
const css$2 = {
  code: ".info-panel.svelte-fv2ej2.svelte-fv2ej2{display:flex;height:22.5rem;margin-left:.375rem}nav.svelte-fv2ej2.svelte-fv2ej2{align-items:flex-end;display:flex;flex-direction:column;gap:.25rem}nav.svelte-fv2ej2 button.svelte-fv2ej2{background-color:var(--color-blue-transp-12);border-radius:var(--radius-md);border-bottom-right-radius:0;border-top-right-radius:0;height:2.5rem;padding:.3125rem;width:2.5rem}nav.svelte-fv2ej2 button.active.svelte-fv2ej2{background-color:#fff;color:var(--color-blue-spielbrett);height:3.125rem;padding:.625rem;width:3.125rem}nav.svelte-fv2ej2 button.svelte-fv2ej2 svg{display:block;height:100%;width:100%}.content.svelte-fv2ej2.svelte-fv2ej2{background-color:#fff;border-radius:var(--radius-md);border-top-left-radius:0;color:var(--color-blue-spielbrett);flex:1;padding:1.25rem}",
  map: null
};
const InfoPanel = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$2);
  return `<div class="info-panel svelte-fv2ej2"><nav class="svelte-fv2ej2"><button class="${["unstyled svelte-fv2ej2", "active"].join(" ").trim()}">${validate_component(ScenariosIcon, "ScenariosIcon").$$render($$result, {}, {}, {})}</button> <button class="${["unstyled svelte-fv2ej2", ""].join(" ").trim()}">${validate_component(InventoryIcon, "InventoryIcon").$$render($$result, {}, {}, {})}</button></nav> <div class="content svelte-fv2ej2">${`<div data-svelte-h="svelte-la2830">Szenarios</div>`}</div> </div>`;
});
const css$1 = {
  code: ".playing.svelte-1cqxqrn{grid-gap:1rem;display:grid;gap:1rem;grid-template-columns:27.75rem auto 1fr}.board.svelte-1cqxqrn,.playing.svelte-1cqxqrn{position:relative}.board.svelte-1cqxqrn{--board-height:45rem;--board-width:calc(var(--board-height)*var(--column-count)/var(--row-count));--board-square-size:calc(var(--board-height)/var(--row-count))}.player-status.svelte-1cqxqrn{display:flex;flex-direction:column;gap:1rem}",
  map: null
};
const Playing = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$1);
  return `<div class="playing svelte-1cqxqrn"><div class="player-status svelte-1cqxqrn">${validate_component(Players, "Players").$$render($$result, {}, {}, {})} ${validate_component(InfoPanel, "InfoPanel").$$render($$result, {}, {}, {})}</div> <div class="board svelte-1cqxqrn">${validate_component(Board, "Board").$$render($$result, {}, {}, {})} ${validate_component(Actions, "Actions").$$render($$result, {}, {}, {})}</div> <div class="game-status">${validate_component(Status, "Status").$$render($$result, {}, {}, {})}</div> </div>`;
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
  let debug = !!window.location.hash.match("#debug");
  const socketConnection = createWebSocketConnection({
    gameId,
    userId,
    onMessage: (message) => {
      if (message.type === "mouse position") {
        mousePositions[message.userId] = message.position;
      } else {
        machine2.send(message);
      }
    },
    debug
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
    })}</div> ${debug ? `<pre>${escape($socketConnection.log.join("\n"))}

${escape(JSON.stringify($state, null, 2))}
</pre>` : ``}`;
  } while (!$$settled);
  $$unsubscribe_socketConnection();
  $$unsubscribe_state();
  return $$rendered;
});

export { Page as default };
//# sourceMappingURL=_page.svelte-c8927a07.js.map
