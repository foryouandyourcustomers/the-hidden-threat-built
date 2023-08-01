import { c as create_ssr_component, a as subscribe, v as validate_component, e as escape, o as onDestroy, s as setContext, b as each, d as add_attribute, g as getContext, f as add_styles, h as compute_slots } from './ssr-6cc58d58.js';
import { r as readable, w as writable } from './index2-e6c59f12.js';
import { r as require_root, g as require_baseGetTag, h as requireIsObjectLike, j as requireIsObject, c as createMachine, d as interpret, a as assign, n as not, s as sharedGuards, e as isEqual, F as FACES, i as isDefenderId } from './isEqual-4af3109a.js';
import { B as Button, i as is_void } from './Button-c1b84db9.js';
import { c as commonjsGlobal, a as getDefaultExportFromCjs } from './_commonjsHelpers-849bcf65.js';

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
                    params: {},
                    type: "forwardToServer"
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
                params: {},
                type: "forwardToServer"
              },
              reenter: false
            },
            "assign admin": {
              target: "Assigning sides",
              guard: "isAdmin",
              actions: {
                params: {},
                type: "forwardToServer"
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
                    params: {},
                    type: "forwardToServer"
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
                    params: {},
                    type: "forwardToServer"
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
                params: {},
                type: "forwardToServer"
              },
              reenter: false
            },
            "stop editing player": {
              target: "Assigning roles",
              guard: "isAdmin",
              actions: {
                params: {},
                type: "forwardToServer"
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
                    move: {
                      target: "Ready to move",
                      guard: "userControlsPlayer",
                      actions: {
                        params: {},
                        type: "forwardToServer"
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
                    "perform action": {
                      target: "Ready for action",
                      guard: "userControlsPlayer",
                      actions: {
                        params: {},
                        type: "forwardToServer"
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
                params: {},
                type: "forwardToServer"
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
        params: {},
        type: "updateSharedGameContext"
      },
      reenter: false
    },
    "send emoji": {
      target: "#gameClient",
      actions: {
        params: {},
        type: "forwardToServer"
      },
      reenter: false
    },
    "show emoji": {
      actions: {
        params: {},
        type: "showEmoji"
      },
      reenter: true
    }
  }
});
const getUser = (context) => {
  const user = context.users.find((user2) => user2.id === context.userId);
  if (!user)
    throw new Error(`The current user was not found in the users list.`);
  return user;
};
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
      const { side } = getUser(context);
      if (!side)
        return false;
      if (side === "attacker") {
        return !!context.attack.attacker;
      } else {
        return context.defense.defenders.length === 4;
      }
    },
    finishedAssigningRolesOfSide: ({ context }) => {
      const { side } = getUser(context);
      if (!side)
        return false;
      return (side === "attacker" ? context.attack : context.defense).finishedAssigning;
    },
    isEditingPlayerOfSide: ({ context }) => {
      const { side } = getUser(context);
      if (!side)
        return false;
      const editingPlayer = (side === "attacker" ? context.attack : context.defense).editingPlayer;
      return editingPlayer !== void 0;
    },
    isNotEditingPlayerOfSide: not("isEditingPlayerOfSide"),
    userControlsPlayer: () => false,
    userOnActiveSide: () => false,
    userNotOnActiveSide: () => false,
    playerMoved: () => false,
    userIsDefender: () => false,
    isServerStopped: () => false,
    playerPerformedAction: () => false,
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
const css$c = {
  code: ".cursor.svelte-jg3id1.svelte-jg3id1{height:1px;width:1px}.cursor.svelte-jg3id1.svelte-jg3id1,.cursor.svelte-jg3id1 svg.svelte-jg3id1{left:0;position:absolute;top:0}.cursor.svelte-jg3id1 svg.svelte-jg3id1{height:1.5rem;translate:-10% -10%;width:1.5rem}.cursor.svelte-jg3id1 .name.svelte-jg3id1{background:#000;border-radius:var(--radius-sm);display:inline-block;font-size:var(--scale-000);left:1rem;max-width:7rem;overflow:hidden;padding:.25rem .5rem;position:absolute;text-overflow:ellipsis;top:1rem;white-space:nowrap}",
  map: null
};
const Cursor = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { position } = $$props;
  let el;
  if ($$props.position === void 0 && $$bindings.position && position !== void 0)
    $$bindings.position(position);
  $$result.css.add(css$c);
  return `<div class="cursor svelte-jg3id1"${add_attribute("this", el, 0)}><svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2c3e50" fill="white" stroke-linecap="round" stroke-linejoin="round" class="svelte-jg3id1"><path d="M7.904 17.563a1.2 1.2 0 0 0 2.228 .308l2.09 -3.093l4.907 4.907a1.067 1.067 0 0 0 1.509 0l1.047 -1.047a1.067 1.067 0 0 0 0 -1.509l-4.907 -4.907l3.113 -2.09a1.2 1.2 0 0 0 -.309 -2.228l-13.582 -3.904l3.904 13.563z"></path></svg> <span class="name svelte-jg3id1">${escape(position.name)}</span> </div>`;
});
const css$b = {
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
  $$result.css.add(css$b);
  userMousePositions = getMousePositions($users, mousePositions);
  $$unsubscribe_users();
  $$unsubscribe_user();
  return `<div class="cursor-overlays svelte-1n4ax7h">${each(userMousePositions, (position) => {
    return `${validate_component(Cursor, "Cursor").$$render($$result, { position }, {}, {})}`;
  })} </div>`;
});
const css$a = {
  code: ".emojis.svelte-15c2n3p.svelte-15c2n3p{grid-gap:.25rem;display:grid;gap:.25rem;grid-template-columns:repeat(auto-fit,minmax(2rem,1fr));padding:.5rem .75rem}.emoji.svelte-15c2n3p.svelte-15c2n3p{align-content:center;aspect-ratio:1;background:#fafafa;border:none;border-radius:var(--radius-sm);display:grid;font-size:var(--scale-2);justify-content:center;padding:0;place-content:center}.emoji.svelte-15c2n3p.svelte-15c2n3p:hover{background:#f0f0f0}.displayed-emoji.svelte-15c2n3p.svelte-15c2n3p{--_width:4rem;--_height:4rem;align-items:center;background:#fafafa;border:var(--px) solid #ccc;border-radius:var(--radius-full);box-shadow:0 0 30px #dd7;display:flex;flex-direction:column;font-size:3rem;height:4rem;height:var(--_height);justify-content:center;left:calc(var(--_x)*(100% - 4rem));left:calc(var(--_x)*(100% - var(--_width)));line-height:1.1;position:fixed;top:calc(var(--_y)*(100% - 4rem));top:calc(var(--_y)*(100% - var(--_height)));width:4rem;width:var(--_width)}.displayed-emoji.svelte-15c2n3p .name.svelte-15c2n3p{background:#000;bottom:-1em;font-size:.3em;position:absolute}",
  map: null
};
const Emojis = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $users, $$unsubscribe_users;
  const context = getGameContext();
  const users = useSelector(context.machine.service, (state) => state.context.users);
  $$unsubscribe_users = subscribe(users, (value) => $users = value);
  const validEmojis = ["👋", "👍", "👏", "😃", "🧠", "🤔"];
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
  $$result.css.add(css$a);
  $$unsubscribe_users();
  return `<div class="emojis svelte-15c2n3p">${each(Object.entries(emojis), ([i2, emoji]) => {
    return `<div class="displayed-emoji svelte-15c2n3p"${add_styles({
      "--_x": emoji.position[0],
      "--_y": emoji.position[1]
    })}><span class="emjoi">${escape(emoji.emoji)}</span> <span class="name svelte-15c2n3p">${escape(emoji.userName)}</span> </div>`;
  })} ${each(validEmojis, (emoji) => {
    return `<button class="emoji svelte-15c2n3p">${escape(emoji)}</button>`;
  })} </div>`;
});
const css$9 = {
  code: ".actions.svelte-74jyrx{align-items:center;display:flex;gap:1rem;justify-content:flex-end;margin-top:2.5rem}",
  map: null
};
const Actions = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$9);
  return `<div class="actions svelte-74jyrx">${slots.default ? slots.default({}) : ``} </div>`;
});
const css$8 = {
  code: ".heading.svelte-eb948l.svelte-eb948l{align-items:flex-end;display:flex;justify-content:space-between;margin:0 0 1.25rem}.heading.separator.svelte-eb948l.svelte-eb948l{border-bottom:var(--px) solid var(--color-border);padding-bottom:.75rem}.heading.centered.svelte-eb948l.svelte-eb948l{justify-content:center}.heading.svelte-eb948l .h.svelte-eb948l{font-family:var(--font-display);font-weight:500;text-transform:uppercase}.heading.size-md.svelte-eb948l .h.svelte-eb948l{font-size:2.25rem}.heading.size-sm.svelte-eb948l .h.svelte-eb948l{font-size:1.5rem}.heading.svelte-eb948l .info.svelte-eb948l{font-size:var(--scale-00)}",
  map: null
};
const Heading = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$slots = compute_slots(slots);
  let { size = "md" } = $$props;
  let { id = void 0 } = $$props;
  let { separator = false } = $$props;
  let { centered = false } = $$props;
  let { tag = void 0 } = $$props;
  const defaultSizeTags = { xl: "h1", lg: "h2", md: "h3", sm: "h4" };
  if (!tag)
    tag = defaultSizeTags[size];
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  if ($$props.id === void 0 && $$bindings.id && id !== void 0)
    $$bindings.id(id);
  if ($$props.separator === void 0 && $$bindings.separator && separator !== void 0)
    $$bindings.separator(separator);
  if ($$props.centered === void 0 && $$bindings.centered && centered !== void 0)
    $$bindings.centered(centered);
  if ($$props.tag === void 0 && $$bindings.tag && tag !== void 0)
    $$bindings.tag(tag);
  $$result.css.add(css$8);
  return `<div class="${[
    "heading size-" + escape(size, true) + " svelte-eb948l",
    (separator ? "separator" : "") + " " + (centered ? "centered" : "")
  ].join(" ").trim()}">${((tag$1) => {
    return tag$1 ? `<${tag}${add_attribute("id", id, 0)} class="h svelte-eb948l">${is_void(tag$1) ? "" : `${slots.default ? slots.default({}) : ``}`}${is_void(tag$1) ? "" : `</${tag$1}>`}` : "";
  })(tag)} ${$$slots.info ? `<div class="info svelte-eb948l">${slots.info ? slots.info({}) : ``}</div>` : ``} </div>`;
});
const css$7 = {
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
    side: "attacker"
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
  $$result.css.add(css$7);
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
    return `<div class="user">${escape(user2.name)} ${user2.isAdmin ? `<span class="admin" data-svelte-h="svelte-16777ag">(admin)</span>` : ``} ${user2.isSideAssigned ? `<span class="side svelte-1w8krv2">${user2.side === "attacker" ? `Angriff` : `Verteidigung`} </span>` : ``} ${$canAssignSides ? `${validate_component(Button, "Button").$$render($$result, {}, {}, {
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
  })}</div> ${validate_component(Actions, "Actions").$$render($$result, {}, {}, {
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
const css$6 = {
  code: "p.svelte-de2sr5{margin-bottom:1.5rem;margin-top:1.5rem}.size-md.svelte-de2sr5{font-size:var(--scale-1)}.size-lg.svelte-de2sr5{font-size:var(--scale-2)}.size-sm.svelte-de2sr5{font-size:var(--scale-0)}",
  map: null
};
const Paragraph = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { size = "md" } = $$props;
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  $$result.css.add(css$6);
  return `<p class="${"size-" + escape(size, true) + " svelte-de2sr5"}">${slots.default ? slots.default({}) : ``}</p>`;
});
const Face = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { faceId } = $$props;
  if ($$props.faceId === void 0 && $$bindings.faceId && faceId !== void 0)
    $$bindings.faceId(faceId);
  return `${faceId === 0 ? `<svg width="56" height="56" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M7.93 16.86a27.8 27.8 0 0 0 2.5 10.6c.1 0 .2.02.28.04l.02-.1c0-.23.16-.43.4-.47l.17.01c1.8-1.1 1.87-2.48 1.96-4.2.04-.77.09-1.57.3-2.41a.45.45 0 0 1 .5-.34 3.48 3.48 0 0 0 3.11-1.3.46.46 0 0 1 .82.4c.02.01.04.04.07.04.16.02.36-.08.55-.17a12.72 12.72 0 0 0 3.8-3.01c.15-.16.4-.21.58-.1.2.12.27.35.19.57a12.9 12.9 0 0 1-1.7 2.97 14.7 14.7 0 0 0 2.82-1.59 11.57 11.57 0 0 0 2.86-2.4c.36-.46.64-.98.93-1.52l.12-.22c.45-.85.9-1.7 1.61-2.42a.45.45 0 0 1 .77.34 10.33 10.33 0 0 1-1.54 5.03 13.4 13.4 0 0 0 4.36-5.8c.04-.1.12-.19.2-.23l.81-.44a4.91 4.91 0 0 1 3.63-1.4c1.42.09 2.74.9 3.38 2.1.78 1.43.52 3.03.27 4.58a8.82 8.82 0 0 0-.12 3.32c.25 1.11 1 2.08 2 2.6.18.1.27.31.22.52a.45.45 0 0 1-.43.35h-.47l.04.08.22.58v.02c.29.74.48 1.23 1.25 1.69.08.04.13.1.17.16.14.07.24.2.25.38l.01.23c.12 0 .23 0 .34.02.33-1.33.8-2.64 1.26-3.9.85-2.35 1.64-4.57 1.64-6.94 0-3.8-2.31-7.76-6.02-10.34a17.9 17.9 0 0 0-7.67-3A29.8 29.8 0 0 0 31 .93c-3.96-.1-9.1.03-13.68 1.95-4.65 1.94-8.02 5.55-9 9.65a16.6 16.6 0 0 0-.38 4.32Zm38.1 8.89c.3-1.3.77-2.6 1.23-3.86l.04-.1c.84-2.33 1.7-4.72 1.7-7.26 0-4.09-2.46-8.34-6.4-11.09A18.85 18.85 0 0 0 34.52.28c-1.21-.17-2.4-.22-3.5-.25-4.06-.1-9.33.03-14.07 2.02-4.92 2.05-8.5 5.9-9.56 10.27A16.93 16.93 0 0 0 7 16.89c.12 3.66.97 7.35 2.46 10.69-.17.08-.32.2-.45.36-.24.32-.28.71-.3 1.05a20.5 20.5 0 0 0 1.64 9.16c.24.54.53 1.16 1.05 1.63a2.17 2.17 0 0 0 1.74.56 48.72 48.72 0 0 0 3.48 9.12 14.17 14.17 0 0 0 2.08 3.2c2 2.16 5.16 3.34 8.88 3.34.65 0 1.31-.03 1.99-.1 1.6-.17 2.85-.5 3.93-1a10.9 10.9 0 0 0 4.54-4.34 27.91 27.91 0 0 0 2.43-5.69c.73-2.14 1.42-4.32 2.07-6.5l.25.02v.03c.53 0 1.12-.27 1.7-.8a4.9 4.9 0 0 0 1.18-2.1 23.19 23.19 0 0 0 1.36-6.83 4.2 4.2 0 0 0-.4-2.27 2.24 2.24 0 0 0-.6-.67ZM42.8 37.48c.43 0 .95-.44 1.07-.55.48-.43.73-1.1.94-1.72a22.36 22.36 0 0 0 1.3-6.57c.03-.63 0-1.28-.28-1.78-.2-.33-.59-.6-.96-.6.04 3.58-.88 7.08-1.82 10.37l-.25.85Zm-31.94-9a88.3 88.3 0 0 0 2.05 10.96c-.32.02-.66-.14-.89-.35a3.68 3.68 0 0 1-.81-1.31 19.64 19.64 0 0 1-1.58-8.75c0-.2.03-.42.11-.54.18-.22.7-.12 1.1 0h.02Zm31.3 7.9c1.02-3.53 1.98-7.27 1.77-11.04-1.04-.61-1.33-1.36-1.64-2.16a9 9 0 0 0-.52-1.19.48.48 0 0 1 0-.45c.06-.1.15-.18.25-.2a4.91 4.91 0 0 1-1.35-2.4 9.53 9.53 0 0 1 .1-3.65l.01-.03v-.01c.24-1.45.46-2.83-.17-3.99a3.26 3.26 0 0 0-2.64-1.62A3.98 3.98 0 0 0 35 10.83a.43.43 0 0 1-.1.08l-.71.38a14.36 14.36 0 0 1-7.04 7.55c-.2.1-.45.03-.58-.15a.46.46 0 0 1 .06-.6 9.43 9.43 0 0 0 2.8-4.8l-.44.8-.05.08c-.32.6-.66 1.23-1.09 1.8a12.34 12.34 0 0 1-3.08 2.6c-1.47.98-2.92 1.87-4.59 2.1a.46.46 0 0 1-.47-.25.44.44 0 0 1 .09-.52c.41-.42.8-.87 1.15-1.36-.62.47-1.28.88-1.96 1.23a1.8 1.8 0 0 1-1.1.26.93.93 0 0 1-.52-.24 4.35 4.35 0 0 1-3.04 1.14c-.12.63-.16 1.25-.19 1.86-.09 1.76-.2 3.59-2.43 4.96.84 6.66 2.22 14.35 5.75 21.3.5.96 1.12 2.08 1.94 2.98 2.14 2.33 5.81 3.4 10.1 2.95a11.2 11.2 0 0 0 3.63-.91 9.97 9.97 0 0 0 4.15-3.99 27.1 27.1 0 0 0 2.34-5.5c.91-2.7 1.77-5.46 2.56-8.2Zm1.67-21.39c0 .16.14.31.3.31h.02a.3.3 0 0 0 .3-.3c.03-1.16.06-2.47-.17-3.76a6.6 6.6 0 0 0-1.64-3.45c-.88-.92-2.07-1.45-3.12-1.92l-.02-.01a.3.3 0 0 0-.25.56l.02.01c1.05.48 2.13.96 2.93 1.79a6.03 6.03 0 0 1 1.47 3.14c.22 1.21.2 2.5.16 3.63Zm-30.43 3.3c-.62 0-1.21-.12-1.75-.35a.32.32 0 0 1-.18-.32.3.3 0 0 1 .25-.26c2.5-.45 4.5-2.4 5.8-3.82l1.2-1.38a22.3 22.3 0 0 1 3.89-3.87c.95-.7 1.8-.95 2.55-.78.17.04.27.2.23.36a.3.3 0 0 1-.36.23c-.58-.12-1.25.1-2.07.68a21.74 21.74 0 0 0-3.77 3.77c-.4.47-.8.95-1.21 1.4-1.16 1.27-2.85 2.95-5 3.7.98.11 1.89-.17 2.43-.39a14.05 14.05 0 0 0 3.17-2c.1-.08.24-.09.35 0 .1.06.16.19.13.31a4.2 4.2 0 0 1-.95 1.87 4.66 4.66 0 0 0 2.44-1.53c.87-.99 1.44-2.23 1.98-3.43.07-.16.25-.23.4-.16.16.07.23.25.16.4a14.18 14.18 0 0 1-2.07 3.6 4.82 4.82 0 0 1-3.78 1.81c-.13 0-.24-.1-.28-.22-.04-.13 0-.26.12-.33.43-.32.8-.74 1.05-1.21-.77.56-1.58 1.1-2.49 1.45a6 6 0 0 1-2.22.46h-.02Zm-1.87-3.94Zm.25-.13a.3.3 0 0 1-.42.07.3.3 0 0 1-.07-.43c1.2-1.66 2.7-3.73 4.53-5.35 1.4-1.23 3.63-2.75 6.36-2.96a.3.3 0 0 1 .33.28c0 .17-.12.32-.28.33-2.57.2-4.69 1.64-6.02 2.81a31.55 31.55 0 0 0-4.43 5.25Zm21.98-6.08a.3.3 0 0 1-.29-.22 1.8 1.8 0 0 0-1.4-1.28c-.64-.11-1.38.14-2.03.69a.3.3 0 0 1-.42-.04.3.3 0 0 1 .04-.43 3.2 3.2 0 0 1 2.51-.83c.9.16 1.66.85 1.9 1.73a.32.32 0 0 1-.22.38h-.04l-.04.01v-.01Zm.98-.93c.05.03.14.04.14.04l.01-.01c.11 0 .22-.06.28-.17.17-.34.58-.6 1.06-.7.48-.1.99-.05 1.5 0 .16 0 .31-.12.32-.29a.32.32 0 0 0-.28-.33c-.52-.05-1.1-.1-1.67.02-.67.14-1.22.52-1.49 1.02a.31.31 0 0 0 .13.42ZM18.38 26.92a.3.3 0 0 1-.24-.11c-.07-.08-.08-.2-.05-.3 0 0 0-.02.02-.03-.41.1-.83.2-1.26.25a.29.29 0 0 1-.23-.07.29.29 0 0 1-.1-.21v-.07l-1.67.36a.3.3 0 0 1-.36-.23.3.3 0 0 1 .23-.36l2.3-.49a.8.8 0 0 1 .38-.07.3.3 0 0 1 .28.29v.1c.45-.11.9-.25 1.33-.42l.06-.03.06-.02a.3.3 0 0 1 .21.57.33.33 0 0 0-.04.02 4.4 4.4 0 0 0 1.27-.57.3.3 0 0 1 .39.03c.1.1.12.27.04.38l-.06.09c.42.04.84-.1 1.16-.37.08-.14.2-.28.35-.36a.3.3 0 0 1 .37.07c.1.1.1.26.02.38l-.01.02c.17-.03.35-.08.5-.17a.3.3 0 0 1 .27 0c.56.26 1.23.27 1.8.03a.45.45 0 0 1 .48-.28.45.45 0 0 0 .13-.22.3.3 0 0 1-.13-.35.3.3 0 0 1 .38-.2c.19.05.33.2.35.4.05.26-.08.55-.24.74 1.1 1.3 1.5 3.2 1.25 5.81a24.4 24.4 0 0 1-1.7 6.9l-.01.07-.02.04c-.17.42-.33.83-.28 1.2a.7.7 0 0 0 .27.48c.08.06.16.1.23.08.28-.05.46-.52.55-.91a.47.47 0 0 1 .5-.35c.24.03.41.23.4.47 0 .2.11.41.3.58.2.15.43.22.63.17.2-.05.38-.2.49-.42.1-.23.1-.47.02-.65a.46.46 0 0 1 .16-.6c.2-.13.48-.07.61.12.14.19.23.38.32.57l.04.1.26.49c.15.2.39.34.51.27.14-.08.17-.4.08-.84-.13-.65-.28-1.32-.43-1.98l-.05-.24-.05-.2c-.31-1.39-.64-2.83-.8-4.28-.32-2.72-.02-5.04.88-6.9a.75.75 0 0 1 .11-.2 1.6 1.6 0 0 1-.35-.47.3.3 0 0 1 .15-.4.28.28 0 0 1 .4.14c.09.17.22.3.39.41.08 0 .16.02.24.05l.14.1c.16.04.32.03.48-.02.1-.02.2-.07.3-.12l.05-.02.02-.01c.3-.14.62-.28 1-.2a1.55 1.55 0 0 1 .58.3l.06.03c.14.09.25.12.32.1a.3.3 0 0 1-.03-.37.3.3 0 0 1 .42-.09c.42.27.88.45 1.36.55.18.04.3.04.36 0l-.02-.02v-.01a.3.3 0 0 1-.1-.38.3.3 0 0 1 .35-.16c.11.02.2.07.26.15.33.21.73.33 1.13.33h.06a.29.29 0 0 1-.02-.3c.06-.1.18-.18.3-.17.15.02.27.1.35.23.16.13.34.25.5.22l.06-.02.02-.02a.96.96 0 0 1-.1-.4.31.31 0 0 1 .43-.29c.23.1.35.32.34.59.07.05.15.1.24.1.14.01.33-.05.52-.11.3-.11.65-.24 1-.1a.3.3 0 0 1 .17.4.3.3 0 0 1-.4.17c-.14-.06-.34.01-.58.1-.23.09-.49.17-.77.15a.88.88 0 0 1-.45-.15.7.7 0 0 1-.38.18c-.27.03-.5-.05-.7-.16-.2.18-.49.18-.58.18-.37 0-.74-.08-1.08-.23a.53.53 0 0 1-.15.17.84.84 0 0 1-.52.16h-.04a4.77 4.77 0 0 1-1.44-.4.64.64 0 0 1-.32.26c-.25.1-.54.05-.85-.14a1.4 1.4 0 0 1-.12-.09 1 1 0 0 0-.32-.16c-.18-.04-.38.05-.6.15l-.02.01c-.14.07-.28.14-.44.17-.2.07-.42.08-.63.06a.44.44 0 0 1-.29.16c-.82 1.7-1.08 3.86-.8 6.4.18 1.46.52 2.93.84 4.36v.02l.12.48.38 1.77c.23 1.13-.16 1.6-.52 1.81-.6.33-1.28 0-1.66-.48-.23.37-.59.62-.98.72a1.68 1.68 0 0 1-1.57-.52c-.24.32-.52.52-.86.56h-.1l-.08.01-.04-.03a1.2 1.2 0 0 1-.75-.26 1.67 1.67 0 0 1-.62-1.1c-.07-.6.14-1.13.33-1.62l.03-.07.01-.06a23.85 23.85 0 0 0 1.64-6.66c.25-2.42-.13-4.13-1.13-5.22-.67.26-1.43.27-2.1 0-.37.17-.8.23-1.2.17l-.1-.02c-.54.32-1.25.4-1.85.16-.04-.02-.08-.04-.1-.07a5.2 5.2 0 0 1-1.79.5h-.03l-.03-.04Zm-.87 4.01c.45.03.88.03 1.3.03v-.01c1.19 0 2.26-.07 3.27-.21.4-.06.83-.13 1.2-.36.46-.27.74-.76.71-1.22-.04-.6-.54-1.1-1.41-1.37a7.39 7.39 0 0 0-2.21-.34 9.6 9.6 0 0 0-3.5.72c-1.04.41-1.32 1.07-1.24 1.57.12.69.85 1.15 1.88 1.19Zm.97-2.63c-.45.11-.92.27-1.4.46-.59.22-.9.57-.85.89.05.3.49.65 1.31.68l1.02.02a1 1 0 0 1-.23-.28l.01-.01c-.4-.77-.26-1.36.14-1.76Zm2.82 1.93.69-.09c.33-.04.7-.1.97-.28.22-.13.43-.39.42-.65-.03-.47-.7-.73-.99-.82-.32-.1-.65-.18-1-.23a10.6 10.6 0 0 1 .02 1.5c0 .2-.04.4-.11.57Zm15.82.17c-1.2 0-2.13-.06-3-.19-.27-.04-1.14-.17-1.39-.87-.2-.55-.04-.95.12-1.18.51-.74 1.92-1.1 4.4-1.1h.98c.38 0 .85.03 1.3.15a2 2 0 0 1 .96.55c.26.28.4.69.37 1.1-.03.41-.2.79-.5 1.04-.48.42-1.1.47-1.76.48h-.74l-.73.02Zm-3.77-1.9c.21-.3.82-.64 2.45-.77-.3.33-.5.76-.53 1.21a1.16 1.16 0 0 0 .21.8c-.45-.04-.86-.08-1.25-.14-.53-.08-.84-.23-.91-.46-.13-.34-.04-.53.03-.64Zm5.4.06c0-.3 0-.63-.13-.89.24.01.5.05.76.12.29.07.52.2.67.37.15.16.23.4.2.65a.92.92 0 0 1-.28.62c-.33.29-.83.32-1.38.33h-.12c.26-.32.28-.78.29-1.2ZM21.98 44.32c.78.29 1.59.52 2.4.68.16.6.65 1.2 1.37 1.65.27.16.61.29 1.04.39a7.2 7.2 0 0 0 1.53.17v.01a4.5 4.5 0 0 0 3.17-1.18 2.34 2.34 0 0 0 .78-1.34c.63-.18 1.25-.4 1.86-.64a.3.3 0 0 0 .16-.4.3.3 0 0 0-.4-.17c-.54.23-1.1.43-1.68.6-.17-.52-.6-.98-1.18-1.2a2.68 2.68 0 0 0-2.45.36l-.11-.05-.02-.02a3.35 3.35 0 0 0-2.44-.34c-1.3.33-1.6 1.08-1.66 1.5v.03c-.74-.16-1.46-.36-2.17-.62a.3.3 0 0 0-.39.18.3.3 0 0 0 .19.39Zm4.08 1.8c-.46-.29-.8-.64-.98-1a17 17 0 0 0 6.51-.24c-.1.22-.26.45-.52.69-1 .94-2.42 1.23-4.15.85a2.71 2.71 0 0 1-.86-.3Zm4.76-2.67c.4.15.7.45.8.8a16.4 16.4 0 0 1-6.68.23v-.06c.08-.46.51-.82 1.22-1 .21-.04.43-.07.65-.07l.02-.01c.47 0 .95.13 1.33.36a.8.8 0 0 0 .5.14.76.76 0 0 0 .35-.16c.5-.34 1.26-.45 1.8-.23Zm-4.55 6.39a.3.3 0 0 0 .29.22h.07a9.3 9.3 0 0 1 3.43-.28.3.3 0 0 0 .34-.27.3.3 0 0 0-.27-.34 10.07 10.07 0 0 0-3.65.3.3.3 0 0 0-.21.37Z" fill="currentColor"></path></svg>` : `${faceId === 1 ? `<svg width="56" height="57" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="m12.56 9.4-.05.04c0 .05 0 .1-.02.15a27.71 27.71 0 0 0-2.25 12.88h.03c.05 0 .1 0 .14.02.31-.28.7-.97 1-1.54a.25.25 0 0 1-.05-.2c-.32-3.82.1-7.65 1.2-11.36Zm-1.25 1.4.01-.02a28.26 28.26 0 0 0-1.73 11.56 4.7 4.7 0 0 1-1.14-2.33c-.16-1.2.28-2.48.68-3.6v-.02l1.23-3.46.09-.22c.24-.66.48-1.32.86-1.9Zm.64 9.08a4 4 0 0 1 1.03-1.31l.05-.67.05-.74.05-.74c.26-2.93.9-5.83 1.9-8.63-.55.28-1.08.6-1.58.93a30.52 30.52 0 0 0-1.5 11.16Zm1.83-3.42c.28-3.1.99-6.16 2.1-9.1a62.36 62.36 0 0 1 2.3-1.08c-.47 1-.88 2.02-1.2 3.06a40 40 0 0 0-1.5 7.34.33.33 0 0 0-.15.41c-.6.26-1.15.56-1.66.92l.01-.08c.02-.49.06-.98.1-1.47Zm2.36.3c1-.36 2.07-.62 3.12-.81a30.65 30.65 0 0 1 1.88-10.76l-.06.01c-.7.2-1.36.44-2.02.7a26.84 26.84 0 0 0-1.46 3.6 38.78 38.78 0 0 0-1.46 7.27Zm5.41-10.81c.12-.36.26-.72.5-.99l.88-.17c-.58.96-.85 2.07-1.08 3.12a65.61 65.61 0 0 0-1.17 7.8 70.05 70.05 0 0 0-.76.12c-.02-3.35.53-6.67 1.63-9.88Zm-.2 9.65c.66-.1 1.32-.2 1.99-.28a37.8 37.8 0 0 1 1.4-10.76c-.32.02-.64.06-.95.1a8.45 8.45 0 0 0-1.28 3.36c-.54 2.5-.93 5.05-1.16 7.58Zm2.64-.36c-.03-3.61.45-7.22 1.44-10.73.39-.02.78-.03 1.18-.03h.03a24.36 24.36 0 0 0-.89 4.5v.1l-.8 6.06-.96.1Zm1.65-.17c.78-.07 1.56-.14 2.34-.19-.14-3.44.04-6.92.54-10.33l-1.19-.06c-.52 1.51-.73 3.1-.92 4.65l-.77 5.93Zm3-.23.84-.05c.02-3.38-.03-6.8-.14-10.17l-.16-.01c-.5 3.38-.68 6.82-.54 10.23Zm3.06-.12c-.52 0-1.05.02-1.57.04.02-3.34-.02-6.73-.13-10.07.4.05.8.1 1.22.17l1.24 9.84-.3.01h-.46Zm1.7-.02c.6.02 1.24.07 1.9.17-.1-3.22-.84-6.43-1.56-9.54-.64-.14-1.25-.26-1.85-.36l1.2 9.57c.1 0 .18.03.25.08l.07.09Zm-1.66.86h-.03c-3.6.08-7.2.4-10.73.96a7.15 7.15 0 0 0-2.2 2.17l-.09.1c-.34.45-.7.91-1.11 1.33a9.33 9.33 0 0 0 3.82-2.76c.1-.13.28-.16.43-.08.15.07.21.22.14.37a9.2 9.2 0 0 1-2.17 2.8 19.2 19.2 0 0 0 3.23-1.63.37.37 0 0 1 .4.02c.12.08.15.21.1.34l-.23.39.3-.1c.14-.05.41-.13.68-.05.19.06.3.17.4.27a3.44 3.44 0 0 0 .1.1l.05.05c.22.15.68-.07.93-.21 2.1-1.21 4.1-2.58 5.98-4.07Zm-12.12 1.19a11.9 11.9 0 0 0-1.4 1.62c-.7.92-1.36 1.79-2.36 2.27a.28.28 0 0 0-.15.36c.06.14.22.21.39.18a10.7 10.7 0 0 0 3.57-1.47c-.56.54-1.2 1-1.88 1.4-.13.08-.19.23-.12.37.06.1.18.16.3.16l.02.01h.09a20.4 20.4 0 0 0 3.77-1.46c0 .07 0 .14.04.2.08.14.25.2.4.14l1.55-.5a.6.6 0 0 1 .24-.06c.04.01.1.07.14.13l.21.18c.42.29 1 .24 1.7-.17a49.27 49.27 0 0 0 6.6-4.56c1.02 0 2.31.06 3.54.4a11.34 11.34 0 0 1 3.45 1.73A27.72 27.72 0 0 1 43.61 21a.3.3 0 0 0 .18.2 7.35 7.35 0 0 1 1.86 3.56.39.39 0 0 0-.06.2c0 .32-.02.67-.06 1.04l-.02.02a.4.4 0 0 0-.05.52c-.08.62-.2 1.29-.3 1.94l-.02.1a23.33 23.33 0 0 0-.47 3.74c0 1.52 0 3.1-.05 4.64a27.58 27.58 0 0 1-.56 5.25 22.04 22.04 0 0 1-3.9 8.08c-2.23 3.03-4.66 4.66-7.21 4.84-.67.04-1.32 0-2.02-.05l-.21-.02c-.35-.02-.7-.05-1.07-.05-.65-.01-1.3.02-1.94.06l-.23.01c-.78.04-1.53.08-2.28.01-3.18-.28-5.78-2.4-7.39-4.1a21.16 21.16 0 0 1-5.25-9.76 33.32 33.32 0 0 1-.68-5.43 125.8 125.8 0 0 0-.4-4.28l-.09-.97c-.16-1.5-.31-3.04-.43-4.44a.38.38 0 0 0-.03-.34 58.4 58.4 0 0 1-.16-2.46c.65-.35 1.16-1.27 1.77-2.47.23-.49.49-.98.66-1.19 1.47-1.7 4-2.45 6.42-2.9Zm24.75 3.7c.55.6 1.05 1.25 1.45 1.95.68-3.78.35-7.65-.94-11.3a10.9 10.9 0 0 0-1.09-1.38 21.15 21.15 0 0 1 .58 10.72Zm2.19 3.8a5.3 5.3 0 0 0-.28-.88 22.4 22.4 0 0 0 .19-8.9c.78 2.5.88 5.2.92 7.53.01.5.02 1.09-.2 1.58a1.5 1.5 0 0 1-.63.67ZM42.81 8.8h-.01l-.16-.01a.46.46 0 0 1-.38-.4 10.2 10.2 0 0 0-.98-.62 20.61 20.61 0 0 1 1.62 11.24c.31.27.62.56.92.85.65-3.65.32-7.4-1-10.92a.26.26 0 0 1-.01-.14Zm-2.59 8.12a29.11 29.11 0 0 1 2.08 1.58 20.05 20.05 0 0 0-1.94-11.19 17.2 17.2 0 0 0-1.13-.46c.66 3.31 1 6.7 1 10.07ZM38.5 6.6c-.48-.16-.97-.3-1.46-.44a35.04 35.04 0 0 1 1.98 10.02c.18.1.36.2.53.32a51.35 51.35 0 0 0-1.05-9.9Zm-1.91 8.55a9.94 9.94 0 0 0-.63-.16c-.1-3.22-.8-6.4-1.52-9.5.36.1.73.18 1.1.27a.24.24 0 0 0 0 .15c.86 3.1 1.43 6.26 1.69 9.44a9.7 9.7 0 0 0-.64-.2Zm1.33.48a52.23 52.23 0 0 0-1.7-9.7l.04.02a34.7 34.7 0 0 1 2.08 9.87l-.42-.2ZM15.22 3.1c-2.08 1.73-3.12 3.61-2.97 5.35a7.6 7.6 0 0 0-1.8 1.9c-.47.74-.76 1.54-1.03 2.3l-1.23 3.46v.02c-.44 1.21-.92 2.58-.72 3.98.12.8.9 3.02 2.34 3.32.01.52.05 1.1.1 1.7-.56-.22-1.25-.33-1.86.1-.29.2-.51.52-.68.98a6.2 6.2 0 0 0-.3 1.71 27 27 0 0 0 .37 6.86c.17.92.4 1.87.97 2.63a2.77 2.77 0 0 0 2.16 1.16c.2 0 .37-.02.55-.07a22 22 0 0 0 5.94 13.03c2.47 2.64 5.25 4.17 8.04 4.42.9.08 1.8.03 2.67-.02a22.03 22.03 0 0 1 3.06 0c.5.04 1 .07 1.5.07l.03.03c.22 0 .45 0 .67-.02 2.87-.2 5.56-1.97 7.96-5.24a22.61 22.61 0 0 0 4.04-8.38c.27-1.2.41-2.4.49-3.56.17.02.37.04.57.04l.03-.02c.48 0 1.01-.1 1.46-.47.69-.56.86-1.55.98-2.42.36-2.78.67-5.75.3-8.72-.06-.55-.19-1.1-.63-1.43-.26-.2-.6-.28-1-.27h-.27l-.13-.01-.28-.01.02-.36a2.3 2.3 0 0 0 1.5-1.26c.28-.61.28-1.26.28-1.8v-.13c-.04-2.38-.15-5.14-.96-7.74a12.63 12.63 0 0 0-4.06-6.17c.88-4.2-4.35-5.47-8.2-6.4h-.01l-.83-.21A56.3 56.3 0 0 0 23.86.02c-3.02-.17-6.01.89-8.64 3.08Zm19.64-.6c4.38 1.05 7.77 2.12 7.57 4.91a20.65 20.65 0 0 0-5.91-2.32 39 39 0 0 0-9.94-1.49c-2.08 0-4.04.26-5.81.77-1.8.5-3.5 1.3-4.97 2.01-.87.43-1.76.88-2.58 1.4.18-1.72 1.68-3.22 2.65-4.03C17.58 2.33 20.32.69 23.8.9a53.65 53.65 0 0 1 10.76 1.52l.31.08ZM11.03 37.63a117.58 117.58 0 0 0-.53-6.22l-.08-.78v-.1c-.16-1.48-.32-2.97-.43-4.34-.92-.55-1.2-.35-1.3-.28-.15.1-.26.29-.37.57a5.74 5.74 0 0 0-.26 1.5c-.16 2.23-.04 4.48.37 6.68.15.81.35 1.66.81 2.29.38.5 1.07.9 1.65.71l.14-.03Zm34.6.33a.5.5 0 0 0-.06-.08l.03-.9c.05-1.55.05-3.13.05-4.66 0-.99.22-2.27.44-3.52l.01-.1c.14-.76.28-1.53.37-2.26a.58.58 0 0 1 .27-.05c.14.02.3.02.5.02.22 0 .3.04.34.07.2.15.26.67.29.86.35 2.89.04 5.8-.3 8.53-.1.73-.24 1.52-.68 1.9-.32.25-.75.25-1.25.19Zm-18.07 1.7c.33.33.77.52 1.22.52h.1c.43-.03.84-.24 1.13-.57.3.36.7.56 1.15.54.85-.03 1.4-.83 1.42-1.55.03-.58-.21-1.12-.42-1.6l-.05-.1C30.4 33.05 30.3 29 31.87 26c.88.04 1.74-.1 2.57-.25a12.03 12.03 0 0 1 7.08.6c.24.1.53 0 .65-.21.1-.22 0-.48-.24-.58a13.18 13.18 0 0 0-7.69-.66l-.18.03c-.75.12-1.48.24-2.2.2h-.07l-.28.01a.5.5 0 0 0-.4.24c-1.8 3.22-1.78 7.65.07 11.83l.05.09v.01c.2.44.39.85.37 1.26 0 .37-.26.7-.46.7-.25 0-.52-.38-.68-.96a1.28 1.28 0 0 0-.1-.36.51.51 0 0 0-.59-.28.44.44 0 0 0-.36.5c.01.09.03.18.06.26 0 .2-.05.4-.18.56-.13.18-.3.3-.48.3a.68.68 0 0 1-.5-.23.8.8 0 0 1-.23-.73c.06-.23-.1-.46-.36-.51-.27-.06-.53.09-.6.32-.23.81-.49.9-.56.9-.15.02-.37-.2-.43-.48-.08-.35.02-.74.14-1.16v-.05c.66-2.62.92-5.3.77-8-.08-1.33-.33-3-1.59-3.96l-.1-.06-.2-.08a.53.53 0 0 0-.22-.04c-1.04 0-2.04-.23-3.1-.48l-1.32-.29c-1.7-.33-5.04.01-6.42.85-.22.14-.28.41-.13.6.16.2.47.26.7.12 1.11-.68 4.22-.99 5.64-.71l.9.2.37.08c1.04.25 2.1.5 3.23.5l.03.03c.95.76 1.15 2.25 1.2 3.3.16 2.61-.1 5.22-.75 7.76v.06l-.01.02c-.12.45-.25.97-.13 1.48.14.65.74 1.27 1.51 1.2.34-.04.6-.2.8-.39l.05.06.05.05Zm10.1-9.57.4.01c.45 0 2.73-.04 3.26-.99.15-.25.2-.68-.28-1.25-.56-.65-1.68-.98-3.34-.98-1.2 0-2.45.18-3.2.29h-.06c-.5.07-1 .15-1.41.41-.46.28-.8.84-.6 1.36.27.68 1.16.82 1.8.87l3.43.28Zm-1.73-2.54c-.5.05-.97.12-1.31.17h-.09c-.43.07-.82.13-1.12.32-.24.15-.45.44-.35.7.1.27.5.42 1.24.48l1.64.14a.96.96 0 0 1-.18-.37c-.06-.21-.05-.43-.04-.65v-.09c.02-.24.06-.5.21-.7Zm2.33-.09c.05.03.1.07.14.12.14.16.15.37.15.58-.01.43-.1.87-.3 1.28v.01l-.03.06c1.08-.02 2.3-.25 2.53-.67.09-.15 0-.37-.23-.64-.37-.44-1.13-.68-2.26-.74Zm-18.1 2.3c-1.26 0-2.27-.1-3.19-.32-.35-.08-.76-.2-1.08-.44-.39-.3-.6-.7-.53-1.1.08-.51.57-.9 1.43-1.12a9.58 9.58 0 0 1 5.09.08l.08.02c.69.2 1.85.56 2.06 1.3a.9.9 0 0 1-.18.9c-.34.41-.97.58-1.45.6l-.27.02c-.62.03-1.3.06-1.96.06Zm-3.2-2.44a8.63 8.63 0 0 1 1.72-.26.97.97 0 0 0-.17.48v.08c-.05.3-.1.62-.04.92.03.2.11.41.25.58a10.5 10.5 0 0 1-1.58-.25 2.11 2.11 0 0 1-.84-.33c-.23-.15-.34-.37-.3-.56.06-.37.62-.56.96-.66Zm5.13 1.8-1.33.04c.4-.52.45-1.4.12-1.87a1.28 1.28 0 0 0-.08-.1c.3.05.58.12.87.2l.08.04c.49.14 1.5.45 1.63.89a.4.4 0 0 1-.07.42c-.17.2-.55.34-.95.36l-.27.01Zm10.68 16.42a9.21 9.21 0 0 0-1.12-.93 3.4 3.4 0 0 0-1.2-.59 1.74 1.74 0 0 0-1.46.26.89.89 0 0 0-.15.13c-.07.08-.14.15-.2.16-.1.03-.22-.07-.4-.22h-.02l-.01-.02c-.12-.09-.24-.19-.38-.26-.35-.2-.82-.22-1.28-.08a3.7 3.7 0 0 0-.98.52 31.52 31.52 0 0 0-1.04.77c-.7-.19-1.38-.39-2.02-.59-.18-.05-.36.02-.42.18-.06.15.02.32.2.37a25.3 25.3 0 0 0 7.35 1.37h.27a12 12 0 0 0 2.51-.3c.33-.1.64-.25.95-.4l.03-.03.08-.04c.39-.18.74-.35 1.1-.34.18.02.34-.12.34-.28.01-.16-.13-.3-.32-.3a3.35 3.35 0 0 0-1.56.49h-.02l-.25.13Zm-7.49-.08.7-.49c.25-.17.5-.35.79-.43a.98.98 0 0 1 .73.03c.09.05.18.12.28.2l.02.02c.26.2.6.46 1.05.34.22-.07.36-.2.48-.31a.98.98 0 0 1 .1-.1c.2-.17.53-.22.87-.14.36.08.68.29.95.48.3.22.6.46.88.72-.78.2-1.6.23-2.24.24-1.56.04-3.12-.2-4.6-.56Zm3.64 2.34c-1.38 0-2.75-.22-3.84-.6-.17-.07-.25-.24-.18-.4.07-.13.26-.2.43-.15 1.03.38 2.33.56 3.65.57 1.32 0 2.6-.21 3.62-.6.16-.06.36 0 .43.16.07.14 0 .32-.18.38-1.1.41-2.46.64-3.87.64h-.06Zm3.37 2.42a.3.3 0 0 0 .22.08v-.01c.09 0 .17-.03.24-.1a.26.26 0 0 0-.01-.4c-.37-.3-.82-.45-1.25-.57-2.2-.61-4.62-.6-6.8.06-.21.06-.42.27-.4.5 0 .16.13.28.32.31.17.03.35-.07.38-.22v-.07c2.02-.57 4.27-.58 6.3-.03.36.1.73.23 1 .45Zm-2.35 2.34s-.08 0-.12-.02a4.65 4.65 0 0 0-2.44-.2c-.18.04-.35-.06-.39-.22-.03-.16.07-.31.26-.34a5.4 5.4 0 0 1 2.82.22c.17.07.25.23.18.39a.33.33 0 0 1-.3.17ZM25.2 18.38a.36.36 0 0 1-.24-.1.27.27 0 0 1 .02-.4l1.67-1.34c.14-.1.34-.1.47.02.11.13.1.3-.03.42l-1.67 1.33a.33.33 0 0 1-.22.07ZM18.8 2.56c.38.61 1.2.83 1.84.83h-.01.02c.5 0 .97-.1 1.42-.21l.46-.1a9.03 9.03 0 0 1 3.12-.06c.18.02.35-.09.38-.24.04-.17-.1-.31-.27-.34a9.75 9.75 0 0 0-3.37.07l-.23.05-.24.05c-.44.1-.85.2-1.27.2-.43 0-1.04-.13-1.29-.53a.33.33 0 0 0-.44-.11.27.27 0 0 0-.13.4Z" fill="currentColor"></path></svg>` : `${faceId === 2 ? `<svg width="56" height="56" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M30.8 14.48c.08.12.22.2.36.2.06 0 .12-.02.17-.04.23-.11.3-.36.32-.46a10.33 10.33 0 0 1 2.79-4.8c1.32-1.36 2.9-2.5 4.42-3.59h.01a.3.3 0 0 0 .1-.4.3.3 0 0 0-.4-.15c-2.76 1.14-5.85 2.42-8.15 4.65.56-1.3 1.6-2.4 2.9-3a.3.3 0 0 0 .15-.4.31.31 0 0 0-.39-.18 13.15 13.15 0 0 0-6.76 5.2c.4-2.2 1.69-4.41 3.69-6.24 2.2-2.01 4.92-3.37 7.54-4.69A.3.3 0 0 0 37.4 0c-2.92.14-5.46 1.8-8.01 3.65h-.02c-1.5 1.1-3.37 2.45-4.72 4.19-1.48 1.91-2.12 4.12-1.77 6.07a.3.3 0 0 0 .36.25c.17-.03.28-.2.25-.36-.33-1.78.27-3.81 1.64-5.59 1.2-1.55 2.73-2.7 4.61-4.05 1.87-1.35 3.72-2.59 5.7-3.18a26.89 26.89 0 0 0-5.85 3.85c-2.53 2.32-4 5.26-4 8.05a.31.31 0 0 0 .58.14 12.52 12.52 0 0 1 4.7-5 6.45 6.45 0 0 0-1.43 3.02c-.02.13.05.27.18.33a.3.3 0 0 0 .36-.09c1.68-2.04 4.05-3.36 6.41-4.43-.83.66-1.65 1.35-2.39 2.12a11.02 11.02 0 0 0-2.92 4.94.3.3 0 0 0-.24.09.38.38 0 0 0-.04.5Zm-3.15 41.15c.56.06 1.14.12 1.71.12.72 0 1.45-.09 2.14-.38 1.11-.47 1.95-1.4 2.63-2.14 2.3-2.54 4.48-5.05 6-7.95.33-.64.63-1.3.9-1.96.13.47.43.81.89.98.77.29 1.9.04 2.47-.55.82-.86 1.1-2.07 1.26-3.15l.07-.48.03-.2c.18-1.29.37-2.61.98-3.73.34-.61.8-1.16 1.3-1.74.74-.9 1.5-1.8 1.83-3a3.46 3.46 0 0 0-1.68-4.1v.01a2.8 2.8 0 0 0-.94-.28c.73-3.48 1.03-7.05.9-10.6-.17-4.69-1.32-7.97-3.53-10.05a.46.46 0 1 0-.64.67c2.02 1.9 3.09 4.99 3.25 9.41.12 3.55-.19 7.11-.93 10.59a3.2 3.2 0 0 0-.66.17 4.13 4.13 0 0 0-1.09-2.5c-.28-.3-.6-.53-.9-.76l-.02-.01a4.14 4.14 0 0 1-.99-.91 3.6 3.6 0 0 1-.47-1.2l-.17-.77-.02-.07-.03-.15v-.03c-.33-1.46-.66-2.97-1.7-4.13-1.66-1.86-4.4-1.95-6.4-1.42-1.49.39-2.86 1.1-4.18 1.79l-.06.03c-.55.28-1.1.57-1.66.83-2.33 1.1-4.25 1.39-5.85.9-2.06-.64-3.65-2.75-3.88-5.14-.21-2.13.6-4.49 2.2-6.47 1.27-1.58 3.05-3 5.6-4.44C27.7 1.86 29.71.9 31.83.96h.01a.46.46 0 0 0 .02-.93c-2.34-.08-4.5.96-6.32 1.98-1.67.95-4.09 2.47-5.87 4.67a10.09 10.09 0 0 0-2.4 7.14c.07.6.2 1.2.4 1.75l-.07.01c-3 .75-5.48 3.55-6.3 7.13-.33 1.44-.4 2.9-.33 4.33-.39-.18-.8-.28-1.22-.31-.27-1.5-1.08-2.77-1.87-4.01l-.02-.04a15.08 15.08 0 0 1-1.44-2.64 9.2 9.2 0 0 1 .33-6.8 17.4 17.4 0 0 1 4.22-5.69.46.46 0 1 0-.63-.67 18.1 18.1 0 0 0-4.44 6 10.13 10.13 0 0 0-.35 7.5c.4 1 .98 1.93 1.55 2.83.75 1.19 1.47 2.32 1.72 3.59a3.42 3.42 0 0 0-.66.23 3.46 3.46 0 0 0-1.67 4.1 8.03 8.03 0 0 0 1.83 2.98c.49.58.95 1.13 1.29 1.75.61 1.11.8 2.44.98 3.72 0 .07.02.14.03.2l.07.5c.16 1.06.44 2.28 1.26 3.13.57.6 1.7.85 2.47.56.36-.14.63-.37.78-.7a58.42 58.42 0 0 0 4.66 9.14c.45.7.9 1.37 1.6 1.84.68.46 1.47.64 2.3.79 1.28.23 2.59.43 3.88.59Zm18.01-27.47a13.55 13.55 0 0 1-.75 3.6l-2.3 7.1a78 78 0 0 1-1.15 3.39c.18 0 .3.16.3.37-.01.4.17.67.52.8.56.22 1.37.01 1.66-.3.6-.6.8-1.6.94-2.49a48 48 0 0 0 .1-.68c.2-1.38.4-2.82 1.12-4.13.4-.72.91-1.34 1.42-1.94a7.03 7.03 0 0 0 1.59-2.52 2.67 2.67 0 0 0-1.77-3.3 2.66 2.66 0 0 0-1.68.1ZM11 27.97l.05.03c.15 1.47.44 2.91.75 4.32a70.86 70.86 0 0 0 2.9 9.67.38.38 0 0 0-.1.3c0 .4-.18.67-.53.8-.56.21-1.36.01-1.66-.3-.59-.61-.8-1.6-.94-2.5l-.1-.67a11.6 11.6 0 0 0-1.11-4.13c-.4-.72-.92-1.34-1.42-1.94l-.01-.01a7.03 7.03 0 0 1-1.59-2.52 2.67 2.67 0 0 1 1.77-3.3 2.66 2.66 0 0 1 1.99.25Zm6.83-11.48a.46.46 0 0 0 .2-.11 6.52 6.52 0 0 0 3.79 3.37c1.83.57 3.97.26 6.52-.94.53-.24 1.05-.51 1.56-.78l.2-.1c1.33-.7 2.6-1.35 3.98-1.72 1.66-.43 4.1-.4 5.48 1.15.88.98 1.17 2.3 1.48 3.72v.02l.23 1c.13.52.29 1.05.6 1.51.33.48.77.81 1.2 1.13l.02.01c.29.21.56.42.79.66 1.4 1.47.82 4.02.16 6.07l-2.3 7.09-.02.06a40.32 40.32 0 0 1-2.4 6.22c-1.47 2.8-3.53 5.17-5.86 7.75l-.02.02a7.04 7.04 0 0 1-2.29 1.9c-1.02.43-2.23.33-3.39.2a64.67 64.67 0 0 1-3.82-.6 5.17 5.17 0 0 1-1.96-.64 5.08 5.08 0 0 1-1.32-1.56 63.12 63.12 0 0 1-7.95-19.8c-.67-2.98-1.2-6.15-.5-9.2.75-3.24 2.95-5.77 5.62-6.43Zm18.67-1.72a.61.61 0 0 1-.4-.13.52.52 0 0 1-.09-.67.47.47 0 0 1 .52-.2 11.77 11.77 0 0 0 3.74-7.1l.1-.98.01-.1v-.02c.1-.98.19-1.98.55-2.89-.44.06-.9.08-1.35.06-.99-.05-1.66-.46-1.87-1.12a.47.47 0 0 1 .3-.57c.25-.08.51.06.59.3.1.3.6.44 1.03.46a6.5 6.5 0 0 0 2.06-.23c.19-.05.4.01.5.18.12.16.12.37 0 .53-.65.93-.76 2.11-.88 3.36v.08l-.12 1.06a12.76 12.76 0 0 1-4.2 7.82.8.8 0 0 1-.48.17Zm3.89 1.4c.05.04.11.06.18.06.1 0 .19-.04.25-.13a13.09 13.09 0 0 0 2.34-9.24c-.04-.49-.08-1-.08-1.49a.3.3 0 0 0-.62 0c0 .52.04 1.04.1 1.54l.06.94c.15 2.8-.67 5.6-2.3 7.9a.3.3 0 0 0 .07.42Zm3.69 7.76a.3.3 0 0 0 .22.1c.08 0 .16-.04.22-.1a9.35 9.35 0 0 0 2.21-3.63.3.3 0 0 0-.2-.4.3.3 0 0 0-.38.2 8.73 8.73 0 0 1-2.07 3.4.3.3 0 0 0 0 .43Zm-1.55-1.68a.3.3 0 0 1-.2-.07.31.31 0 0 1-.04-.43 15.76 15.76 0 0 0 3.55-8.94.3.3 0 0 1 .33-.29c.17.01.3.16.29.33a16.36 16.36 0 0 1-3.69 9.3.31.31 0 0 1-.24.1Zm.26-5.88a.31.31 0 0 0 .42-.14 13.32 13.32 0 0 0 1.25-3.89.3.3 0 1 0-.61-.1 12.7 12.7 0 0 1-1.2 3.71.3.3 0 0 0 .14.42ZM11.25 20.1a.46.46 0 0 1-.43-.29c-1.25-2.94-1.64-5.67-1.15-8.12.64-3.21 2.9-6.18 6.21-8.13 2.54-1.5 5.67-2.45 9.83-3 .25-.03.49.15.52.4a.46.46 0 0 1-.4.53c-4.03.52-7.05 1.43-9.47 2.87-3.09 1.82-5.2 4.56-5.79 7.51-.44 2.26-.08 4.8 1.1 7.58a.46.46 0 0 1-.42.64Zm1.4-6c.03.13.16.23.3.23a.3.3 0 0 0 .3-.39c-.51-1.99.14-4.32 1.74-6.23.7-.82 1.51-1.53 2.39-2.16a8.31 8.31 0 0 0-1.73 3.4c-.2.86-.23 1.73-.11 2.6a.3.3 0 0 0 .6-.09c-.1-.8-.06-1.59.11-2.37.48-2.1 2-4.03 4.28-5.45a.3.3 0 0 0-.31-.53c-2.05 1.1-4.16 2.36-5.7 4.2-1.73 2.07-2.43 4.6-1.87 6.79Zm-2.9 8.59c.06.07.14.1.23.1a.3.3 0 0 0 .2-.07.3.3 0 0 0 .03-.43c-1.37-1.59-2.6-3.16-2.66-4.98a.3.3 0 0 0-.31-.3.3.3 0 0 0-.3.31c.06 2.03 1.36 3.7 2.8 5.37Zm13.91 4.54a.6.6 0 0 1-.29-.08.72.72 0 0 1-.19-.19l-.02-.02a19 19 0 0 1-.46.2.9.9 0 0 1-.8-.16c-.1-.08-.2-.19-.27-.3a1.8 1.8 0 0 1-.77.3 1.04 1.04 0 0 1-.92-.44c-.3.22-.66.46-1.1.31a.78.78 0 0 1-.42-.36 1.9 1.9 0 0 1-1.2.4.3.3 0 0 1-.29-.37l.05-.2-1.28.4a.3.3 0 0 1-.38-.21.31.31 0 0 1 .2-.4l1.9-.56a.3.3 0 0 1 .33.1c.08.1.1.23.03.34l-.1.2c.26-.1.52-.3.79-.5a.31.31 0 0 1 .37 0 .3.3 0 0 1 .1.36.16.16 0 0 0 .02.13c.02.04.06.08.1.09.14.05.32-.08.58-.27l.04-.03.27-.2a.3.3 0 0 1 .47.31c0 .05.01.1.06.14.08.09.21.15.33.14.27-.02.52-.21.8-.44a.3.3 0 0 1 .32-.03c.1.05.18.16.18.28 0 .1.06.24.17.32.04.03.14.1.25.06l.18-.08c.2-.1.5-.24.8-.04a.74.74 0 0 1 .18.17l.02-.02c.04-.08.03-.21.02-.33v-.01a.3.3 0 0 1 .62-.04v.01c.01.19.02.43-.1.66a.7.7 0 0 1-.43.34.6.6 0 0 1-.15.02Zm7.6-.22c.13.04.27.07.4.07.36 0 .76-.16 1.16-.47a10.04 10.04 0 0 0 .51-.4l-.04.18c-.03.09 0 .18.05.26a.3.3 0 0 0 .23.12 3.4 3.4 0 0 0 1.8-.4.55.55 0 0 0 .42.54c.3.08.68-.07.89-.27l.06-.06c.14-.13.32-.31.41-.28l.05.02.02.02.1.05c.27.13.55.1.79.03 0 .03.02.06.04.08.15.27.42.4.69.35a1.09 1.09 0 0 0 .42-.21l.11-.06.1.05.05.03c.46.27 1.08.25 1.52-.04a.3.3 0 0 0 .1-.43.3.3 0 0 0-.43-.09.86.86 0 0 1-.87.03l-.05-.03a.8.8 0 0 0-.34-.14c-.24-.03-.43.1-.56.19l-.03.01c-.05.04-.1.08-.13.08s-.07-.08-.07-.1a.3.3 0 0 0-.37-.47c-.25.13-.53.25-.7.17l-.03-.02-.03-.02a1.13 1.13 0 0 0-.18-.09c-.45-.16-.8.19-1.04.42l-.07.06a.46.46 0 0 1-.26.12l.02-.08v-.02l.01-.01v-.01c.05-.16.13-.4-.03-.62a.3.3 0 0 0-.45-.06c-.43.36-.98.59-1.54.64l.1-.43c.03-.1 0-.22-.07-.3a.31.31 0 0 0-.29-.08c-.43.1-.77.37-1.07.62l-.2.16c-.13.09-.3.2-.47.27a.3.3 0 0 0-.18-.4c-.23-.1-.5 0-.66.22a.58.58 0 0 0-.03.7.3.3 0 0 0 .14.1Zm-5.72 14.68a1.97 1.97 0 0 1-1.9-1.77 3.2 3.2 0 0 1 .37-1.48c1.34-2.84 2.1-7.26.82-10.72a.46.46 0 1 1 .87-.32c1.21 3.26.88 7.75-.85 11.43-.16.35-.3.71-.29 1.05.01.25.25.63.62.8.32.15.64.1.94-.14a.47.47 0 0 1 .52-.04c.49.28 1.17.23 1.62-.1a.46.46 0 0 1 .55 0c.21.15.7.23 1.02.1.16-.06.2-.15.21-.23.02-.08 0-.2-.03-.32a49.6 49.6 0 0 1-.52-3.44v-.05c-.1-.77-.2-1.56-.33-2.33-.32-1.98-.3-4.8.7-6.78a.45.45 0 0 1 .62-.2c.23.12.32.4.2.62-.9 1.78-.9 4.37-.6 6.21a69 69 0 0 1 .32 2.36c.14 1.13.29 2.3.52 3.43.03.18.08.4.04.65a1.2 1.2 0 0 1-.78.94 2.2 2.2 0 0 1-1.63-.05 2.5 2.5 0 0 1-2.1.13c-.29.17-.6.26-.91.26Zm-3.96 5.35a4.73 4.73 0 0 0 2.62-.36c.57.52 1.34.63 2.08.63l.54-.02c1.43-.07 2.87-.17 4.3-.31a.3.3 0 0 0 .27-.3c.33.04.66.03 1-.01a.3.3 0 0 0 .26-.35.3.3 0 0 0-.35-.26 3.75 3.75 0 0 1-3.23-1.22.3.3 0 0 0-.4-.05c-.2.13-.36.3-.52.45-.13.13-.26.26-.4.35-.22.15-.55.2-.68.05a.72.72 0 0 1-.06-.11l-.02-.04v-.01a1.22 1.22 0 0 0-.17-.26c-.3-.36-.83-.37-1.19-.21-.26.1-.46.28-.66.44l-.07.07-.07.05a4.06 4.06 0 0 1-3.15.86.3.3 0 0 0-.36.26.3.3 0 0 0 .26.35Zm8.75-.6a4.32 4.32 0 0 1-1.53-.97l-.21.2c-.15.15-.3.3-.5.43-.45.32-1.14.38-1.5-.07a1.23 1.23 0 0 1-.16-.27v-.01a.64.64 0 0 0-.09-.13c-.09-.12-.31-.11-.47-.04-.17.07-.32.2-.49.34h-.01c-.05.05-.1.1-.15.13a3.1 3.1 0 0 1-.43.31c.54.35 1.31.35 2 .32 1.18-.06 2.36-.14 3.54-.25Zm-3.16 2.3a8.1 8.1 0 0 1-2.81-.5.3.3 0 1 1 .21-.58c1.82.67 3.88.6 5.66-.18a.3.3 0 0 1 .4.16.3.3 0 0 1-.15.4 8.18 8.18 0 0 1-3.3.7h-.01Zm-9.44-16.67 2.92.03a2.7 2.7 0 0 0 1.6-.37c.34-.24.57-.67.57-1.09a.98.98 0 0 0-.37-.82 1.59 1.59 0 0 0-.86-.26 30.68 30.68 0 0 0-4.29-.08c-.61.04-1.4.47-1.58 1.08-.07.24-.1.7.48 1.15.47.35 1.08.36 1.53.36Zm-.4-1.97c.38-.02.76-.04 1.14-.04-.32.35-.48.97-.34 1.4h-.4c-.47-.01-.88-.03-1.17-.25-.32-.24-.27-.42-.25-.48.09-.3.6-.6 1.02-.63Zm4.2.07a28.7 28.7 0 0 0-1.37-.09 1.35 1.35 0 0 1 .18 1.4h.3c.53 0 .94-.04 1.25-.26a.8.8 0 0 0 .3-.6c0-.1-.01-.23-.12-.32a1.05 1.05 0 0 0-.54-.13Zm11.81 1.55c.47.33 1.04.37 1.59.37l2.93-.03c.45 0 1.06-.02 1.53-.37.59-.44.55-.91.48-1.15-.19-.6-.97-1.04-1.58-1.07a30.7 30.7 0 0 0-4.29.08c-.23.02-.58.05-.86.26a.99.99 0 0 0-.37.82c.01.43.23.85.57 1.09Zm.72-1.56 1.37-.1c-.09.1-.15.22-.2.33-.14.35-.13.75.03 1.08h-.34c-.51 0-.91-.04-1.22-.26a.79.79 0 0 1-.31-.59c0-.1.02-.24.13-.32.12-.1.32-.12.54-.14Zm3.4 1.28a1.58 1.58 0 0 0-.33-1.4l1.13.04c.42.02.93.34 1.02.64.01.06.07.23-.26.47-.29.22-.7.24-1.17.25h-.4Z" fill="currentColor"></path></svg>` : `${faceId === 3 ? `<svg width="56" height="56" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M45.76 20.15c.65 2.2.01 5.2-2.05 6.79.63.17 1.2.58 1.55 1.12.55.85.59 1.86.55 2.83-.12 3.15-.8 6.27-1.5 9.19-1.38 5.9-3.52 11.72-9.68 14.41A18.49 18.49 0 0 1 27.42 56c-2.4 0-5.83-.51-8.5-2.94-.75-.68-1.67-1.51-2.44-2.42-2.55-2.99-3.58-6.7-4.49-10.56a48.47 48.47 0 0 1-1.5-9.2c-.02-.9 0-1.83.45-2.64a.37.37 0 0 1-.04-.14 9.45 9.45 0 0 0-.42-1.95c-.13-.4-.3-.8-.45-1.2l-.06-.14v-.02c-.19-.43-.37-.87-.52-1.32a5.28 5.28 0 0 1-.24-3c.03-.13.07-.28.15-.42l-.1-.01a.38.38 0 0 1-.24-.24c-.06-.16.02-.33.1-.43.22-.29.71-.58 1.77-.37a36.97 36.97 0 0 1-.32-5.49c.09-3.3.84-6.17 2.24-8.52a9.3 9.3 0 0 1 2.1-2.52c.99-.8 2.2-1.38 3.7-1.76 1.7-.44 3.5-.57 5.05-.63l1.19-.04c4.23-.12 8.51.04 12.72.46 1.35.14 2.67.31 3.85.9a6.77 6.77 0 0 1 3.45 4.54c.44 1.77.3 3.59.13 5.45-.2 2.15-.51 4.59-.88 7.1.46-.05 1.03.16 1.18.63.03.1 0 .19-.06.25.22.16.4.4.52.78Zm-3.34 7.7a3.33 3.33 0 0 0-.86 1.23l-.03.07a8.96 8.96 0 0 1-1.22 1.92c1.89 3.3 2.13 5.55 2.44 8.38.07.68.15 1.4.26 2.2.15-.59.3-1.17.43-1.75a47.94 47.94 0 0 0 1.48-9.04c.02-.79.02-1.69-.43-2.38-.4-.63-1.31-1-1.9-.72l-.17.1Zm-2.7 3.81.16-.14c1.73 3.08 1.96 5.15 2.27 7.97v.12c.12 1.02.24 2.15.46 3.44a20.11 20.11 0 0 1-3.38 6.9c-.19-3.7-.82-7.37-1.88-10.94-.1-.3-.23-.7-.46-1.04.64-.37 1.08-.98.89-1.64a1.92 1.92 0 0 0-.8-.95 10.42 10.42 0 0 0-4.97-1.88h-.08c-.8-.1-1.72-.19-1.94-.72-.14-.35.12-.78.46-.98a2.5 2.5 0 0 1 1.43-.3H32a6.88 6.88 0 0 1 2.61.63l.07.02.06.03c.55.23 1.12.47 1.76.55 1.09.12 2.3-.28 3.23-1.07ZM38.66 50.6a46.5 46.5 0 0 0-1.9-11.46 3.21 3.21 0 0 0-.41-.94l-.04.01-.02.01h-.02c-.26.08-.53.13-.79.17h-.04l-.02.01c-.42.08-.81.14-1.13.32-.19.1-.36.25-.55.4l-.01.02c-.32.26-.67.56-1.16.68l-.15.03c.8 5.62.92 8.29.88 14.27a12.94 12.94 0 0 0 5.36-3.52Zm-10.5-11.88a8 8 0 0 0 3.65 1.15c.82 5.69.93 8.34.88 14.46a17.45 17.45 0 0 1-6.93.75c.17-2.06.37-4.86.56-7.6l.02-.28c.2-2.81.41-5.72.58-7.85.48-.18.92-.4 1.24-.63Zm-3 16.28c.17-2.03.36-4.77.55-7.46l.03-.38.56-7.6c-.7.2-1.4.32-1.96.32-.23 0-.42-.02-.59-.06a3.15 3.15 0 0 1-1.16-.68l-.01-.01a7.93 7.93 0 0 0-.24-.2l-.08.46c-.6 3.61-1.6 9.62-1.36 14.09 1.38.86 2.88 1.3 4.26 1.52Zm-4.28-16.6c.32.06.63.1.9.2l-.12.7v.02c-.58 3.51-1.53 9.27-1.39 13.74a25.96 25.96 0 0 1-3.08-2.93c-.67-.8-1.24-1.66-1.73-2.57l-.13-1.82c-.4-5.23-.73-9.4 1.63-13.8.87.6 1.92.9 2.87.78a6.3 6.3 0 0 0 1.76-.55l.07-.03.56-.23a6.82 6.82 0 0 1 2.11-.41h.21c.57 0 1 .09 1.33.29.34.2.6.63.46.98-.22.53-1.13.63-1.95.71l-.07.01c-1.8.19-3.56.85-4.97 1.88-.33.23-.68.53-.8.95-.24.86.57 1.64 1.5 1.9.27.08.54.13.8.17h.04Zm-6.13 7.66-.02-.28c-.42-5.37-.74-9.64 1.76-14.22a7.86 7.86 0 0 1-1.7-2.42l-.03-.07c-.26-.54-.53-1.1-1.02-1.32a1.1 1.1 0 0 0-.47-.1 1.47 1.47 0 0 0-.43.07c-.4.12-.78.4-1 .75-.46.7-.47 1.6-.44 2.38.12 3.09.8 6.16 1.48 9.04a37.8 37.8 0 0 0 1.87 6.17ZM12.74 24.8c.14.67.28 1.35.4 2.06h.13c.31 0 .6.05.88.18.77.35 1.12 1.07 1.44 1.71v.01l.03.06c.34.7.84 1.6 1.6 2.25.73.63 1.67.94 2.5.85.5-.06.98-.27 1.49-.48l.1-.04c.19-.08.38-.17.57-.23a7.85 7.85 0 0 1 2.66-.49c.75 0 1.35.15 1.83.43.73.45 1.08 1.29.8 1.96-.4 1-1.73 1.14-2.7 1.24h-.06A9.44 9.44 0 0 0 19.9 36c-.22.17-.43.34-.48.53-.1.36.39.77.9.91.22.07.46.1.72.15.49.08 1 .17 1.46.43.26.14.48.32.69.5h.01c.26.23.51.43.79.5.06.02.17.04.35.04 1.11 0 3.05-.65 3.45-1.16a.48.48 0 0 1 .73 0c.4.5 2.34 1.16 3.46 1.16.18 0 .28-.02.34-.04.28-.07.54-.28.8-.5.21-.18.43-.36.7-.5.45-.25.95-.34 1.42-.42h.03l.73-.16c.5-.14 1-.55.9-.91-.06-.2-.26-.36-.48-.52a9.5 9.5 0 0 0-4.51-1.7l-.07-.01c-.97-.1-2.29-.24-2.7-1.24-.27-.67.07-1.51.8-1.96a3.45 3.45 0 0 1 1.84-.43l.24.01a7.85 7.85 0 0 1 3.1.75c.5.22.98.42 1.48.48.82.1 1.76-.23 2.5-.85a6.91 6.91 0 0 0 1.6-2.25l.02-.06c.24-.48.5-1.02.95-1.4a175 175 0 0 0 1.37-7.81l-1.27.73-.34.19-.48.27-1.31.75.02.21c.08 1.4-1.03 2.6-2.88 3.15-.7.2-1.39.3-2.05.3-2.74 0-4.5-1.76-4.6-3.47 0-.1-.01-.19 0-.28l-.03-.02-.05-.03c.03.6.11 1.21.23 1.8.1.46.21.92.33 1.37l.03.12c.35 1.34.72 2.72.49 4.12-.13.8-.6 1.34-1.24 1.39-.2.01-.46-.01-.74-.18l-.11.25a1.49 1.49 0 0 1-1.25.7v-.01c-.26 0-.5-.08-.7-.23a1.3 1.3 0 0 1-.45-.72c-.36.32-.9.5-1.4.32-.63-.23-.91-.85-.81-1.76.11-1.02.37-2.03.63-3l.02-.09.02-.1c.14-.52.28-1.07.4-1.6.24-1.14.32-2.12.23-2.97-.23.1-.45.23-.66.4.05.18.08.36.09.54.08 1.4-1.03 2.6-2.88 3.15-.7.2-1.39.3-2.05.3-2.64 0-4.37-1.64-4.58-3.3a10.39 10.39 0 0 0-3.38-1.89l-.3.32.25 1.77v.04c.13.89.31 1.74.49 2.58l.03.13Zm-.92.02c.15.73.3 1.48.43 2.25a2.9 2.9 0 0 0-.54.31c-.08-.49-.2-.98-.36-1.45-.15-.47-.34-.93-.53-1.38v-.01c-.18-.43-.36-.86-.5-1.3a4.57 4.57 0 0 1-.23-2.58c.02-.09.05-.2.1-.26.02-.02.07-.08.22-.1a.98.98 0 0 1 .68.26l.24 1.64c.12.85.29 1.67.45 2.46l.04.16Zm-1.49-5.33c-.26-.01-.53.02-.7.17l.04.07c.18-.14.4-.22.66-.24Zm34.55.88c.62 2.08-.1 4.96-2.13 6.2.41-2.1.8-4.35 1.14-6.57l.14-.02c.5-.06.73-.05.85.39Zm-.25-1.21a2.43 2.43 0 0 0-.6 0v-.1l.14-.03c.16-.01.35.03.46.13Zm-1.48-.32-.15.08L41.1 20l-1.6.92c-.5-1.37-2.11-2.62-4.64-2.62-.27 0-.55.02-.84.05-2.37.25-3.48 1.34-3.8 2.44a7.63 7.63 0 0 0-.18-.1v-.42c.03-.48.08-.97.32-1.36.61-1.01 2.28-1.15 3.67-1.16l4.66-.03c.16.19.43.22.63.16.24-.08.37-.3.33-.52-.04-.22-.25-.46-.72-.46l-4.9.03c-1.64 0-3.63.2-4.47 1.59-.33.54-.4 1.14-.41 1.72v.06a5.64 5.64 0 0 0-2.62-.34c-.08-.39-.2-.76-.35-1.1a2.4 2.4 0 0 0-.67-.96c-.62-.5-1.5-.51-2.1-.52l-8.18-.09c-.26 0-.46.18-.46.4 0 .23.2.42.45.42l8.18.1c.6 0 1.16.03 1.5.3.21.17.34.43.43.64.14.32.25.66.32 1.03-.28.1-.54.24-.79.42-.62-1.24-2.17-2.3-4.5-2.3-.27 0-.55.02-.84.05-2.6.27-3.68 1.56-3.87 2.77a11.07 11.07 0 0 0-3.01-1.62c1.09-1.46 1.6-3.2 2.06-4.77l.45-1.46c.1-.3.21-.6.4-.81.24-.27.66-.44 1.32-.53a17.5 17.5 0 0 1 2.36-.14h.05c.6 0 1.23-.02 1.85-.07 1.22-.1 2.85-.45 3.9-1.5 2.28.6 4.66.2 6.98-.21l.45-.08c.2-.03.41-.07.57-.03.17.03.34.15.53.28l.15.11c.96.65 2.2.91 3.38.73a10.36 10.36 0 0 1 2.01 3.8c.16.51.33 1.06.67 1.55.58.83 2.02 1.47 3.44 2l-.06.46Zm-1.27-1.93a3.8 3.8 0 0 1-1.35-.97c-.22-.33-.36-.7-.48-1.1a38.4 38.4 0 0 0 3.68-5.58c.18-.36.36-.72.52-1.08.03 1.02-.06 2.08-.16 3.15-.1.98-.21 2.02-.34 3.1l-.48.73a6.7 6.7 0 0 1-1.39 1.75Zm1.7-1.13a6.7 6.7 0 0 1-1.14 1.4l.9.36.24-1.76Zm.55-8.91c-.25.7-.57 1.43-.95 2.16a35.54 35.54 0 0 1-3.34 5.12 11.2 11.2 0 0 0-1.9-3.46 24.77 24.77 0 0 0 3.1-8.54 5.96 5.96 0 0 1 2.94 3.98c.06.24.11.49.15.74Zm-6.96 3.3c.12-.02.25 0 .35.06 1.5-2.6 2.49-5.4 2.95-8.33a12.2 12.2 0 0 0-3-.57c-.61-.07-1.22-.12-1.83-.17a27.83 27.83 0 0 1-2.28 7.97c.3.09.53.25.74.4h.01a5.3 5.3 0 0 0 .14.1c.83.56 1.92.76 2.92.55ZM35.03 1.1c-1.6-.12-3.2-.2-4.8-.25a53.2 53.2 0 0 0-.2 8.65l1.8-.3.45-.08c.13-.02.28-.05.45-.06a27.3 27.3 0 0 0 2.3-7.96Zm-5.4-.26c-.3 2.9-.37 5.83-.2 8.74-1.46.17-2.9.2-4.23-.18.37-1.99.24-3.75.1-5.6v-.03c-.07-.93-.14-1.88-.16-2.92 1.5-.04 3-.04 4.5 0Zm-5.1.03c-.28 0-.55.02-.83.03-1.42.06-3.06.17-4.6.53a45 45 0 0 0 .56 7.28l.03.22.26 1.98v.04c.37 0 .73-.02 1.1-.05 1.11-.1 2.63-.42 3.48-1.41a.43.43 0 0 1 .05-.05c.38-1.97.26-3.66.11-5.61V3.7c-.07-.9-.14-1.82-.16-2.83Zm-5.43 8.2.25 1.9h-.09c-.83 0-1.7.02-2.54.15-.34.05-.78.13-1.2.33a14.2 14.2 0 0 1-2.37-5.24c.14-.28.3-.56.45-.83a8.44 8.44 0 0 1 1.91-2.3 8.32 8.32 0 0 1 2.98-1.49c.02 3.08.23 4.65.57 7.18l.04.3Zm-6.34-2c-.6 1.45-1 3.06-1.18 4.84.36.85.69 1.75 1 2.62.22.6.44 1.2.68 1.8.21-.59.39-1.2.57-1.8l.03-.13c.14-.47.28-.93.43-1.37.12-.36.25-.76.57-1.1l.17-.17a14.3 14.3 0 0 1-2.27-4.7Zm-1.29 6.46.01-.27.53 1.44c.3.81.6 1.65.94 2.45-.3.7-.66 1.38-1.13 1.98-.24-1.86-.4-3.73-.35-5.6Zm10.41-8.07c0 .15.14.26.3.26h.02c.17 0 .3-.14.29-.29-.05-.8-.17-1.61-.36-2.4-.03-.15-.2-.25-.35-.22-.17.04-.28.18-.24.33.18.76.3 1.55.34 2.32Zm-6.2 2.05c.05.08.15.12.25.12a.3.3 0 0 0 .16-.04.26.26 0 0 0 .1-.37 3.66 3.66 0 0 1-.59-1.36c-.03-.15-.19-.25-.35-.22a.27.27 0 0 0-.24.32c.1.54.34 1.08.66 1.55Zm12.84 45.47a.3.3 0 0 0 .3.23h.05c.17-.03.28-.17.25-.32a7.46 7.46 0 0 1 .24-3.61c.05-.15-.04-.3-.2-.34a.3.3 0 0 0-.38.18 7.97 7.97 0 0 0-.26 3.86Zm1.62-5.51c-.16 0-.3-.12-.3-.28v-2.87c0-.15.13-.27.3-.27.17 0 .3.12.3.27v2.87c0 .15-.13.28-.3.28Zm5.14.13c0 .16.13.28.3.28.17 0 .3-.13.3-.28v-3.69c0-.15-.13-.27-.3-.27-.17 0-.3.12-.3.27v3.7Zm4.66-4.53c-.14 0-.27-.1-.3-.22l-.14-.7-.02-.1a8.26 8.26 0 0 0-1.02-2.94c-.07-.14-.01-.3.14-.37a.32.32 0 0 1 .4.12c.73 1.31.9 2.13 1.07 3.08l.04.17.12.63c.04.14-.07.29-.23.32a.4.4 0 0 1-.06 0Zm-16.9 3.3c0 .15.14.28.3.28.17 0 .3-.13.3-.28V43.5c0-.16-.13-.28-.3-.28-.16 0-.3.13-.3.28v2.87Zm.3 6.02c-.16 0-.3-.12-.3-.27v-2.06c0-.15.14-.27.3-.27.17 0 .3.12.3.27v2.06c0 .15-.13.27-.3.27Zm-6-8.21h.04c.15 0 .28-.1.3-.24l.55-3.68c.02-.15-.09-.28-.26-.3a.28.28 0 0 0-.33.23l-.56 3.68c-.02.15.1.29.26.3Zm1.08 5.34h-.04a.29.29 0 0 1-.27-.3l.48-4.1c.02-.15.16-.26.33-.24.17.01.29.15.27.3l-.47 4.1c-.02.14-.15.24-.3.24ZM43.57 32.1c.06.1.16.14.27.14.05 0 .1 0 .14-.03.15-.07.2-.23.12-.37l-.95-1.62a.3.3 0 0 0-.4-.1.25.25 0 0 0-.13.36l.95 1.62Zm-30.24 3.06h-.05c-.16-.03-.27-.17-.24-.32l.55-2.85c.03-.15.19-.25.35-.23.16.03.27.17.24.32l-.55 2.86c-.03.13-.15.22-.3.22Zm23.54 14.9c0 .14.14.27.3.27.18 0 .3-.13.3-.28 0-.59-.1-1.17-.31-1.72-.05-.15-.22-.23-.38-.18-.16.05-.25.2-.2.35.2.5.29 1.02.3 1.55Zm2.74-13.79a.3.3 0 0 1-.28-.15l-.9-1.74c-.07-.13 0-.3.14-.36.15-.06.34 0 .4.13l.9 1.74c.08.13.01.3-.14.36a.33.33 0 0 1-.12.02ZM17.45 9a.3.3 0 0 1-.27-.15 6.53 6.53 0 0 1-.78-2.46c-.02-.15.1-.28.27-.3.16-.01.31.1.33.25.08.79.33 1.55.72 2.27.07.13.01.3-.14.36a.3.3 0 0 1-.13.03Zm5.83-.09h-.03c-.17-.01-.29-.14-.27-.3.1-1.04.14-2.1.09-3.15-.01-.15.12-.27.29-.28.16 0 .3.1.31.26.05 1.07.02 2.16-.09 3.23a.3.3 0 0 1-.3.25ZM27.01 7c0 .15.13.27.3.27.17 0 .3-.12.3-.27 0-1-.1-2-.33-2.97-.03-.15-.2-.25-.35-.22-.17.04-.27.18-.24.33.21.94.32 1.9.32 2.86Zm4.84-1.46h-.04c-.17-.02-.29-.16-.26-.3l.31-2.2a.31.31 0 0 1 .34-.23c.17.02.29.16.26.3l-.31 2.2c-.02.13-.15.23-.3.23Zm4.21 2.63a.4.4 0 0 0 .1.01.3.3 0 0 0 .29-.18 9.5 9.5 0 0 0 .62-2.53c.01-.15-.1-.28-.28-.3-.16 0-.3.1-.32.25a9.03 9.03 0 0 1-.6 2.4c-.05.14.04.3.2.35Zm1.5-.81a.3.3 0 0 1-.15-.04.26.26 0 0 1-.1-.38c.22-.33.33-.73.31-1.12a.3.3 0 0 1 .29-.29c.16 0 .3.11.31.26a2.3 2.3 0 0 1-.4 1.43.3.3 0 0 1-.26.13Zm3.7-.48a.3.3 0 0 0 .12.02.3.3 0 0 0 .28-.17c.31-.65.58-1.33.78-2.02.04-.15-.05-.3-.22-.34-.15-.04-.32.05-.36.2a14 14 0 0 1-.75 1.95c-.07.14 0 .3.15.36Zm-.67 3.22a.32.32 0 0 1-.2-.07.25.25 0 0 1-.02-.39c.9-.88 1.7-1.85 2.38-2.88a.32.32 0 0 1 .41-.09c.15.08.2.25.1.38A19.34 19.34 0 0 1 40.82 10a.31.31 0 0 1-.23.1Zm0 0Zm1.34 4.6c.05.03.11.05.17.05.1 0 .19-.04.25-.1l.9-1.1c.1-.12.07-.3-.06-.39a.32.32 0 0 0-.42.06l-.9 1.1c-.1.11-.08.29.06.38ZM13.3 12.47c-.1 0-.2-.05-.26-.14a6.6 6.6 0 0 1-.74-1.61.28.28 0 0 1 .21-.34c.16-.04.33.05.37.2.16.51.38 1.01.68 1.48.08.13.03.3-.11.37a.34.34 0 0 1-.15.04Zm19 10.34a17.66 17.66 0 0 0 4.8.1c.23-.03.48-.06.7-.17a1 1 0 0 0 .56-1.28c-.16-.44-.5-.73-1.03-.9-.94-.28-2.05-.33-2.82-.33-.37 0-.74 0-1.11.03-.4.03-.9.1-1.34.33-.51.29-.8.87-.7 1.4.09.44.43.73.94.82Zm1.15-2 .29-.02c-.19.27-.25.63-.25.96 0 .21.02.43.15.6l.07.08c-.44-.03-.87-.09-1.3-.16-.26-.04-.41-.17-.45-.38-.06-.3.12-.66.42-.83a2.7 2.7 0 0 1 1.07-.25Zm2.42.03c.42.05.87.12 1.27.24.34.1.55.28.64.55.09.22.03.5-.24.62-.15.07-.33.1-.52.12-.35.04-.7.07-1.06.09a.6.6 0 0 0 .11-.1c.15-.17.18-.4.15-.62a1.86 1.86 0 0 0-.35-.9Zm-18 2.07a16.45 16.45 0 0 0 4.8-.1c.5-.08.84-.38.93-.82.1-.53-.19-1.12-.7-1.4a3.3 3.3 0 0 0-1.34-.33 15.4 15.4 0 0 0-1.1-.04c-.78 0-1.89.06-2.83.34-.52.16-.87.46-1.03.9a1 1 0 0 0 .55 1.28c.23.1.48.14.71.17Zm-.05-1.82c.4-.12.84-.2 1.27-.25-.2.27-.32.58-.36.9-.02.21 0 .45.16.62a.6.6 0 0 0 .12.1 18.5 18.5 0 0 1-1.07-.09 1.92 1.92 0 0 1-.52-.12c-.27-.12-.33-.4-.25-.62.1-.27.3-.44.65-.54Zm3.64.66c0-.32-.06-.68-.24-.95l.29.01c.33.02.74.07 1.07.25.3.17.48.53.42.84-.05.2-.2.33-.46.38-.42.07-.86.12-1.3.16a.6.6 0 0 0 .08-.09c.13-.17.15-.39.14-.6Zm3.09-.04c-.01-.15-.04-.3-.08-.45a.25.25 0 0 1-.07-.2c-.43-1.17-1.84-2.21-4.05-2.21-.25 0-.5.01-.77.04-2.59.27-3.43 1.6-3.36 2.74.1 1.46 1.62 2.97 4 2.97.6 0 1.23-.1 1.87-.29 1.58-.46 2.52-1.46 2.46-2.6Zm1.83 2.16c.27-1.28.35-2.39.23-3.37.81-.1 1.7.06 2.52.4 0 .8.1 1.6.25 2.4.1.5.24 1.03.37 1.52.35 1.32.68 2.57.47 3.81-.05.33-.21.67-.42.69-.2.01-.44-.29-.6-.76-.07-.2-.3-.32-.53-.28-.23.04-.38.23-.36.44.05.44.08.82-.08 1.1a.58.58 0 0 1-.38.26.29.29 0 0 1-.19-.03c-.1-.08-.15-.3-.18-.46v-.01l-.28-1.37c-.04-.2-.25-.35-.48-.33a.43.43 0 0 0-.42.4 2 2 0 0 1-.2.97c-.12.2-.37.32-.53.26-.25-.09-.29-.55-.25-.91.12-1 .38-2 .63-2.96v-.03c.15-.56.3-1.15.43-1.74Zm4.34-2.24a2.1 2.1 0 0 1 .01-.39c.13-1.04 1.05-2.1 3.35-2.35.26-.03.52-.04.77-.04 2.62 0 4.12 1.48 4.2 2.86.06 1.14-.88 2.14-2.46 2.6-.65.2-1.27.29-1.87.29-2.38 0-3.9-1.51-4-2.97Zm-1.46 13.53c.57.31 1.2.54 1.84.67a89.8 89.8 0 0 1-3.67 0h-.1c-.66 0-1.36-.01-2.02-.08l-.55-.08.34-.11.21-.1.05-.01c.4-.17.76-.32 1.07-.22.07.02.15.05.22.09h.02c.1.06.19.1.3.14.52.17 1.04.02 1.49-.12.28-.09.55-.17.8-.18Zm3.9.8-.34.02.01.06c.01.14-.1.27-.26.29a.27.27 0 0 1-.07.09v.01c-.25.23-.52.5-.87.67-.52.26-1.14.28-1.63.29h-.02l-4 .08a8.2 8.2 0 0 0-.4.01c-.43 0-.9-.03-1.33-.2-.56-.21-1.13-.74-1.06-1.4v-.02l-.01-.01a4.41 4.41 0 0 1-.57-.08c-.16-.03-.27-.18-.23-.32.04-.15.2-.24.36-.21a3.88 3.88 0 0 0 2.27-.25l.1-.04h.01c.45-.19.96-.4 1.5-.24.13.04.24.1.34.14h.01l.21.1c.32.1.68 0 1.09-.13.35-.1.7-.21 1.1-.2.04 0 .1.01.14.04a6.2 6.2 0 0 0 3.6.75c.16 0 .3.1.33.25.02.15-.1.28-.27.3Zm-1.82.66c.14-.07.27-.16.39-.26-.75.03-1.5.04-2.25.04l-2.05-.01h-.08c-.7-.01-1.42-.02-2.12-.1-.48-.05-.96-.14-1.44-.25.04.33.36.61.7.74.44.17 1 .16 1.48.15l4-.09c.46 0 .97-.02 1.38-.22Z" fill="currentColor"></path></svg>` : `${faceId === 4 ? `<svg width="56" height="56" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M43.9 41.04c1.3-.21 2.64-.98 3.99-2.29 4.55-4.45 6.3-12.08 4.28-18.55-.94-3-2.81-7.19-4.9-9.78-3.52-4.4-6.64-6.85-11.1-8.73C25.94-2.58 11.13 1.2 6.2 13.45c-2.4 5.97-4.77 13.72-1.84 20.78.84 1.99 3.25 5.62 6.48 5.3.16.92.5 1.9 1.22 2.56.26.25.57.44.91.58l.02.42a87 87 0 0 1 .17 5.8.64.64 0 0 0-.6.35 1 1 0 0 0-.02.94c.12.26.3.47.58.63.23.16.47.24.7.24v-.01h.13a.86.86 0 0 0 .69-.64c.13-.54-.27-1.03-.7-1.25l-.05-.03a2.71 2.71 0 0 0-.25-.11.36.36 0 0 0 .09-.24c.04-1.42-.06-4-.16-5.92a4.57 4.57 0 0 0 1.1.08c.1.46.21.9.33 1.35.87 3.27 2.13 6.91 4.78 9.17a10.5 10.5 0 0 0 3.06 1.77c1.37.53 2.83.78 4.3.78 2.95 0 5.94-1.04 8.4-3.02a17.5 17.5 0 0 0 5.65-8.9l.08.02a69.97 69.97 0 0 0-.06 5.79c-.19.13-.37.36-.55.7l-.03.06c-.22.45-.3 1.1.1 1.46a.7.7 0 0 0 .47.18c.15 0 .3-.05.42-.12.23-.14.42-.38.55-.71.14-.32.2-.61.15-.89-.05-.34-.24-.64-.5-.75l-.02-.01a69.5 69.5 0 0 1 .03-5.12l.04-.61.05-.02c.33-.1.65-.3.95-.6.6-.62.98-1.52 1.03-2.42Zm1.57-1.61A9.2 9.2 0 0 0 47.32 38c4.28-4.18 5.94-11.38 4.03-17.48-.91-2.9-2.72-6.94-4.71-9.43-3.42-4.27-6.45-6.65-10.77-8.46C26-1.49 11.75 2.1 7.02 13.86 4.7 19.64 2.39 27.12 5.18 33.82c.74 1.76 2.82 4.96 5.53 4.73l-.02-.25a10.61 10.61 0 0 1-2.77-3.1 24.04 24.04 0 0 1-2.09-4.72c-.08-.25.03-.54.26-.64.24-.1.5.03.58.28.49 1.41 1.1 3.04 2 4.5a9.04 9.04 0 0 0 3.2 3.28 5.9 5.9 0 0 0 1.69.6l.16.04c.2.04.39.08.55.16a2.5 2.5 0 0 0 1.63-.49c-2.25-2.76-4.79-6.45-5.2-10.86-.13-1.44-.02-2.88.08-4.28v-.1c.02-.19.16-.33.33-.31.17 0 .29.18.28.35l-.01.11c-.1 1.37-.21 2.78-.08 4.15.4 4.36 3.02 8.04 5.26 10.75.05.07.08.16.07.25 0 .08-.04.16-.1.23-.5.48-1.13.77-1.78.84l.08.25c.2.76.38 1.53.53 2.27l.06.25c.14.62.28 1.26.45 1.89.83 3.11 2.01 6.57 4.47 8.67a9.61 9.61 0 0 0 2.8 1.62c3.89 1.47 8.44.67 11.89-2.1 3.29-2.65 5.49-7 5.92-11.66a9.2 9.2 0 0 1-3.12-2.9.54.54 0 0 1-.08-.42.48.48 0 0 1 .24-.33c4.32-2.38 6.72-8.5 5.33-13.64a.5.5 0 0 1 .3-.63c.24-.07.49.08.56.34 1.45 5.39-.92 11.76-5.3 14.53.42.53.97 1.14 1.64 1.64h.38c.41-.05.82-.27 1.35-.65a9.38 9.38 0 0 0 3.22-4.76c.05-.18.22-.27.38-.2.16.04.24.23.19.41a9.9 9.9 0 0 1-3.46 5.1c-.3.22-.7.5-1.15.65a4.05 4.05 0 0 0 2.6.33c.28-.2.55-.43.7-.62 3.13-3.91 4.15-8.01 3.39-13.74-.02-.18.08-.34.25-.37.16-.04.31.09.33.28.76 5.66-.24 9.96-3.23 13.88Zm-3.66 1.45c-.04.41-.1.82-.17 1.22h.06c.14 0 .25.1.29.25l-.05.65c.1-.06.21-.15.32-.26.4-.41.66-.99.73-1.59h-.1l-.18-.01a.3.3 0 0 1-.14-.09 3.81 3.81 0 0 1-.76-.17Zm-5.65-29.61c-.13 0-.23-.09-.28-.23-.61-1.84-1.37-4.12-2.89-5.5a.35.35 0 0 1-.04-.46c.1-.14.3-.17.42-.05 1.63 1.47 2.42 3.82 3.05 5.73l.02.05c.06.17-.02.36-.18.42a.37.37 0 0 1-.1.02v.02Zm-25.37.83c-.16 0-.29-.13-.3-.3-.04-.52.3-.94.45-1.14A14.67 14.67 0 0 1 15 7.13c.14-.08.32-.02.4.14.07.16.02.36-.13.44-1.47.86-2.78 2-3.88 3.38-.17.2-.33.43-.3.64 0 .18-.11.35-.28.36h-.02Zm21.87 10.1c.06.23.24.37.43.37v-.03h.05c.2-.02.35-.19.38-.4.11.04.24.04.35-.02.14-.06.22-.2.25-.36.17-.99.3-1.98.37-3l.9 3.35c.05.2.2.35.4.36.18.02.36-.1.43-.29.13-.3.63-.35.92-.36 1-.05 2 .11 2.97.45a.43.43 0 0 0 .46-.14l.02-.02c.08.06.2.1.3.08 1.03-.14 2.1-.18 3.13-.14.24.02.45-.2.46-.47.16-2.93-.51-5.94-1.89-8.45-.38-.7-1.01-1.68-2-1.9-.24-.06-.47.1-.53.38-.05.28.11.54.35.6.5.1.95.57 1.43 1.44a14.97 14.97 0 0 1 1.78 7.4c-.8-.01-1.6.03-2.39.11a8.9 8.9 0 0 0-1.32-3.53c-.13-.18-.34-.25-.53-.17a.5.5 0 0 0-.28.52c.1 1.05.27 2.09.5 3.12a8.74 8.74 0 0 0-2.5-.26c-.44.02-.78.1-1.07.25l-1.47-5.51a.45.45 0 0 0-.49-.35c-.22.03-.38.24-.38.5.03 1.82-.1 3.65-.37 5.44l-.2.09a1.1 1.1 0 0 0-1.17-.29 8.5 8.5 0 0 0-.98-3 20.14 20.14 0 0 0-2.28-3.21.41.41 0 0 0-.48-.14.47.47 0 0 0-.3.43c-.1 1.42-.23 2.86-.64 4.12a6.72 6.72 0 0 0-1.2-3.74c-.11-.15-.3-.22-.46-.17a.5.5 0 0 0-.33.4c-.27 1.84-.8 3.61-1.58 5.25-.44-.17-.91-.2-1.38-.17.61-2.05.62-4.32-.02-6.36-.07-.21-.26-.36-.47-.33a.48.48 0 0 0-.39.44 14.3 14.3 0 0 1-1.65 5.41l-.11-.19a.43.43 0 0 0-.62-.13c-.06.03-.1.07-.15.11l-.03.02-.02.02a3.1 3.1 0 0 0-.3-.74c-.27-.48-.57-.55-.78-.55-.4.02-.63.38-.73.53l-.67 1.05c.09-1.32.28-2.62.55-3.9.04-.24-.05-.47-.24-.57a.42.42 0 0 0-.55.13 20.27 20.27 0 0 0-2.72 5.46.76.76 0 0 1-.08.21c-.04.02-.22.03-.22.03h-1.8c-.05 0-.2 0-.23-.02 0 0-.05-.07-.05-.38a13.7 13.7 0 0 1 4.65-10.4.54.54 0 0 0 .08-.7c-.15-.2-.43-.26-.63-.09a14.85 14.85 0 0 0-5 11.2c0 .24 0 .86.44 1.2.26.2.54.2.74.18h1.8c.18 0 .48 0 .73-.2.24-.2.33-.48.4-.67v-.01a19.4 19.4 0 0 1 1.4-3.27c-.15 1.13-.22 2.3-.22 3.44 0 .22.12.4.31.47.2.06.4 0 .5-.19l1.54-2.4a.15.15 0 0 0 .02-.04c.25.43.34.96.25 1.46-.04.26.1.5.32.57.2.08.45-.05.53-.28.08-.2.18-.38.3-.54l.22.36c.08.14.22.22.36.22.15 0 .29-.07.37-.21a15.01 15.01 0 0 0 1.71-4 9.7 9.7 0 0 1-.68 4.14c-.07.19-.04.4.08.54.13.15.32.2.49.13a2.37 2.37 0 0 1 1.96.1c.21.1.46.02.58-.22.74-1.48 1.3-3.06 1.65-4.7.55 1.35.6 2.98.07 4.34a.53.53 0 0 0 .16.6c.17.14.4.12.56-.05 1.37-1.46 1.79-3.55 1.99-5.69.55.7 1.08 1.42 1.5 2.21.45.83.96 2.13.88 3.51-.02.26.14.48.36.53.22.04.44-.1.51-.34a.4.4 0 0 1 .36-.27c.15 0 .3.14.33.3Zm-19.2 18.5.06 1.13c.33.1.66.12.93.11-.15-.69-.3-1.4-.5-2.07-.06-.25-.1-.3-.1-.3-.03-.02-.13-.03-.23-.05l-.06-.01a6.31 6.31 0 0 1-1.93-.64c.15 1.18.47 1.97 1 2.46.09.08.18.16.28.22l-.05-1.17a.3.3 0 0 1 .31-.25c.15 0 .26.15.27.3l.02.27Zm14.59-.62a.97.97 0 0 1-.49-.13c-.25-.15-.4-.37-.5-.61-.23.14-.5.22-.77.2-.68-.03-1.28-.63-1.38-1.39-.1-.74.25-1.38.54-1.9l.04-.08a13.07 13.07 0 0 0 1.53-7.7.48.48 0 0 1 .38-.55c.25-.04.48.15.5.43a14.1 14.1 0 0 1-1.65 8.34l-.04.07-.01.02c-.23.42-.46.84-.41 1.2.04.29.3.54.54.55.27 0 .53-.21.6-.48.04-.25.27-.41.49-.37.23.04.38.26.37.51-.02.62.08.81.17.87.09.05.24-.02.33-.13.14-.2.15-.52.14-.68-.02-.27.15-.5.4-.53.22-.03.44.14.5.39.05.26.14.47.28.59.11.1.28.14.39.1.18-.1.25-.45.25-.72a6.54 6.54 0 0 0-.56-2.32l-.04-.1a12.31 12.31 0 0 1-.65-6.72c.05-.28.28-.45.53-.4.24.06.4.32.34.6a11.4 11.4 0 0 0 .39 5.54l.13.36.12.35c.32.86.64 1.74.63 2.72 0 .76-.3 1.35-.76 1.6-.42.22-.94.13-1.33-.21a.89.89 0 0 0-.02.04l-.03.04c-.24.33-.6.5-.94.5h-.01ZM39.88 26.9s-.05 0-.07-.02a9.21 9.21 0 0 0-4.34-.95h-.1c-.47 0-1.02.03-1.55.18a7.8 7.8 0 0 0-.64.23l-.05.02c-.42.16-.86.33-1.32.33-.11 0-.23-.01-.34-.04a.53.53 0 0 1-.29-.14c-.12-.14-.12-.34-.12-.47v-.03c0-.15-.02-.34-.04-.55v-.04l-.02-.2c-.06-.52-.08-.69.37-1 .4-.27.9-.42 1.33-.53a8.56 8.56 0 0 1 2.19-.25h.5c.78.02 1.67.1 2.46.5 1.2.61 2.05 1.25 2.17 2.7v.07c0 .1-.06.17-.14.17v.02Zm-25.19 0s-.06 0-.08-.04c-.04-.03-.06-.09-.06-.14.1-1.48.96-2.14 2.17-2.76a5.8 5.8 0 0 1 2.47-.5 9.28 9.28 0 0 1 4.14.84c.06.03.13.06.18.13v.01c.07.07.1.12.12.17.03.08.02.17-.01.4a19.96 19.96 0 0 0-.07.62c-.01.16-.03.3-.02.4 0 .12 0 .34-.12.49-.09.1-.2.12-.29.14-.11.03-.23.04-.34.04a3.9 3.9 0 0 1-1.35-.34l-.02-.01a5.43 5.43 0 0 0-2.2-.41h-.09c-1.7 0-3.14.3-4.34.95l-.07.02-.02-.01Zm13.08 21.41a2.9 2.9 0 0 1-1.89-.75 6.6 6.6 0 0 1-1.03-1.2l-.16-.2c-.62-.72-.9-1.13-.78-1.4.07-.14.27-.16.5-.18l.18-.02c.22-.08.41-.21.57-.4.11-.13.2-.3.31-.48l.03-.06c.2-.37.42-.76.8-.91.34-.15.77-.02 1.05.31.09.1.15.21.2.32.18-.27.4-.46.65-.57.41-.18.9-.12 1.22.17.3.28.4.7.51 1.1v.01l.05.16.04.16c.12.43.45.85.79.78.07-.01.13.02.16.09.04.07 0 .16-.05.2-.31.25-.5.64-.7 1.05-.13.28-.26.55-.44.8a2.5 2.5 0 0 1-1.88 1.01h-.1l-.03.01Zm4.94-16.9c1 .31 2.02.47 3.06.47v.01c.59 0 1.18-.05 1.75-.16.4-.07.97-.23 1.21-.76.25-.57 0-1.21-.38-1.56-.35-.34-.8-.44-1.2-.53-.93-.19-1.93-.28-2.98-.28h-.15c-.4 0-.83.02-1.24.18-.38.16-.98.63-1.11 1.22-.09.32-.01.63.19.9.23.3.56.41.85.5Zm1.3-2.15h.85c-.4.24-.5.8-.38 1.44l.01.01c.03.16.1.3.18.43-.6-.07-1.2-.2-1.79-.38-.2-.07-.44-.15-.56-.3a.34.34 0 0 1-.07-.3c.08-.29.45-.63.74-.75.32-.13.7-.15 1.04-.15Zm2.14.35a.73.73 0 0 0-.2-.26c.38.05.74.1 1.1.18.32.06.68.14.94.37.19.18.32.5.22.75-.1.2-.35.34-.78.41-.5.09-.99.14-1.5.15.17-.26.26-.6.3-.93.01-.23.01-.46-.08-.67Zm-17.11 1.35c-.79 0-1.59-.08-2.35-.24h-.01c-.28-.05-1.05-.2-1.23-.93-.09-.33-.04-.65.11-.93.4-.68 1.46-.95 2.05-1.05a6.56 6.56 0 0 1 3.3.3c.37.13.84.33 1.13.77.3.48.33 1.23-.13 1.62-.18.16-.42.21-.63.26-.73.13-1.48.2-2.23.2h-.01Zm-.84-2.55-.5.06c-.65.1-1.41.37-1.64.76a.5.5 0 0 0-.04.39c.05.22.31.38.77.46.54.11 1.09.18 1.63.2-.17-.16-.3-.4-.36-.64-.1-.5-.06-.94.14-1.23Zm1.51.09.02.04c.1.2.1.44.07.67-.03.4-.16.84-.41 1.09.6-.02 1.2-.08 1.78-.19h.05a.86.86 0 0 0 .32-.12c.16-.14.14-.5 0-.7-.2-.28-.54-.43-.82-.53-.33-.12-.67-.2-1-.26Zm-10.83.82.08-.03a.35.35 0 0 0 .19-.42 15.29 15.29 0 0 1-.55-6.4c.02-.18-.1-.35-.25-.37-.16-.02-.31.1-.33.28-.3 2.25-.1 4.57.57 6.71a.3.3 0 0 0 .28.23Zm37.79-9.96c.04.14.16.24.28.24a.2.2 0 0 0 .04 0 .2.2 0 0 1 .05-.01.33.33 0 0 0 .2-.41c-.4-1.42-.9-2.82-1.52-4.15a.28.28 0 0 0-.4-.15.36.36 0 0 0-.12.45c.6 1.29 1.09 2.65 1.47 4.03Zm-24.84-8.84c0 .18.14.31.3.31.16 0 .29-.16.29-.34l-.09-2.62c0-.18-.13-.33-.3-.32-.16.01-.28.17-.28.35l.08 2.62Z" fill="currentColor"></path></svg>` : `${faceId === 5 ? `<svg width="56" height="57" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M7.47 53.83c2.33-6.86 3.48-14.16 4.6-21.24v-.06c.97-6.14 1.97-12.49 3.74-18.48.6-2.06 1.4-4.43 2.73-6.4C21.5 3.22 23.45.91 32.08.9h.04c4.04 0 7.05.87 8.93 2.57 2.75 2.5 3.79 6.5 4.16 8.66.5 2.92.49 5.96.47 8.91-.01 1.48-.02 3 .04 4.5.11 3.1.5 6.2.89 9.2l2.38 18.82a10.82 10.82 0 0 1-2.06-4.37.43.43 0 0 0-.46-.35.45.45 0 0 0-.37.45c0 1.41.09 2.83.24 4.23a13.29 13.29 0 0 1-2.42-4.31c-.07-.2-.26-.33-.46-.3a.44.44 0 0 0-.35.42l-.25 4.28a18.8 18.8 0 0 1-1.74-6.55c-.02-.25-.22-.43-.45-.41a.4.4 0 0 0-.3.17 55.6 55.6 0 0 0 3.2-13.12l.13 7.74v.04a1.45 1.45 0 0 0-1 1.68c.08.35.34.65.7.84.23.12.47.18.72.18.3 0 .57-.1.8-.26.44-.34.5-.75.47-1.03a1.8 1.8 0 0 0-1.14-1.4l.01-.06-.14-8.61c.26-.14.49-.38.64-.69.19-.37.26-.78.3-1.17.2-1.48.23-2.61.08-3.66-.06-.37-.16-.83-.51-1.08a1.13 1.13 0 0 0-.57-.2c-.14-.02-.3-.02-.45.01-.16-2.97-.47-5.61-2.16-7.77-1.12-1.43-2.68-2.28-4.2-3.1l-.01-.02-1-.55c-2.3-1.32-3.62-2.77-4.02-4.44a.26.26 0 0 0-.33-.21.3.3 0 0 0-.2.36c.43 1.84 1.84 3.41 4.3 4.82l1 .56.03.01c1.46.8 2.96 1.63 4 2.95 1.46 1.85 1.83 4.14 2 6.72a10.6 10.6 0 0 0-.78-1.7c-1.28-2.22-3.17-3.25-5-4.26h-.01c-.9-.5-1.82-1-2.68-1.64a10.24 10.24 0 0 1-3.84-5.5l-.1-1.05c-.03-.23-.2-.4-.42-.4-.22 0-.4.18-.41.4-.3 3.57-3.6 5.3-6.5 6.84l-.23.12-1.19.64c-2.77 1.56-4.6 3.37-5.6 5.52-.18.37-.32.76-.45 1.15-.4-.15-.87-.07-1.17.26a2 2 0 0 0-.42 1.07 19 19 0 0 0-.24 2.88c0 .54.01 1.11.21 1.63.13.33.3.57.52.72h.01a84.9 84.9 0 0 0-1.02 8.43c-.48.06-.9.33-1.08.71-.15.33-.18.7-.07 1.04.11.34.37.62.68.74.12.04.26.06.4.06a2.25 2.25 0 0 0 .98-.25c.13-.09.24-.22.34-.38.23-.4.27-.9.1-1.28a1.1 1.1 0 0 0-.79-.62c.15-2.28.44-4.73.89-7.58l.01.43.03.9c.17 6.34 1.08 15.23 7 19.15a13.58 13.58 0 0 0 7.4 2.27c1.65 0 3.18-.34 4.55-1 3.11-1.5 4.96-4.66 6.15-7.63a19.65 19.65 0 0 0 2.55 8.36c.1.17.28.25.46.2.17-.05.3-.21.31-.4l.23-3.96a13.86 13.86 0 0 0 2.8 3.87.4.4 0 0 0 .48.06.44.44 0 0 0 .2-.46c-.12-.88-.21-1.76-.28-2.64a11.31 11.31 0 0 0 2.26 3.13.4.4 0 0 0 .47.06.46.46 0 0 0 .22-.46l-2.56-20.18c-.38-2.97-.77-6.06-.88-9.1-.06-1.49-.05-3-.04-4.47.02-2.99.04-6.08-.48-9.08-.4-2.28-1.5-6.51-4.44-9.18C39.54.93 36.33-.01 32.08 0 23.5.01 21.17 2.18 17.87 7.1A24.36 24.36 0 0 0 15 13.78c-1.79 6.07-2.8 12.47-3.77 18.66v.02c-1.2 7.58-2.43 15.42-5.11 22.63a.47.47 0 0 0-.03.24h-.01a.32.32 0 0 0-.02.43c.1.12.28.13.4.02l.06-.07c.16 0 .3-.1.37-.28l.06-.15a23.49 23.49 0 0 0 4.02-5.81c-.3 2.11-.9 4.2-1.78 6.1a.3.3 0 0 0 .1.38c.04.04.1.06.15.06.08 0 .15-.02.2-.08 2-2.17 3.13-4.97 3.86-7.48-.02 2.05-.45 4.1-.87 6.1v.01a.3.3 0 0 0 .15.34c.13.06.27.02.34-.1a20.82 20.82 0 0 0 3.3-8.01.3.3 0 0 0-.21-.35c-.15-.03-.3.07-.33.24a20.31 20.31 0 0 1-2.4 6.5c.42-2.1.75-4.36.49-6.56-.02-.15-.13-.26-.26-.27a.28.28 0 0 0-.29.23c-.79 3.2-1.73 5.56-2.97 7.4a22.7 22.7 0 0 0 1.25-6.2.28.28 0 0 0-.21-.3.26.26 0 0 0-.32.16 23.18 23.18 0 0 1-3.71 6.2ZM44.1 32.1c.07-.08.12-.16.16-.24.15-.29.2-.63.25-.98.19-1.42.2-2.5.07-3.48-.04-.25-.1-.55-.28-.68a.6.6 0 0 0-.3-.1.87.87 0 0 0-.6.14c.2.94.32 1.95.34 3.03.01.58 0 1.16-.02 1.74a.26.26 0 0 1 .1-.02.3.3 0 0 1 .27.3v.29Zm-29.23-.95a.28.28 0 0 1 .23-.25c0-1.62.11-3.28.53-4.84a.53.53 0 0 0-.6.11c-.16.18-.22.47-.26.75a18.5 18.5 0 0 0-.24 2.79c0 .55.02 1 .17 1.4.04.1.08.19.13.26l.04-.22Zm8.76-12.28c2.43-1.28 5.34-2.82 6.5-5.59a11.4 11.4 0 0 0 3.93 5.22c.9.68 1.85 1.2 2.77 1.7 1.81 1 3.52 1.93 4.68 3.94a11.76 11.76 0 0 1 1.39 5.67c.1 5.31-1.37 10.7-2.49 14.28-1.03 3.32-2.84 7.94-6.63 9.76-1.26.6-2.68.91-4.2.91a12.9 12.9 0 0 1-6.96-2.13c-5.58-3.7-6.44-12.28-6.6-18.41l-.03-.9c-.1-2.96-.2-6.02 1-8.58.93-1.97 2.64-3.65 5.25-5.12l1.36-.74.03-.01Zm4.53 20.2h.1a1 1 0 0 0 .74-.33c.22-.24.3-.54.36-.83.15.15.32.28.5.38.42.2.68.07.8-.02.17-.13.23-.3.27-.44.38-1.27-.06-2.49-.49-3.67v-.01c-.15-.43-.3-.83-.4-1.24-.44-1.63-.24-3.45-.06-5.06v-.03c.03-.25-.13-.47-.36-.5-.24-.03-.44.15-.47.4-.2 1.7-.4 3.62.07 5.43.12.44.27.87.42 1.3l.02.03c.37 1.04.73 2.03.5 2.96-.34-.21-.6-.6-.67-1.03l-.01-.52a.44.44 0 0 0-.4-.43c-.22 0-.4.17-.43.4a8.21 8.21 0 0 1-.11 1.84.98.98 0 0 1-.14.42c-.05.05-.13.05-.18.05a.52.52 0 0 1-.37-.22c-.16-.23-.21-.57-.17-1.11a7 7 0 0 1 .02-.26v-.01a4.1 4.1 0 0 0-.04-1.35c-.06-.22-.26-.37-.47-.33-.21.03-.36.23-.36.46.02.43.02.81-.14 1.06a.36.36 0 0 1-.3.13c-.02 0-.07 0-.08-.03 0-.01-.02-.07 0-.2a3.5 3.5 0 0 1 .78-1.55c.15-.2.3-.42.44-.64 1.19-1.9 1.28-4.59.25-7.36-.09-.23-.33-.34-.54-.25a.46.46 0 0 0-.24.58c.91 2.46.85 4.9-.17 6.53-.11.19-.24.37-.38.56l-.02.02a4.3 4.3 0 0 0-.95 1.98c-.04.29-.01.53.09.74.14.3.4.49.74.52.18.02.36-.01.52-.08.03.38.11.78.35 1.12.22.33.6.56.98.59Zm11.2-11.64c.03.02.06.03.1.03l.06-.01a.16.16 0 0 0 .07-.15 3.28 3.28 0 0 0-2.24-2.9 3.6 3.6 0 0 0-1-.14c-.36 0-.73.04-1.06.08h-.05l-1.8.2a.64.64 0 0 0-.4.13c-.1.1-.15.21-.19.32l-.12.32c-.19.44-.37.9-.26 1.43.02.07.08.12.15.11a5.29 5.29 0 0 0 1.5-.44 4.7 4.7 0 0 1 1.8-.46 5.98 5.98 0 0 1 3.45 1.48Zm-22.17.01.07.02.09-.03a5.99 5.99 0 0 1 3.45-1.48c.65 0 1.23.23 1.79.46.47.2.96.4 1.5.44.07 0 .13-.04.15-.11.11-.52-.08-.99-.26-1.43l-.12-.32a.75.75 0 0 0-.2-.32.68.68 0 0 0-.38-.14l-1.81-.2h-.04c-.33-.03-.7-.07-1.07-.07-.38 0-.7.04-1 .13a3.29 3.29 0 0 0-2.24 2.9c0 .07.02.13.07.15Zm6 3.44c-1.46 0-2.93-.1-4.37-.3a2.05 2.05 0 0 1-.8-.23 1.06 1.06 0 0 1-.54-.87c-.01-.4.23-.76.68-1.04v-.02a4.05 4.05 0 0 1 2.86-.86c.96.04 1.88.3 2.76.56h.01c.33.1.77.22 1.07.59.2.25.3.6.27.97-.04.36-.2.68-.45.89-.36.28-.8.31-1.23.31h-.26Zm-4.58-2.07-.03.03a.29.29 0 0 1-.1.1c-.13.07-.45.28-.44.53 0 .14.12.28.25.35.16.1.36.13.6.16.4.06.82.11 1.24.15a1.31 1.31 0 0 1-.2-1.02c.06-.35.2-.69.42-.93a3.4 3.4 0 0 0-1.74.63Zm3.56 1.46 1.02.02h.26c.34 0 .67-.02.9-.2.12-.1.2-.28.22-.47a.71.71 0 0 0-.13-.51c-.17-.21-.46-.3-.8-.4l-.01-.01c-.45-.13-.9-.26-1.37-.36.08.15.13.32.14.5.03.3-.02.6-.07.91v.02a1.4 1.4 0 0 1-.16.5Zm15.2.6h.2c.27 0 .58-.01.88-.12.42-.14.8-.55.71-1.04-.08-.42-.47-.63-.65-.72-.52-.27-1.05-.5-1.59-.72-.6-.24-1.4-.51-2.23-.56h-.25c-.6 0-1.43.1-1.94.61-.38.39-.92 1.36-.51 2 .3.48.9.49 1.18.49l4.2.06Zm-3.02-2.56c-.43 0-1.1.09-1.47.45-.3.3-.6.96-.43 1.22.12.2.42.22.73.22l.81.02c-.04-.1-.04-.2-.04-.3.02-.7.05-1.3.4-1.61Zm1.93 1.94 1.29.02c.23 0 .48-.01.7-.1.19-.05.37-.21.34-.34-.02-.12-.2-.23-.34-.3a16.85 16.85 0 0 0-1.75-.78c.07.14.1.3.1.46-.01.28-.12.54-.23.8a1.5 1.5 0 0 1-.11.24ZM22.45 44.58l-.06-.01a.3.3 0 0 1-.22-.36c.08-.4.28-.78.55-1.07a.27.27 0 0 1 .4 0c.1.12.1.3 0 .42l-.08.1c.28.3.54.64.8.97.25.33.51.67.79.97.44.48.9.88 1.38 1.19.06-.43.3-.83.7-1.17.21-.18.5-.29.78-.29.34 0 .63.15.8.41.08.13.13.26.16.4.27-.36.73-.59 1.19-.51.57.1 1.07.64 1.2 1.3a5.12 5.12 0 0 0 2.33-3.77 1.75 1.75 0 0 0-.12-.08.31.31 0 0 1-.1-.41c.08-.15.25-.2.39-.1.43.27.76.7.94 1.2a.3.3 0 0 1-.15.38.27.27 0 0 1-.1.02.28.28 0 0 1-.26-.19 1.87 1.87 0 0 0-.12-.24 5.83 5.83 0 0 1-2.8 3.86c-.07.43-.27.86-.57 1.2-.4.44-.94.68-1.54.68a2.94 2.94 0 0 1-2.66-1.88l-.02-.07v-.04a7.31 7.31 0 0 1-1.83-1.47c-.3-.32-.56-.67-.82-1a17.1 17.1 0 0 0-.66-.82l-.03.14a.28.28 0 0 1-.27.23Zm7.58-34.32h-.01a.3.3 0 0 1-.27-.31c.07-2.33.4-4.66.96-6.9l.01-.05c.04-.16.2-.25.35-.2a.3.3 0 0 1 .19.37v.02a31.3 31.3 0 0 0-.95 6.78c-.01.16-.13.29-.28.29Zm-5.55-4.17c.06.1.14.14.23.14a.3.3 0 0 0 .16-.05 8.94 8.94 0 0 1 4.6-1.6.3.3 0 0 0 .27-.32c-.01-.17-.14-.29-.3-.28a9.5 9.5 0 0 0-4.88 1.7.32.32 0 0 0-.08.41Zm12.38.78a.26.26 0 0 1-.17-.07 9.28 9.28 0 0 0-4.44-2.06.3.3 0 0 1-.24-.34c.03-.16.17-.28.32-.25a9.85 9.85 0 0 1 4.7 2.18c.13.1.15.3.05.42a.27.27 0 0 1-.22.12ZM15.94 23.49c0 .16.13.29.28.29h.01c.15-.01.27-.16.26-.32a9.61 9.61 0 0 1 3.13-7.59 17.38 17.38 0 0 1 4.41-2.52h.01c1.76-.8 3.58-1.61 4.99-3.05a.3.3 0 0 0 .01-.42.26.26 0 0 0-.4-.02c-1.33 1.37-3.03 2.13-4.82 2.93a17.7 17.7 0 0 0-4.55 2.61 10.25 10.25 0 0 0-3.33 8.1Zm3.23-11.07c.04.03.1.04.14.04.1 0 .19-.05.24-.14.93-1.66 2.77-2.44 4.45-2.99l.6-.19c1.61-.5 3.29-1.04 4.55-2.29a.3.3 0 0 0 .02-.42.26.26 0 0 0-.4-.02c-1.16 1.15-2.76 1.66-4.31 2.15h-.02l-.6.2c-1.78.58-3.74 1.42-4.77 3.25a.32.32 0 0 0 .1.41Zm23.43 4.02h-.03a.3.3 0 0 1-.25-.32c.14-1.99-1.21-3.7-2.52-4.65a17.18 17.18 0 0 0-3.58-1.81l-.22-.1-1.2-.5c-1-.45-2.09-1.07-2.58-2.21a.31.31 0 0 1 .14-.4c.14-.07.3 0 .37.15.4.95 1.38 1.5 2.29 1.9.37.17.76.33 1.14.49l.26.1.03.02c1.24.51 2.53 1.04 3.66 1.86 1.44 1.04 2.93 2.95 2.77 5.2-.02.15-.14.27-.28.27Zm1.52 5.43c0 .17.13.3.28.3.16 0 .28-.13.28-.3-.04-3.46-.44-6.9-1.2-10.26-.04-.16-.2-.26-.34-.22a.3.3 0 0 0-.2.36 47.82 47.82 0 0 1 1.18 10.12Zm-27.85-3.54h-.06a.3.3 0 0 1-.21-.36c.64-3.2 1.82-6.2 3.5-8.94a.27.27 0 0 1 .4-.08c.12.09.16.28.07.41a26.92 26.92 0 0 0-3.43 8.73.28.28 0 0 1-.27.24Zm28.17 29.6c.03.13.14.22.27.22l.07-.01c.15-.04.24-.2.2-.37l-.35-1.43c-.04-.16-.2-.26-.34-.21a.3.3 0 0 0-.2.36l.35 1.44Zm-34.22-1.3a.25.25 0 0 1-.12-.04.31.31 0 0 1-.13-.4c.31-.67.56-1.37.74-2.1.04-.15.19-.25.34-.2.15.04.24.2.2.36-.2.76-.45 1.5-.78 2.2a.28.28 0 0 1-.25.17Zm2.04.08h.05c.14 0 .25-.1.28-.24.1-.56.22-1.13.37-1.68.05-.16-.04-.33-.19-.37a.28.28 0 0 0-.34.2c-.16.57-.29 1.16-.39 1.74-.03.16.07.32.22.35Zm2.73 0c-.15 0-.27-.12-.28-.28l-.09-1.88c0-.16.11-.3.27-.31.15-.01.28.12.29.28l.09 1.88c0 .17-.11.31-.27.32ZM12 37.86h.07c.12 0 .24-.08.27-.22l1.07-4.3c.04-.16-.05-.33-.2-.37a.28.28 0 0 0-.34.21l-1.07 4.3c-.04.17.05.33.2.38Zm30.5 10.48-.06-.01c-.15-.04-.24-.2-.2-.37.19-.83.3-1.67.31-2.52 0-.17.14-.3.3-.3.15 0 .27.14.26.31-.02.9-.13 1.79-.33 2.66a.28.28 0 0 1-.27.23Zm4.36-1.26c.04.11.15.18.25.18.04 0 .08 0 .11-.02a.3.3 0 0 0 .15-.4l-.79-1.95a.27.27 0 0 0-.36-.16.3.3 0 0 0-.15.4l.79 1.95Zm-.67-6.98a.28.28 0 0 1-.27-.24l-.75-3.76a.3.3 0 0 1 .21-.36c.15-.04.3.07.33.23l.75 3.76a.3.3 0 0 1-.2.36h-.07Zm-17.45 7.77a4 4 0 0 0 .69-.05.15.15 0 0 0 .12-.17c-.02-.08-.09-.14-.16-.13a4.2 4.2 0 0 1-2.22-.25c-.08-.03-.16 0-.18.09-.03.08 0 .16.08.2.53.2 1.1.31 1.67.31Z" fill="currentColor"></path></svg>` : `${faceId === 6 ? `<svg width="56" height="56" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M41.24 47.7a.44.44 0 0 1-.42-.33.46.46 0 0 1 .3-.55c1.16-.33 2.53-.73 3.9-1.22 7.24-2.57 10.54-11.58 10.06-19.15-.52-8.18-4.6-15.8-10.66-19.9-6.05-4.07-13.9-6.17-20.5-5.46A25.85 25.85 0 0 0 4.27 14.08a25.9 25.9 0 0 0-1.38 22.8 15.24 15.24 0 0 0 4.96 6.5c.97.71 2.13 1.04 3.25 1.37 1.14.32 2.3.66 3.31 1.37.2.15.25.43.11.63-.13.2-.4.27-.6.12a9.74 9.74 0 0 0-3.05-1.25c-1.19-.34-2.42-.7-3.53-1.5a16.15 16.15 0 0 1-5.26-6.88 26.86 26.86 0 0 1 1.44-23.62A26.72 26.72 0 0 1 23.84.19C30.62-.54 38.69 1.6 44.89 5.8c6.29 4.24 10.52 12.13 11.06 20.59.5 7.91-2.99 17.34-10.64 20.07a62.26 62.26 0 0 1-4.07 1.25Zm1.65-4.32a15.73 15.73 0 0 0 7.9-10.19c1.04-4.34.2-9.3-2.26-13.26a11.15 11.15 0 0 0-3.1-3.45c-1.87-1.27-4.15-1.67-6.16-2.01l-5.55-.95c-2.55-.44-5.19-.89-7.44-2.24-2.42-1.45-3.93-3.89-3.85-6.21a.44.44 0 0 0-.42-.47.44.44 0 0 0-.45.43 7.52 7.52 0 0 0 1.95 5.07c-.33.8-.79 1.27-1.48 1.93-.73.7-1.58 1.29-2.4 1.87h-.02l-3.67 2.58-.05.03c-.97.69-1.98 1.4-2.86 2.27a9.52 9.52 0 0 0-1.9 2.83 9.9 9.9 0 0 1 1.13-5.76.46.46 0 0 0-.16-.62.43.43 0 0 0-.6.17 10.88 10.88 0 0 0-1.22 6.5 1.4 1.4 0 0 0-.87.57 3.8 3.8 0 0 0-.49 1.86c-.18 2.3-.39 4.9.36 7.3.07.23.15.49.29.74.48.9 1.18 1.4 2 1.4.36 3.45 1.2 6.94 1.92 8.68.96 2.28 2.72 5.37 5.7 7.1a18.4 18.4 0 0 0 9.2 2.45c5.37 0 10.8-2.33 13.98-7.7.18-.3.36-.6.52-.92Zm.7-1.44a14.9 14.9 0 0 0 6.35-8.97c.99-4.1.19-8.8-2.14-12.55a10.29 10.29 0 0 0-2.85-3.18c-1.71-1.17-3.9-1.55-5.82-1.88l-5.55-.95h-.01c-2.5-.43-5.34-.91-7.73-2.35a9.7 9.7 0 0 1-1.68-1.27 6.69 6.69 0 0 1-1.54 1.9c-.78.75-1.67 1.37-2.52 1.97l-3.67 2.57c-.96.67-1.96 1.37-2.8 2.2a8.34 8.34 0 0 0-1.95 3.22.44.44 0 0 1-.26.28.42.42 0 0 1-.28.01h-.04a.44.44 0 0 1-.09-.06c-.27-.2-.72-.14-.88.1-.26.39-.3.94-.34 1.42-.18 2.22-.37 4.73.32 6.96.05.18.12.39.22.57.3.57.7.89 1.15.94a24.62 24.62 0 0 1-.03-4.07c.02-.25.24-.44.47-.41.24.02.42.24.4.49-.35 3.88.8 10.4 1.97 13.2.9 2.16 2.56 5.07 5.32 6.68 6.81 3.98 17.17 3.21 22.02-4.95 3.34-5.61 3.65-11.92 3.51-17.4 0-.24.18-.4.43-.4.24 0 .44.14.44.39.05 1.87.05 3.83-.11 5.84h.06c.14.02.3-.06.43-.2.13-.15.22-.36.3-.65.13-.42.19-.88.24-1.33v-.05c.23-1.75.45-3.56.49-5.35 0-.25 0-.47-.07-.65-.1-.29-.38-.46-.53-.54a2.73 2.73 0 0 0-.59-.2.36.36 0 0 1-.24.1h-.01c-.24 0-.44-.28-.44-.52a12.2 12.2 0 0 0-.6-3.24c-.2-.48-.46-.96-.76-1.38-.14-.2-.1-.5.1-.65.19-.14.46-.1.6.1.34.47.63.99.85 1.53.31.75.58 2.2.66 3.17.27.06.55.15.82.28.46.24.8.6.96 1.02.12.33.13.66.12 1a50.78 50.78 0 0 1-.48 5.46l-.01.04c-.06.48-.12.97-.26 1.46a2.4 2.4 0 0 1-.5 1 1.4 1.4 0 0 1-1.04.52h-.01l-.11-.01-.06-.01c-.3 2.93-.93 5.92-2.22 8.8ZM32.63 20.6h-.04a.87.87 0 0 1-.7-.36.7.7 0 0 1-.07-.61.99.99 0 0 1 .03-.1c.23-.57.9-.95 1.4-1.06a4.6 4.6 0 0 1 1.42-.07h.32c1.26.03 2.2.13 3.58.3a3.53 3.53 0 0 1 2.13 1.01l.06.06.03.03c.15.15.37.38.45.42.06.02.1.19.1.26 0 .08-.06.26-.14.26l-.41-.23h.16a11.65 11.65 0 0 0-7.53-.1l-.03.02-.04.01c-.24.08-.46.16-.72.16Zm8.16-.09h-.03v-.01l.03.01Zm-22.94 3.57a13 13 0 0 0 2.27.26 5 5 0 0 0 1.44-.2c.2-.05.47-.15.69-.34.25-.2.38-.51.38-.83a1 1 0 0 0-.4-.77 1.76 1.76 0 0 0-.75-.31c-.92-.2-1.8-.27-2.59-.2-.62.06-1.5.2-1.96.63a.95.95 0 0 0-.33.72c0 .32.2.63.5.8.24.15.5.2.72.23h.02Zm2.87-.48c.04-.38.1-.9-.05-1.25.23.03.46.07.7.13.17.04.38.09.52.2.13.1.16.22.16.3 0 .14-.06.27-.17.36-.14.12-.33.18-.48.23-.22.06-.45.11-.7.14l.01-.07.01-.04Zm-2.78-.12.95.16a2.69 2.69 0 0 1 .05-1.34c-.83.08-1.38.24-1.63.47-.11.1-.13.2-.13.26 0 .1.09.22.21.3.15.08.35.12.55.15Zm18.15.86a5 5 0 0 1-1.45-.19 2 2 0 0 1-.69-.34 1.06 1.06 0 0 1-.38-.83 1 1 0 0 1 .4-.78c.22-.17.49-.25.75-.3a8.1 8.1 0 0 1 2.59-.2c.62.06 1.5.2 1.97.62.21.2.32.45.32.72 0 .32-.2.63-.5.8a2.1 2.1 0 0 1-.72.24h-.01c-.7.13-1.5.27-2.29.27Zm-.52-2c-.23.04-.48.08-.73.14-.18.04-.38.1-.53.2a.4.4 0 0 0-.16.3c0 .14.06.27.17.36.14.12.33.19.48.23.31.1.65.15 1.01.17a2.5 2.5 0 0 1-.24-1.4Zm1.95-.01v.3l-.01.26c0 .1 0 .19-.02.29-.01.17-.05.32-.1.45.3-.04.6-.1.87-.15h.05c.18-.04.36-.07.5-.16.12-.07.2-.18.21-.29 0-.06-.01-.15-.13-.25-.22-.21-.69-.36-1.37-.45ZM24.4 20.59c-.3 0-.57-.09-.84-.17l-.07-.02a14.04 14.04 0 0 0-4.02-.57c-1.52 0-2.98.23-4.36.67a.14.14 0 0 1-.18-.1.15.15 0 0 1 .1-.18c.07-.03.31-.27.49-.43l.04-.04.03-.03.32-.28a4 4 0 0 1 2.03-.74c1.5-.18 2.52-.27 3.89-.3h.23a11.54 11.54 0 0 1 1.65.06c.56.1 1.28.49 1.53 1.06.01.03.03.06.03.1.08.2.05.42-.06.59a.94.94 0 0 1-.77.38h-.04Zm3.57 11.85c.16.28.46.54.82.54h.14a.93.93 0 0 0 .66-.58l.04-.1c.21.2.48.3.74.29.34-.03.66-.27.83-.62.13-.25.18-.55.17-.92-.02-.46-.11-.9-.2-1.32l-.04-.15c-.6-2.8-.77-5.66-.52-8.51a.3.3 0 0 0-.27-.33.3.3 0 0 0-.31.27c-.26 2.92-.08 5.84.54 8.7l.03.15v.03c.1.4.17.78.19 1.17 0 .27-.03.48-.1.63-.09.17-.23.28-.36.3-.2 0-.4-.2-.5-.4a2.93 2.93 0 0 1-.18-.59 5.06 5.06 0 0 0-.1-.38.29.29 0 0 0-.36-.2.3.3 0 0 0-.2.38c.09.28.13.57.14.86 0 .22-.02.37-.07.49s-.14.2-.23.22c-.12.03-.27-.07-.36-.23a2 2 0 0 1-.16-.68l-.06-.5c-.02-.16-.16-.28-.3-.27a.3.3 0 0 0-.28.3c0 .29-.02.61-.15.85-.09.17-.3.31-.45.25a.43.43 0 0 1-.17-.17c-.17-.28-.16-.67-.13-1.01.05-.7.19-1.4.32-2.07l.04-.21.16-.83a8.3 8.3 0 0 0 0-3.3.29.29 0 0 0-.35-.2.3.3 0 0 0-.21.36 7.57 7.57 0 0 1-.02 3.03l-.19 1.02c-.14.7-.28 1.42-.34 2.14-.03.45-.03.96.23 1.39.11.19.26.33.43.4.39.17.8-.02 1.06-.33l.07.13ZM5.16 23.1h-.03a.3.3 0 0 1-.26-.33c.2-2.2 1.32-4.46 3.2-6.52a17.9 17.9 0 0 1 3.8-3.15c.67-.41 1.38-.78 2.07-1.14.8-.43 1.64-.87 2.4-1.38 1.66-1.08 2.73-2.34 3.2-3.73a.29.29 0 0 1 .37-.19.3.3 0 0 1 .18.4c-.51 1.51-1.67 2.87-3.44 4.04-.78.5-1.6.95-2.4 1.37l-.05.02-.11.06c-.64.34-1.3.69-1.92 1.07a17.28 17.28 0 0 0-3.67 3.04c-1.26 1.37-2.8 3.55-3.06 6.17a.3.3 0 0 1-.29.28Zm39.03-8.96a.3.3 0 0 0 .24.13c.06 0 .12-.01.17-.05a.3.3 0 0 0 .08-.42 7.1 7.1 0 0 0-3.92-2.78 17.61 17.61 0 0 0-4.67-.6l-.48-.01h-.02a23.25 23.25 0 0 1-4.07-.36 11.73 11.73 0 0 1-6.15-3.52.85.85 0 0 1-.23-.35.3.3 0 0 0-.35-.22.3.3 0 0 0-.22.36c.06.27.23.46.38.63a12.3 12.3 0 0 0 6.45 3.69c1.38.29 2.8.33 4.18.37h.02l.47.01c1.48.05 3.06.13 4.52.58a6.52 6.52 0 0 1 3.6 2.54ZM14.38 45.72c.05.04.1.06.17.06.09 0 .18-.04.23-.13a.31.31 0 0 0-.07-.42 22.12 22.12 0 0 1-8.44-14.25.29.29 0 0 0-.33-.25.3.3 0 0 0-.24.35 22.74 22.74 0 0 0 8.68 14.64Zm34.04-30.06a.29.29 0 0 1-.26-.17 13.21 13.21 0 0 0-6.48-6.54c-1.94-.87-4.12-1.25-6.22-1.62h-.04c-2.81-.5-5.72-1-8.12-2.7a.3.3 0 0 1-.08-.42c.1-.14.27-.17.4-.08 2.3 1.61 5 2.09 7.86 2.6h.04c2.15.37 4.37.76 6.39 1.67a13.82 13.82 0 0 1 6.77 6.84.3.3 0 0 1-.14.4.28.28 0 0 1-.12.03ZM33.97 38.88a.3.3 0 0 1 .38.16.3.3 0 0 1-.15.4c-1.16.5-2.45.83-3.91.98-.15.44-.4.84-.75 1.15a3.06 3.06 0 0 1-2.56.69 2.27 2.27 0 0 1-1.35-.64 2.52 2.52 0 0 1-.38-.54 2.79 2.79 0 0 1-.32-.96 5.8 5.8 0 0 1-2.83-1.67.31.31 0 0 1 .02-.43c.12-.11.3-.1.4.02.6.66 1.4 1.15 2.43 1.46.06-.27.2-.52.33-.75.17-.3.37-.6.67-.8.33-.23.75-.27 1.06-.09.14.09.25.21.36.34.11.13.21.24.34.3.23.09.5-.05.78-.2h.01c.25-.14.5-.28.8-.28h.04c.5.03.86.5 1 .97.07.26.1.54.07.82a12.3 12.3 0 0 0 3.56-.93Zm-7.54 1.16c.77.27 1.58.42 2.4.42.08 0 .15-.07.15-.15 0-.08-.06-.15-.14-.15a7.59 7.59 0 0 1-2.32-.4.14.14 0 0 0-.19.09c-.02.08.02.16.1.2Z" fill="currentColor"></path></svg>` : `${faceId === 7 ? `<svg width="56" height="57" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M24.34 44.25a1.62 1.62 0 0 1-1.39-.83c-.37.22-.86.37-1.36.14-.62-.3-.8-1.02-.64-1.59.1-.4.34-.73.54-1.02l.14-.2c1.26-1.9 1.23-4.3 1.06-7a.44.44 0 0 1 .42-.45c.25-.02.47.16.48.4.17 2.85.2 5.39-1.2 7.51-.06.07-.1.15-.15.22-.18.26-.35.5-.42.75-.06.23 0 .52.17.6.19.1.52-.06.95-.43a.47.47 0 0 1 .5-.06c.17.08.27.25.25.43-.02.15.04.3.17.44a.7.7 0 0 0 .52.22c.37-.02.72-.4.72-.78 0-.23.19-.42.42-.43.24-.01.45.15.48.37 0 .1.11.16.17.19.16.07.36.07.48-.01.33-.2.41-.68.35-1.04a4.13 4.13 0 0 0-.45-1.16l-.13-.24c-.99-2-1.38-4.3-1.09-6.5.03-.24.25-.4.5-.38.25.03.42.24.39.48a10.8 10.8 0 0 0 1 6.02l.13.24c.22.44.45.89.54 1.4.13.8-.17 1.53-.75 1.9a1.48 1.48 0 0 1-1.41.03 1.7 1.7 0 0 1-1.31.77h-.07v.01Zm6.73-10.12c-.56 0-1.14-.01-1.7-.05-1.17-.07-1.34-.67-1.36-.85-.07-.51.39-1 1.14-1.23a5.76 5.76 0 0 1 1.69-.23c1.05 0 2.08.2 2.76.37.18.05.36.1.51.24a.7.7 0 0 1 .26.6 1 1 0 0 1-.39.76c-.35.27-.8.32-1.2.34-.57.04-1.14.06-1.7.06h-.01Zm-.24-1.78c-.57 0-1.08.06-1.5.2-.54.16-.75.45-.73.61.02.15.28.31.8.35 1.1.07 2.23.07 3.33 0 .34-.02.65-.05.87-.22.1-.08.17-.2.17-.33 0-.06-.01-.12-.06-.15a.74.74 0 0 0-.26-.1c-.65-.17-1.62-.36-2.61-.36ZM17.97 34.2h-.3l-2.15-.06c-.68-.02-1.73-.4-1.93-1.05-.07-.22-.09-.65.55-1.07.32-.22.84-.32 1.64-.32.56 0 1.17.05 1.7.1.41.03.77.06 1.01.06h.11c.37 0 .75.04 1.04.29.22.19.33.47.3.77-.03.38-.26.76-.58.97-.44.27-.94.31-1.38.31Zm-2.2-1.92c-.8 0-1.15.12-1.3.21-.17.11-.36.28-.31.44.09.3.8.62 1.37.63l2.15.06h.3c.34 0 .74-.02 1.04-.21.18-.11.3-.33.32-.53.01-.1 0-.22-.1-.3-.14-.13-.4-.14-.64-.14h-.11c-.27 0-.64-.03-1.07-.07-.52-.04-1.11-.09-1.65-.09Zm4.34-1.86c-.41.2-.9.11-1.36.02l-2.62-.5c-1.23-.24-2.69-.42-3.57.44.84-.75 2.03-1 3.16-1.2 1.15-.18 2.32-.35 3.48-.48a3 3 0 0 1 1.21.07c.12.53.39 1.33-.3 1.65Z" fill="currentColor"></path><path d="M19.52 30.68c-.27 0-.53-.04-.8-.1l-2.63-.5a8.98 8.98 0 0 0-1.63-.2c-.62 0-1.11.12-1.5.37l-.3.24a.15.15 0 0 1-.2 0 .14.14 0 0 1 0-.2c.1-.1.2-.2.33-.28.84-.58 1.9-.8 2.9-.96a64.29 64.29 0 0 1 4-.52c.28 0 .53.03.76.1.06.02.1.06.1.11l.04.13c.13.53.32 1.34-.41 1.68-.2.09-.4.13-.66.13Zm-5.06-1.08c.6 0 1.22.1 1.7.2l2.62.5c.47.1.94.14 1.27 0 .48-.23.4-.75.25-1.36l-.01-.05a2.85 2.85 0 0 0-1.07-.04c-1.16.13-2.33.29-3.48.48-.43.07-.87.15-1.3.27h.02Zm13.63.82c.42.2.91.11 1.36.02l2.63-.5c1.23-.24 2.68-.42 3.56.44-.84-.75-2.02-1-3.15-1.2A81.29 81.29 0 0 0 29 28.7a3 3 0 0 0-1.2.07c-.13.53-.4 1.33.3 1.65h-.01Z" fill="currentColor"></path><path d="M28.68 30.68c-.25 0-.46-.04-.66-.13-.73-.34-.54-1.15-.4-1.68l.02-.13c.02-.05.06-.1.1-.1.24-.08.5-.1.76-.1.16 0 .32 0 .52.02 1.16.13 2.34.3 3.49.49 1 .17 2.06.38 2.9.96a2 2 0 0 1 .34.27c.05.06.05.15 0 .2a.15.15 0 0 1-.21 0l-.3-.23a2.73 2.73 0 0 0-1.5-.37c-.57 0-1.17.1-1.63.2l-2.63.5c-.27.06-.53.1-.8.1Zm-.77-1.8v.06c-.16.6-.24 1.13.24 1.36.32.14.8.1 1.27 0l2.62-.5c.48-.1 1.1-.2 1.72-.2-.43-.12-.87-.2-1.3-.27a67.67 67.67 0 0 0-3.48-.48 2.94 2.94 0 0 0-1.07.04Zm3.84 14.69c-.22.04-.44 0-.62-.07a.28.28 0 0 0-.15-.12h-.1c-.23-.13-.45-.3-.67-.47a.3.3 0 0 0-.42.04c-.1.13-.08.3.04.4.22.18.45.35.7.5-.28.93-.72 2.11-1.36 2.98a6.6 6.6 0 0 1-.5.6 2.4 2.4 0 0 1-1.47-.2 2.6 2.6 0 0 0-.92-.24.92.92 0 0 0-.5.14c-.13.08-.23.19-.33.3-.1.1-.2.21-.32.26-.17.08-.42.01-.67-.07a1.68 1.68 0 0 0-1.73.28c-.27.22-.48.54-.63.91a7.19 7.19 0 0 1-1.86-.74c-.59-.33-1.13-.76-1.66-1.17a.31.31 0 0 0-.42.04c-.1.12-.08.3.05.4.54.43 1.1.87 1.72 1.22.68.4 1.42.68 2.18.85l.02.03a3.74 3.74 0 0 0 4.95.57 5.55 5.55 0 0 0 1.47-1.7 5.3 5.3 0 0 0 1.1-1.15c.67-.9 1.13-2.12 1.43-3.08a1.9 1.9 0 0 0 .77.06.29.29 0 0 0 .24-.34.3.3 0 0 0-.35-.23Zm-5.78 5.56a5.33 5.33 0 0 1-1.88.16c-.09 0-.15-.08-.14-.15 0-.08.09-.14.16-.13.6.06 1.2 0 1.78-.15.07-.02.16.02.18.1a.14.14 0 0 1-.1.18Zm-14.13-5.74c-.82 0-1.66-.44-2.18-1.18a4.4 4.4 0 0 1-.7-2.67c0-.38.04-.78.06-1.15.04-.47.07-.91.06-1.36-.03-1.01-.3-2-.53-2.74l-.06-.2c-.36-1.14-.77-2.43-.24-3.61.13-.3.3-.53.52-.7a1.5 1.5 0 0 1 1.2-.26c.44.1.8.35.99.7.1.22.02.48-.2.59a.46.46 0 0 1-.6-.2.53.53 0 0 0-.38-.24.55.55 0 0 0-.45.08c-.1.07-.18.2-.25.37-.4.9-.06 1.98.27 3.02l.06.2c.25.8.54 1.85.57 2.97.01.49-.02.97-.06 1.44-.03.36-.05.73-.05 1.1-.01.93.16 1.64.53 2.17.37.51 1.1.94 1.78.76a.43.43 0 1 1 .24.83c-.19.05-.38.07-.57.07Zm25.74-.66c-.19 0-.38-.03-.55-.1a.43.43 0 0 1-.23-.57c.1-.22.36-.32.58-.23.14.05.3.05.47-.02.27-.12.52-.37.62-.66.17-.45.13-.98.09-1.53 0-.13-.02-.26-.03-.38-.08-1.54.2-3.06.49-4.53.22-1.19.46-2.42.48-3.63 0-.16 0-.35-.06-.45-.06-.1-.22-.18-.4-.19-.23 0-.47.06-.73.14a.45.45 0 0 1-.57-.28.43.43 0 0 1 .3-.54c.32-.1.67-.2 1.04-.18.5.03.92.26 1.13.61.19.3.2.63.19.9-.02 1.29-.27 2.55-.5 3.78-.28 1.48-.55 2.89-.47 4.32l.03.36c.04.62.1 1.26-.14 1.89-.19.5-.61.95-1.1 1.16-.22.08-.43.13-.64.13Z" fill="currentColor"></path><path d="M24 56a9.63 9.63 0 0 1-5.1-1.45c-3.88-2.39-5.71-7.62-7-12.43-1.14-4.3-1.7-9.14-1.77-15.26 0-.24.2-.43.44-.43s.45.19.45.43c.07 6.04.63 10.82 1.76 15.05 1.23 4.65 2.99 9.69 6.6 11.91 4.58 2.82 10 .74 12.98-2.76 5.46-6.42 5.37-15.49 5.29-23.49v-.3c0-.25.2-.44.44-.44.25 0 .45.19.45.43v.3c.09 8.15.18 17.39-5.49 24.04C30.88 54.16 27.5 56 24 56Z" fill="currentColor"></path><path d="M18 32.65c-.21-.41-.7-.66-1.18-.7-.2-.01-.4 0-.59.09a1 1 0 0 0-.47.5c-.1.22-.12.45-.14.68 0 .15 0 .3.1.4.08.08.18.1.28.12.45.1.9.18 1.36.24.37.04.6.02.7-.34.08-.33.1-.69-.06-1v.01Zm14.4.22a.93.93 0 0 0-.5-.76c-.21-.1-.46-.1-.69-.09-.12 0-.23.02-.35.05a.86.86 0 0 0-.5.47c-.1.2-.12.44-.1.67 0 .14.02.29.1.4.17.22.5.24.78.24h.93c.31 0 .34-.77.32-.98Zm9.56 7.86h-.04a.29.29 0 0 1-.24-.33c1.17-7.88 1.96-16.4-.2-25.29-.82-3.42-2.28-7.55-6.21-9.04-1.92-.73-5.04-.76-7.05.6a3.53 3.53 0 0 0-1.65 2.97c0 .16-.14.3-.3.28a.29.29 0 0 1-.28-.29 4.14 4.14 0 0 1 1.9-3.44c2.18-1.47 5.52-1.43 7.57-.66 4.19 1.6 5.71 5.89 6.58 9.45 2.17 8.99 1.38 17.57.2 25.51a.28.28 0 0 1-.28.25Z" fill="currentColor"></path><path d="M45.73 49.97a.46.46 0 0 1-.24-.06 6.4 6.4 0 0 1-3.15-5.21.45.45 0 0 1 .9-.03 5.59 5.59 0 0 0 1.94 3.93c-.25-2.85.12-5.73.47-8.52l.2-1.56c.8-6.65 1.6-14.36 1.1-21.64-.4-5.72-1.84-9.56-4.66-12.45C39.51 1.58 35.65.3 32.22 1.1c-3.34.78-6.16 3.22-7.18 6.21a.45.45 0 0 1-.56.28.42.42 0 0 1-.29-.55c1.1-3.26 4.18-5.92 7.82-6.78 3.74-.87 7.93.5 10.94 3.58 3.85 3.94 4.64 9.3 4.9 12.98.5 7.36-.3 15.1-1.1 21.8l-.2 1.56c-.4 3.07-.8 6.24-.37 9.3a.42.42 0 0 1-.2.42.44.44 0 0 1-.25.07Z" fill="currentColor"></path><path d="M43.94 38.46h-.02a.3.3 0 0 1-.28-.3c.6-7.75 1.23-15.75-.1-23.54-.49-2.82-1.47-6.83-4.5-9.1a8.69 8.69 0 0 0-7.92-1.18.3.3 0 0 1-.39-.17.28.28 0 0 1 .18-.37c2.8-1 6.13-.5 8.49 1.26 3.2 2.4 4.22 6.55 4.72 9.46 1.34 7.86.72 15.9.11 23.67a.3.3 0 0 1-.3.27h.01ZM27.15 5.55a.29.29 0 0 1-.17-.05.28.28 0 0 1-.07-.4c.68-.9 1.56-1.7 2.55-2.28a4.49 4.49 0 0 1 2.66-.75c.17.01.29.15.27.31a.3.3 0 0 1-.32.26 3.86 3.86 0 0 0-2.3.66 8.23 8.23 0 0 0-2.38 2.13.3.3 0 0 1-.24.12Zm14.1.05a.3.3 0 0 1-.23-.1 8.74 8.74 0 0 0-2.45-2.05.28.28 0 0 1-.1-.4.3.3 0 0 1 .4-.1 9.4 9.4 0 0 1 2.61 2.19c.1.12.08.3-.05.4a.3.3 0 0 1-.19.07V5.6Zm4.64 11.94a.3.3 0 0 1-.3-.26c-.23-2.36-.75-4.7-1.54-6.94a.29.29 0 0 1 .2-.36.3.3 0 0 1 .37.18c.8 2.28 1.33 4.66 1.57 7.06.01.16-.1.3-.27.31h-.03Z" fill="currentColor"></path><path d="M35.71 9.47a.3.3 0 0 1-.35-.08 8.73 8.73 0 0 0-2.67-2.27 3.9 3.9 0 0 0-3.32-.19.3.3 0 0 1-.4-.13.29.29 0 0 1 .14-.39 4.53 4.53 0 0 1 3.85.2 9.38 9.38 0 0 1 2.86 2.41.28.28 0 0 1-.11.45Zm4.98 18.91a.3.3 0 0 1-.3-.28c-.03-4.93-.08-10.02-1.7-14.78a.29.29 0 0 1 .2-.37.3.3 0 0 1 .37.19c1.65 4.84 1.7 9.98 1.73 14.96a.3.3 0 0 1-.3.28Zm2.29 26.52a.31.31 0 0 1-.18-.05c-2.53-1.87-3.68-3.68-4.77-6.56a.28.28 0 0 1 .18-.37.3.3 0 0 1 .38.17c.9 2.37 1.57 3.73 3.5 5.44-.23-.66-.37-1.35-.48-2.03a53.58 53.58 0 0 1-.46-7.97.3.3 0 0 1 .3-.29c.16 0 .3.13.3.28.02 2.6.04 5.3.45 7.9a7.38 7.38 0 0 0 1.03 3.04c.08.12.06.27-.04.37a.3.3 0 0 1-.2.07h-.01Z" fill="currentColor"></path><path d="M40.55 48.76a.3.3 0 0 1-.3-.24c-.5-2.98-.55-6-.13-8.98a.3.3 0 0 1 .33-.25.3.3 0 0 1 .26.32 28.6 28.6 0 0 0 .13 8.81c.03.16-.08.3-.24.33h-.05Zm-2.32 3.76c-.36-.1-.59-.4-.76-.7a12.2 12.2 0 0 1-1.54-3.74.29.29 0 0 1 .23-.34c.16-.04.32.06.35.22a11.7 11.7 0 0 0 1.35 3.37c0-1.57.05-2.58.13-3.89a.3.3 0 0 1 .32-.27.3.3 0 0 1 .28.3c-.1 1.6-.16 2.72.1 4.71.01.1 0 .2-.07.27a.3.3 0 0 1-.26.1l-.13-.03ZM11.97 27.56h-.16a2.06 2.06 0 0 1-1.45-.78c-.3-.4-.4-.87-.47-1.28-.54-3.24-.12-6.5 1.29-8.88 2.78-4.68 6.44-5.12 10.17-6.36.23-.08.49.04.57.26a.42.42 0 0 1-.28.55c-3.51 1.17-7.15 1.5-9.67 5.96-1.27 2.25-1.7 5.28-1.19 8.33.06.33.12.67.3.91.17.23.5.4.8.42.16.01.39 0 .55-.16a.46.46 0 0 1 .63 0c.18.17.17.45 0 .61-.28.27-.67.41-1.09.41v.01Z" fill="currentColor"></path><path d="M15.71 27.22c-.35 0-.7-.06-1.01-.2a2.86 2.86 0 0 1-1.54-1.8 6.03 6.03 0 0 1-.18-2.13c.1-2.26.43-3.92 1.06-5.39a8.33 8.33 0 0 1 3.88-4.24c.22-.11.5-.04.61.16.12.2.04.45-.18.56A7.48 7.48 0 0 0 14.88 18a14.2 14.2 0 0 0-1 5.12 5.6 5.6 0 0 0 .14 1.87c.2.6.58 1.07 1.07 1.29.59.25 1.38.1 1.81-.34a.48.48 0 0 1 .63-.04c.2.14.2.4.05.58a2.6 2.6 0 0 1-1.87.74Z" fill="currentColor"></path><path d="m19.93 26.57-.24-.02a2.26 2.26 0 0 1-1.44-.96c-.8-1.2-.75-2.67-.7-3.86l.24-6.59c.01-.22.21-.4.47-.4.25.02.44.2.43.43l-.25 6.59c-.04 1.07-.08 2.4.58 3.4.19.28.54.53.82.57.17.03.26-.02.31-.06.16-.11.22-.36.27-.61.27-1.34.29-2.76.3-4.12.03-1.83.06-3.72.66-5.51.07-.22.32-.34.56-.27.24.06.37.3.3.51-.57 1.68-.6 3.43-.62 5.27-.02 1.4-.03 2.85-.31 4.26-.09.4-.21.83-.6 1.11a1.3 1.3 0 0 1-.77.25Z" fill="currentColor"></path><path d="M22.91 27.36c-.36 0-.73-.12-1.03-.34a.42.42 0 0 1-.08-.6.46.46 0 0 1 .62-.08c.23.16.56.2.82.09.48-.21.72-.82.75-1.92.07-2.09.06-4.36-.02-6.95a5.33 5.33 0 0 0-.34-2.06 2.6 2.6 0 0 0-1.34-1.27.43.43 0 0 1-.23-.57c.1-.22.36-.32.59-.22.8.33 1.44.95 1.8 1.71.37.8.4 1.68.42 2.39.08 2.6.09 4.9.02 7-.03.92-.2 2.2-1.28 2.68-.22.1-.46.14-.7.14Zm2.95-.02a.44.44 0 0 1-.45-.38.44.44 0 0 1 .4-.48c.9-.11 1.75-.77 2.04-1.6.16-.46.18-.98.2-1.48.06-1.75.13-3.55-.22-5.27a7.55 7.55 0 0 0-2.43-4.4.42.42 0 0 1-.06-.61c.16-.18.45-.2.64-.05a8.36 8.36 0 0 1 2.73 4.9c.36 1.81.3 3.66.23 5.45-.02.54-.04 1.14-.25 1.72a3.4 3.4 0 0 1-2.78 2.19h-.06Z" fill="currentColor"></path><path d="M30.5 27.22c-.43 0-.85-.08-1.22-.24-.22-.08-.44-.3-.44-.56 0-.2.13-.36.33-.44.23-.08.49 0 .59.21l.03.11c.5.16 1.08.14 1.63-.06.6-.22 1.06-.62 1.27-1.1.2-.48.2-1.01.2-1.61a49.78 49.78 0 0 0-.18-3.21c-.16-1.87-.55-3.92-2.18-4.99a8.05 8.05 0 0 0-1.78-.77c-.24-.08-.35-.31-.26-.52.09-.2.35-.31.58-.23.67.23 1.37.47 1.98.87 1.95 1.26 2.4 3.64 2.56 5.57.1 1.08.16 2.18.18 3.26.01.66 0 1.3-.26 1.91a3 3 0 0 1-1.77 1.56c-.4.15-.83.23-1.25.23h-.01Z" fill="currentColor"></path><path d="M36.27 27.03c-.13 0-.26 0-.38-.02a2.33 2.33 0 0 1-1.68-.92.42.42 0 0 1 .12-.6c.2-.14.48-.09.62.11.21.3.58.5 1.05.55.6.07 1.29-.11 1.69-.46 1.06-.92.97-2.89.67-3.64-2.92-7.49-2.6-9.94-6.54-10.31a.44.44 0 0 1-.4-.48c.03-.23.25-.4.5-.38 4.32.41 4.5 2.97 7.33 11.01.4 1.12.4 3.27-.96 4.44a3.1 3.1 0 0 1-2.02.7Z" fill="currentColor"></path><path d="M32.28 8.14a2.74 2.74 0 0 0-1.61-1.95.12.12 0 0 0-.1.01l-.14.08a.14.14 0 0 0-.07.12c0 .06.02.1.06.13.34.2.49.37.48.57-.01.16-.16.29-.3.34-.16.07-.34.07-.55.06a28.9 28.9 0 0 1-4.03-.42 3.63 3.63 0 0 1-1.59-.56c-.05-.04-.12-.1-.14-.16 0-.03 0-.07.02-.07.06-.03.1-.1.09-.17a.13.13 0 0 0-.14-.1l-.24.02h-.04c-.6.3-1.1.87-1.4 1.58a4.8 4.8 0 0 0-.32 2.1c.05.83.26 1.46.65 1.87.43.46 1.04.63 1.63.78.93.22 1.76.38 2.54.48a15 15 0 0 0 2.8.12c.52-.03 1.05-.1 1.48-.44.55-.43.76-1.15.88-1.74.22-1.04.23-1.9.04-2.64v-.01ZM23.9 11.3a.14.14 0 0 1-.09.02.12.12 0 0 1-.1-.07 1.26 1.26 0 0 1-.12-.83c.02-.08.09-.13.16-.12.07.02.12.09.1.17-.04.21 0 .44.1.63.03.07.01.16-.05.2Zm.39-1.77c-.02.08-.09.18-.16.17-.08 0-.12-.14-.1-.22l.26-1.27c.02-.07.09-.14.16-.13.08.02.12.12.1.2l-.26 1.25Zm1.04 1.35c0 .08-.09.13-.16.12-.08 0-.14-.08-.13-.16l.15-1.04c.01-.08.1-.13.17-.12.07 0 .13.08.12.16l-.15 1.04Zm.58-1.98c-.01.08-.1.13-.17.12-.07 0-.14-.08-.12-.16l.09-.65c0-.08.09-.13.16-.12.08 0 .14.08.13.16l-.09.65Zm.2 2.49c0 .08-.07.13-.15.12a.14.14 0 0 1-.11-.16l.02-.18c.02-.08.09-.14.16-.13.07.02.13.08.11.16l-.02.19Zm.87-1.63c-.01.08-.1.13-.17.12-.07 0-.14-.08-.12-.16l.12-.87c.01-.08.1-.13.17-.12.07 0 .13.08.12.16l-.12.87Zm.27 2.3c-.01.09-.1.14-.17.13-.07 0-.14-.08-.12-.16l.07-.54c.01-.08.1-.13.17-.13.07.01.14.09.13.16l-.08.55Zm.91-2.76c.02-.08.09-.14.16-.12.08.01.12.09.1.17-.06.35-.1.7-.09 1.06 0 .08-.06.15-.13.15h-.02c-.07 0-.12-.07-.12-.14 0-.38.03-.75.1-1.12Zm-.18 2.78h-.01c-.07 0-.12-.07-.12-.14l.03-.4c0-.07.07-.13.14-.13.08 0 .14.07.13.15l-.03.4c0 .07-.07.13-.14.13Zm1.45-.73c-.01.08-.1.13-.17.13-.07-.01-.14-.09-.13-.16l.14-.93c0-.08.09-.13.16-.12.08 0 .14.08.13.16l-.13.92Zm.82-1.8c-.08-.02-.14-.05-.13-.13l.07-.91c0-.08.07-.13.14-.13.08 0 .14.08.13.16l-.07.9c0 .08-.07.12-.14.1Zm.4 1.97a.14.14 0 0 1-.13.06l-.06-.02a.14.14 0 0 1-.02-.2c.16-.24.27-.5.33-.78a.15.15 0 0 1 .16-.12c.07.02.12.1.1.17-.06.32-.2.63-.38.89Zm.83-2.37h-.04a.14.14 0 0 1-.12-.11l-.12-.73a.15.15 0 0 1 .11-.17c.07-.02.14.03.16.11l.12.73a.15.15 0 0 1-.11.17Z" fill="currentColor"></path></svg>` : `${faceId === 8 ? `<svg width="56" height="56" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M28.61 56c-.2 0-.4 0-.59-.02-4.06-.26-7.4-3.06-9.57-5.15a23.93 23.93 0 0 1-3.06-3.48 22.67 22.67 0 0 1-2.16-4.1A42.4 42.4 0 0 1 9.94 26c0-.26.23-.46.5-.46.26 0 .46.22.46.48a41.41 41.41 0 0 0 3.2 16.86 21.38 21.38 0 0 0 2.08 3.93 22.73 22.73 0 0 0 2.94 3.34c2.05 1.98 5.21 4.64 8.96 4.88 3.17.2 6.56-1.42 9.08-4.34 2.17-2.52 3.52-5.58 4.87-9.4 1.68-4.73 3.31-10.31 2.69-15.83a.48.48 0 0 1 .95-.1c.64 5.7-1.02 11.41-2.74 16.25-1.39 3.91-2.78 7.06-5.04 9.7C35.33 54.26 31.9 56 28.6 56Z" fill="currentColor"></path><path d="M10.42 26.5a.47.47 0 0 1-.4-.73c.6-.94.67-2.09.74-3.31l.1-1.35c.21-1.7.43-3.45 1.35-4.97.92-1.5 2.86-2.76 4.75-2.22.88.24 1.56.8 2.22 1.34.23.2.46.38.69.54.7.52 1.8.96 2.53.48a.48.48 0 0 1 .66.14c.14.22.08.51-.14.66-1.14.74-2.62.22-3.63-.52-.25-.18-.5-.38-.73-.57a5.4 5.4 0 0 0-1.86-1.16c-1.44-.4-2.94.6-3.67 1.8-.82 1.34-1.02 3-1.22 4.6-.05.41-.07.85-.1 1.28-.07 1.29-.15 2.62-.89 3.76a.48.48 0 0 1-.4.22Z" fill="currentColor"></path><path d="M9.01 25.29a.47.47 0 0 1-.47-.46l-.22-7.97c-.06-1.9-.11-3.86.45-5.75.28-.97.75-1.95 1.4-3.01A17.27 17.27 0 0 1 19.06.9a15.6 15.6 0 0 1 11.45.4c2.96 1.32 5.16 3.58 6.04 6.2 1.02 3 .07 6.44-2.26 8.18-.85.64-1.79 1-2.71 1.02a.48.48 0 0 1-.44-.24c-.4.8-1.1 1.38-1.9 1.52a.49.49 0 0 1-.43-.15l-.4-.45c-.11.06-.24.12-.4.16-2.16.56-4.77-.34-6.63-2.29-1.65-1.73-2.63-4-3.49-6a.48.48 0 0 1 .26-.63.5.5 0 0 1 .63.26c.87 2.02 1.76 4.12 3.3 5.72 1.62 1.7 3.86 2.5 5.7 2.02a.6.6 0 0 0 .16-.06.48.48 0 0 1 .32-.34.5.5 0 0 1 .5.13l.57.63c.43-.17.82-.57 1.03-1.1.27-.65.27-1.39.24-2.02-.1-1.94-.62-3.88-1.5-5.6a.47.47 0 0 1 .05-.5c.11-.15.3-.22.47-.19a5.23 5.23 0 0 1 4.04 3.8 5.17 5.17 0 0 1-.69 4.01c.29-.14.54-.3.75-.46 2-1.5 2.81-4.5 1.92-7.12-.8-2.36-2.8-4.42-5.53-5.64a14.62 14.62 0 0 0-10.72-.36A16.34 16.34 0 0 0 11 8.6c-.61.98-1.04 1.9-1.3 2.78-.52 1.75-.47 3.63-.42 5.45l.22 7.97a.5.5 0 0 1-.46.5h-.01v-.01Zm21.4-16.46a15.15 15.15 0 0 1 1.13 4.97c.03.56.03 1.26-.14 1.94a4.28 4.28 0 0 0 1.32-4.14 4.3 4.3 0 0 0-2.3-2.77Z" fill="currentColor"></path><path d="M45.06 25.55a.48.48 0 0 1-.42-.25c-.56-1-.25-1.9.06-2.78.13-.38.27-.78.33-1.18l.15-.9c.2-1.08.38-2.1.27-3.13-.13-1.15-.78-2.46-1.96-2.8-.73-.22-1.64-.05-2.7.5-.3.15-.6.33-.88.5-.63.36-1.29.74-2.02.98-1.05.34-2.52.37-3.47-.57a.47.47 0 0 1 0-.67.48.48 0 0 1 .68 0c.65.64 1.75.59 2.5.34.63-.2 1.21-.54 1.83-.9.3-.17.6-.35.91-.51 1.29-.67 2.44-.86 3.42-.58 1.6.47 2.48 2.15 2.65 3.62a12.1 12.1 0 0 1-.28 3.4l-.15.87c-.07.49-.22.93-.37 1.35-.27.76-.48 1.37-.12 2.01a.48.48 0 0 1-.42.7Z" fill="currentColor"></path><path d="m46.65 25.29-.15-.03a.47.47 0 0 1-.3-.6c.7-2.1.84-3.32 1.06-5.35l.08-.69a18.5 18.5 0 0 0-.91-7.27C43.09 1.33 35.75 1.56 31.67 2.6a.48.48 0 0 1-.58-.35.47.47 0 0 1 .35-.57c7.49-1.89 13.29 1.53 15.9 9.39a19.2 19.2 0 0 1 .95 7.67l-.07.69a22.93 22.93 0 0 1-1.12 5.55.48.48 0 0 1-.46.32ZM28.63 39.64h-.15a1.99 1.99 0 0 1-1.47-1.16c-.3.29-.64.48-1.02.54-.82.13-1.65-.4-2.02-1.27-.53-1.26.01-2.7.54-3.83l.16-.32c.69-1.46 1.4-2.97 1.66-4.62.24-1.57-.03-3.6-1.17-4.6a.47.47 0 0 1-.05-.66c.17-.2.48-.22.68-.05 1.5 1.32 1.74 3.76 1.48 5.46-.27 1.78-1.02 3.35-1.73 4.87l-.16.33c-.44.94-.9 2.15-.52 3.06.19.46.6.75.98.69.4-.06.77-.5.87-1.03.05-.24.27-.4.52-.38.25.02.44.23.43.48-.01.73.44 1.48.92 1.53.17.02.36-.07.53-.24.16-.18.27-.41.3-.64a2.5 2.5 0 0 1 0-.5.48.48 0 0 1 .95-.05c.02.17.03.34.02.51.05.26.18.5.35.61.21.15.47.11.67-.07.25-.25.4-.76.37-1.3-.03-.56-.2-1.1-.39-1.66a27.77 27.77 0 0 1-1.35-5.53c-.16-1.53-.16-3.77.78-5.76.11-.24.4-.34.63-.23.24.11.35.4.23.63a10.09 10.09 0 0 0-.68 5.26c.2 1.83.73 3.57 1.3 5.33.2.62.4 1.23.43 1.9.05.84-.2 1.6-.65 2.04a1.47 1.47 0 0 1-2.14-.05l-.13.15c-.33.36-.75.56-1.18.56Z" fill="currentColor"></path><path d="M15.69 24.99c-.6 0-1.25-.27-1.52-.87a.48.48 0 0 1 .24-.63c.24-.1.52 0 .63.24.13.27.57.37.9.28.43-.11.8-.41 1.19-.73l.07-.06c.13-.1.47-.38.9-.24.41.12.52.52.57.74l.06.17a1 1 0 0 0 .44-.17c.36-.23 1.03-.65 1.64-.26.1.06.16.12.21.17l.07.06c.04 0 .2-.07.29-.12.26-.11.62-.27 1.01-.15.16.04.27.12.37.18l.06.04c.27.16.66.14 1.01-.04.32-.17.6-.45.93-.92a.48.48 0 0 1 .67-.12c.21.15.27.45.12.66-.29.4-.68.9-1.26 1.22a2 2 0 0 1-2.06-.05l-.11-.07c-.05-.02-.24.07-.34.12-.28.12-.7.3-1.14.08-.12-.06-.2-.14-.27-.2l-.07-.07c-.04-.02-.17-.02-.61.26-.7.44-1.41.4-1.76-.1-.1-.13-.14-.29-.17-.42l-.02.02c-.44.35-.93.75-1.55.91-.16.04-.33.06-.5.06Zm17.03-.05c-.44 0-.81-.08-1.12-.26-.54-.3-.83-.9-.72-1.45a.48.48 0 0 1 .94.2c-.02.14.09.33.26.43.2.11.47.15.83.13.55-.04 1.1-.2 1.59-.46.36-.2.87-.48 1.38-.21.24.12.38.3.48.45.04.06.1.15.14.16l.15-.03 1.74-.32a6.37 6.37 0 0 1 1.84-.13c.17.01.34.03.47.01.1-.02.18-.08.2-.1a.48.48 0 0 1 .53-.4c.27.03.45.28.4.54-.07.52-.54.82-.97.9-.26.04-.5.02-.73 0l-.2-.02c-.45-.03-.92.06-1.37.14l-1.73.32c-.16.03-.4.07-.64 0a1.2 1.2 0 0 1-.6-.5c-.05-.07-.11-.16-.14-.18-.07-.03-.37.14-.46.19-.64.34-1.32.54-2.01.59h-.25Zm-4.23 22.78c-.49 0-.97-.13-1.38-.38-.17-.1-.32-.23-.47-.34-.2-.17-.4-.32-.62-.41-.53-.21-1.13-.02-1.77.18l-.37.12c-1.1.32-2.28.38-3.41.16a.32.32 0 0 1-.26-.37c.03-.17.2-.28.37-.25a6.6 6.6 0 0 0 3.12-.15l.36-.11c.68-.22 1.46-.46 2.2-.17.3.12.55.32.79.5a2.02 2.02 0 0 0 2.38.36l.34-.22c.23-.15.47-.3.75-.4.64-.2 1.25 0 1.84.2l.57.18c.9.22 1.9.05 2.67-.47.14-.1.34-.06.44.09.1.14.06.34-.08.44a4.06 4.06 0 0 1-3.8.36c-.52-.17-1-.33-1.44-.2-.2.07-.39.2-.59.33l-.4.25c-.38.2-.81.3-1.24.3Z" fill="currentColor"></path><path d="M33.2 47.33a.33.33 0 0 1-.25-.13 9.9 9.9 0 0 0-1.5-1.54c-.55-.46-1-.63-1.35-.5-.1.04-.2.11-.3.18-.1.06-.2.13-.31.18-.69.34-1.39.13-2.06-.08-.5-.16-.98-.3-1.42-.22-.31.06-.62.24-.91.42l-1.6 1a.32.32 0 0 1-.45-.1.32.32 0 0 1 .1-.44l1.61-1c.33-.2.7-.42 1.13-.5.6-.12 1.17.06 1.73.23.6.19 1.13.35 1.58.13l.24-.15c.12-.08.26-.17.42-.23.58-.23 1.26-.03 2 .59.6.49 1.13 1.04 1.6 1.65a.31.31 0 0 1-.25.5Z" fill="currentColor"></path><path d="M27.86 49.48a7 7 0 0 1-2.21-.32 4.77 4.77 0 0 1-2.62-1.97.31.31 0 0 1 .11-.44.32.32 0 0 1 .44.11 4.13 4.13 0 0 0 2.27 1.7c.85.27 1.84.36 2.96.24.8-.08 1.58-.26 2.34-.51.35-.12.75-.27 1.05-.53.23-.18.4-.41.53-.67.07-.16.25-.23.42-.16a.3.3 0 0 1 .16.41c-.16.36-.4.67-.7.91-.39.32-.85.5-1.25.63a11.47 11.47 0 0 1-3.5.6Zm-2.1 2.22a.32.32 0 0 1-.15-.6 5.89 5.89 0 0 1 4.45-.4c.16.06.26.24.2.4a.32.32 0 0 1-.4.21 5.23 5.23 0 0 0-3.95.36.33.33 0 0 1-.15.03Zm18.56-14.23-.19-.01c-.3-.03-.54-.24-.56-.52a.5.5 0 0 1 .32-.52c.2-.07.4-.03.55.1.58-.09 1.08-.7 1.42-1.23a14.1 14.1 0 0 0 2.11-8.91c-.05-.56-.25-1.19-.64-1.25-.21-.03-.46.1-.75.25-.26.14-.56.3-.9.36a.48.48 0 0 1-.56-.4.48.48 0 0 1 .4-.54c.18-.03.4-.14.61-.26.39-.2.82-.43 1.35-.34.8.12 1.33.88 1.45 2.09.33 3.31-.48 6.69-2.26 9.5-.86 1.36-1.73 1.69-2.36 1.69v-.01Zm-32.63.63c-.05 0-.1 0-.14-.02a5.34 5.34 0 0 1-3.24-3.12c-.6-1.36-.77-2.82-.94-4.22l-.28-2.38a5 5 0 0 1 .09-2.28c.28-.8 1.07-1.57 2.06-1.47.57.06 1.48.15 1.65.96.05.25-.11.5-.37.56a.48.48 0 0 1-.57-.37c-.03-.13-.6-.19-.79-.2-.5-.06-.92.38-1.07.83-.2.56-.12 1.25-.05 1.85l.28 2.38c.16 1.34.33 2.73.87 3.96a4.4 4.4 0 0 0 2.64 2.58.47.47 0 0 1-.14.93v.01Zm7.88-8.7c-1.26 0-2.49-.04-3.42-.09a2.72 2.72 0 0 1-1.09-.2c-.37-.18-.73-.57-.71-1.07.02-.26.14-.48.27-.68.5-.78 1.43-1.17 2.82-1.17.72 0 1.5.1 2.17.19.53.06 1.04.13 1.44.13h.43l.4-.01c.22 0 .4 0 .58.03.62.08 1.12.34 1.41.73.4.53.35 1.28-.1 1.67-.3.26-.7.31-1.07.35-.97.08-2 .12-3.14.12Zm-2.13-2.57c-1.18 0-1.9.27-2.29.87-.1.15-.16.27-.16.38-.01.19.16.37.35.46.24.11.56.13.84.14.93.04 2.14.1 3.39.1 1.12 0 2.13-.05 3.08-.13.28-.02.54-.05.7-.2.21-.18.18-.57 0-.8-.25-.35-.72-.45-.97-.49a6.09 6.09 0 0 0-.88-.02l-.38.01h-.08c-.43 0-.95-.07-1.51-.14-.66-.09-1.4-.18-2.09-.18Z" fill="currentColor"></path><path d="M17.7 27.74c-.06.48.2 1.02.67 1.18.18.06.38.06.58.06l1.22-.02c.1 0 .2 0 .28-.06.14-.09.17-.29.18-.46.03-.45.05-.95-.22-1.32-.77-1.06-2.53-.68-2.7.62Zm20.17 1.46a58.7 58.7 0 0 1-3.36-.1 2.4 2.4 0 0 1-.87-.16c-.82-.35-.87-.9-.83-1.2.1-.74.96-1.37 1.67-1.48.4-.06.85-.08 1.35-.08.85 0 1.74.08 2.6.16.58.05 1.13.1 1.64.12.35.02 1.29.07 1.6.74.1.24.1.5 0 .77a2 2 0 0 1-1.12.93c-.78.26-1.58.3-2.42.3h-.26Zm-2.04-2.39c-.47 0-.88.03-1.26.08-.5.07-1.08.55-1.13.94-.03.21.12.39.45.53.2.09.44.1.65.11 1.1.07 2.22.1 3.33.1h.26c.78 0 1.53-.03 2.2-.26.34-.12.64-.36.74-.59a.3.3 0 0 0 0-.26c-.09-.21-.43-.33-1.03-.36a34 34 0 0 1-1.67-.13 27.6 27.6 0 0 0-2.54-.16Z" fill="currentColor"></path><path d="M35.78 27.19c-.12.3-.12.62-.1.93a1 1 0 0 0 .07.41c.15.31.55.42.9.47.4.06.79.09 1.18.1.2 0 .4 0 .58-.06.5-.16.75-.7.65-1.18-.1-.47-.49-.85-.95-1.06-.77-.36-1.94-.54-2.33.38ZM26.3 11.72a.4.4 0 0 1-.4-.28c-1.97-6.49-5.35-7.75-5.39-7.76a.4.4 0 0 1-.24-.51.4.4 0 0 1 .51-.25c.16.06 3.8 1.42 5.9 8.28a.4.4 0 0 1-.39.52Zm10.97 2.48a.4.4 0 0 1-.38-.27.4.4 0 0 1 .25-.51c.1-.04 2.5-.94 2.82-3.84a.4.4 0 0 1 .44-.35.4.4 0 0 1 .36.44 5.39 5.39 0 0 1-3.35 4.5.4.4 0 0 1-.14.02ZM22.65 43.04a.38.38 0 0 1-.36-.28l-.01.01c-.43.29-.86.28-1.1-.03-.12-.16-.15-.37-.12-.6-.28.3-.57.55-.9.65a.38.38 0 0 1-.42-.13.37.37 0 0 1-.01-.42l.1-.22c-.53.47-1.1.84-1.75.78-1.09-.1-2.25-1.08-2.25-2.37 0-.52.2-1.02.52-1.38a.38.38 0 0 1 .53-.03c.16.14.17.37.03.52-.2.23-.33.56-.33.9 0 .86.83 1.55 1.57 1.62.59.05 1.28-.66 1.84-1.24l.53-.51a.37.37 0 0 1 .5-.01c.14.12.17.33.07.48-.05.08-.1.21-.16.37.22-.28.44-.54.66-.73a.38.38 0 0 1 .62.28c0 .22-.1.5-.2.84a3.5 3.5 0 0 0-.2.65l.05-.03c.31-.21.67-.76.98-1.23a11.13 11.13 0 0 1 .7-.96.37.37 0 0 1 .51 0c.15.14.16.37.02.51l-.16.2-.08.13c.16-.2.32-.39.49-.53a.38.38 0 0 1 .51 0c.14.15.15.38.01.52-.11.12-.23.42-.36.9l.45-.52.25-.3c.16-.3.37-.53.65-.58a.37.37 0 0 1 .32.64l-.36.37a4.4 4.4 0 0 0-.18.58c.37-.29.74-.8 1.02-1.2.08-.18.19-.33.34-.45.14-.1.35-.1.48.03.14.13.16.33.05.48l-.17.25-.05.06c-.08.2-.14.45-.2.66-.08.34-.16.68-.32.92a.38.38 0 0 1-.51.12.36.36 0 0 1-.18-.29c-.26.2-.54.35-.83.38a.37.37 0 0 1-.41-.31l-.01-.11c-.25.24-.51.44-.8.55a.38.38 0 0 1-.5-.42l.04-.2a2.9 2.9 0 0 1-.72.64.38.38 0 0 1-.18.04Zm5.92-.02a.38.38 0 0 1-.38-.4l.06-1.02.06-1.05c.02-.2.2-.35.42-.33.2.02.35.2.33.4l-.06 1v.06l.22-.35.24-.38a.6.6 0 0 1 .24-.28.38.38 0 0 1 .46.08c.12.13.13.33.02.47a.97.97 0 0 0-.05.07c-.05.19.01.65.1.84.12-.02.27-.13.42-.3.05-.06.15-.3.2-.46.2-.47.37-.9.72-1.01a.4.4 0 0 1 .39.1c.1.1.12.26.07.4-.07.18-.13.66-.16 1.1.27-.26.54-.66.74-.96l.24-.34a.6.6 0 0 1 .1-.12.37.37 0 0 1 .51-.03c.15.13.18.35.06.5l-.07.09a3.4 3.4 0 0 0-.22.92c.33-.3.66-.78.91-1.16.09-.18.19-.33.3-.43a.37.37 0 0 1 .5 0c.14.12.16.33.06.48l-.13.21-.08.12c-.05.12-.1.3-.15.48.18-.23.36-.49.5-.71a8.97 8.97 0 0 1 .46-.59c.15-.1.36-.06.48.07s.13.33.02.47l-.1.12a2.3 2.3 0 0 0-.09.54c.14-.16.29-.36.4-.52.17-.24.32-.45.48-.61a.37.37 0 0 1 .53 0c.15.14.15.37 0 .52-.07.07-.12.25-.1.41.03.16.09.3.17.34.47.29 1.12-.05 1.52-.5.42-.44.69-1.1.34-1.56a.37.37 0 0 1 .08-.52c.17-.12.4-.09.52.08.6.8.25 1.83-.38 2.5-.63.69-1.64 1.15-2.47.64-.17-.1-.3-.26-.39-.44-.27.34-.56.64-.92.72a.38.38 0 0 1-.41-.18.88.88 0 0 1-.09-.27c-.3.37-.64.67-1.02.77a.38.38 0 0 1-.34-.08.36.36 0 0 1-.13-.3c-.25.21-.53.37-.82.4a.37.37 0 0 1-.42-.34v-.23c-.28.29-.58.5-.91.57a.37.37 0 0 1-.3-.08.36.36 0 0 1-.14-.28v-.2c-.36.34-.73.48-1.08.4-.27-.05-.43-.3-.52-.57-.24.34-.5.63-.82.73a.35.35 0 0 1-.12.01Z" fill="currentColor"></path></svg>` : ``}`}`}`}`}`}`}`}`}`;
});
const css$5 = {
  code: ".configurator.svelte-po13ev.svelte-po13ev{grid-gap:1rem;align-content:center;background:rgba(0,0,0,.933);bottom:0;display:grid;gap:1rem;justify-content:center;left:0;place-content:center;position:fixed;right:0;top:0;z-index:100000}.faces.svelte-po13ev.svelte-po13ev{display:flex;gap:1rem}.faces.svelte-po13ev button.svelte-po13ev{background:#000;border:1px solid #000;color:#fff;cursor:pointer}.faces.svelte-po13ev button.active.svelte-po13ev{border-color:orange}",
  map: null
};
const PlayerConfigurator = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let userId;
  let faceId;
  let role;
  let $player, $$unsubscribe_player;
  let $canUpdate, $$unsubscribe_canUpdate;
  let $usersOnThisSide, $$unsubscribe_usersOnThisSide;
  let { playerId } = $$props;
  const side = isDefenderId(playerId) ? "defender" : "attacker";
  const { machine: machine2 } = getGameContext();
  const player = useSelector(machine2.service, ({ context }) => {
    return side === "attacker" ? context.attack.attacker : context.defense.defenders[playerId];
  });
  $$unsubscribe_player = subscribe(player, (value) => $player = value);
  const usersOnThisSide = useSelector(machine2.service, ({ context }) => context.users.filter((user) => user.side === side));
  $$unsubscribe_usersOnThisSide = subscribe(usersOnThisSide, (value) => $usersOnThisSide = value);
  const canUpdate = useSelector(machine2.service, (snapshot) => snapshot.can({
    type: "assign role",
    role,
    playerId,
    playingUserId: userId,
    faceId
  }));
  $$unsubscribe_canUpdate = subscribe(canUpdate, (value) => $canUpdate = value);
  if ($$props.playerId === void 0 && $$bindings.playerId && playerId !== void 0)
    $$bindings.playerId(playerId);
  $$result.css.add(css$5);
  userId = $player.userId;
  faceId = $player.faceId;
  role = $player.role;
  $$unsubscribe_player();
  $$unsubscribe_canUpdate();
  $$unsubscribe_usersOnThisSide();
  return `<div class="configurator svelte-po13ev"><select ${!$canUpdate ? "disabled" : ""}${add_attribute("value", userId, 0)}><option value="" data-svelte-h="svelte-108q7wa">--PLEASE SELECT--</option>${each($usersOnThisSide, (user) => {
    return `<option${add_attribute("value", user.id, 0)}>${escape(user.name)}</option>`;
  })}</select> <div class="faces svelte-po13ev">${each(FACES, (face) => {
    return `<button ${!$canUpdate ? "disabled" : ""} class="${["face svelte-po13ev", face.id === faceId ? "active" : ""].join(" ").trim()}">${validate_component(Face, "Face").$$render($$result, { faceId: face.id }, {}, {})} </button>`;
  })}</div> ${validate_component(Actions, "Actions").$$render($$result, {}, {}, {
    default: () => {
      return `${validate_component(Button, "Button").$$render($$result, { primary: true, disabled: !$canUpdate }, {}, {
        default: () => {
          return `Bestätigen und weiter`;
        }
      })}`;
    }
  })} </div>`;
});
const css$4 = {
  code: "section.svelte-jfi4ds.svelte-jfi4ds{background:var(--color-bg-secondary);border-radius:var(--radius-md);margin-top:3rem;padding:1rem 1.25rem}.players.svelte-jfi4ds.svelte-jfi4ds{grid-gap:1rem;align-items:start;display:grid;grid-template-columns:repeat(4,1fr);margin-top:1.25rem}.players.svelte-jfi4ds .player.svelte-jfi4ds{grid-gap:1rem;background:var(--color-bg);border-radius:var(--radius-md);display:grid;gap:1rem;justify-items:center;padding:1.25rem}",
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
  const editingPlayerId = useSelector(machine2.service, ({ context }) => ($user.side === "attacker" ? context.attack : context.defense).editingPlayer);
  $$unsubscribe_editingPlayerId = subscribe(editingPlayerId, (value) => $editingPlayerId = value);
  const players = useSelector(machine2.service, ({ context }) => $user.side === "attacker" ? [context.attack.attacker] : context.defense.defenders);
  $$unsubscribe_players = subscribe(players, (value) => $players = value);
  const canEdit = useSelector(machine2.service, (snapshot) => snapshot.can({
    type: "start editing player",
    playerId: 1
  }));
  $$unsubscribe_canEdit = subscribe(canEdit, (value) => $canEdit = value);
  const canContinue = useSelector(machine2.service, (snapshot) => snapshot.can({ type: "next step" }));
  $$unsubscribe_canContinue = subscribe(canContinue, (value) => $canContinue = value);
  const users = useSelector(machine2.service, ({ context }) => context.users);
  $$unsubscribe_users = subscribe(users, (value) => $users = value);
  $$result.css.add(css$4);
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
  })} ${validate_component(Paragraph, "Paragraph").$$render($$result, {}, {}, {
    default: () => {
      return `Die Rollenverteilung wird von der Spielleitung übernommen.`;
    }
  })} <section class="svelte-jfi4ds">${validate_component(Heading, "Heading").$$render($$result, { centered: true }, {}, {
    default: () => {
      return `${escape($user.side === "attacker" ? "Angriff" : "Verteidigung")}`;
    }
  })} ${validate_component(Paragraph, "Paragraph").$$render($$result, {}, {}, {
    default: () => {
      return `Es müssen für jede Rolle ein:e Spieler:in bestimmt und bestätigt werden. Die restlichen
    Teilnehmenden können das Spielgeschehen beobachten und das Team beraten.`;
    }
  })} <div class="players svelte-jfi4ds">${each($players, (player, i) => {
    return `<div class="player svelte-jfi4ds">${player.isConfigured ? `${validate_component(Heading, "Heading").$$render($$result, { centered: true, size: "sm" }, {}, {
      default: () => {
        return `${escape(player.role)}`;
      }
    })} ${escape($users.find((user2) => user2.id === player.userId)?.name)} ${validate_component(Face, "Face").$$render($$result, { faceId: player.faceId }, {}, {})}` : ``} ${validate_component(Button, "Button").$$render($$result, { size: "small", disabled: !$canEdit }, {}, {
      default: () => {
        return `Rolle ${escape(player.isConfigured ? "wechseln" : `${i + 1} bestimmen`)} `;
      }
    })} </div>`;
  })}</div></section> ${validate_component(Actions, "Actions").$$render($$result, {}, {}, {
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
  $$unsubscribe_section();
  return `${$section === "Assigning sides" ? `${validate_component(AssigningSides, "AssigningSides").$$render($$result, {}, {}, {})}` : `${$section === "Assigning roles" ? `${validate_component(AssigningRoles, "AssigningRoles").$$render($$result, {}, {}, {})}` : `${$section === "Waiting for other side" ? `Waiting for other side` : `Unknown state`}`}`}`;
});
const css$3 = {
  code: "svg.svelte-1fqtuea{grid-column:1/-1;grid-row:1/-1}",
  map: null
};
const Backdrop = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$3);
  return `<svg width="804" height="715" fill="none" xmlns="http://www.w3.org/2000/svg" class="svelte-1fqtuea"><g clip-path="url(#a)"><path d="M804 0H0v715h804V0Z" fill="#1B253A"></path><mask id="b" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="0" y="0" width="804" height="715"><path d="M804 0H0v715h804V0Z" fill="#fff"></path></mask><g mask="url(#b)"><path d="M291 651 78 822l264 19-51-190Z" fill="#747D4A"></path><path d="m52 154 99 41 13-295L52 154Z" fill="#257A86"></path><path d="m-163 10 113 211L6 28l-169-18Z" fill="#247771"></path><path d="m6 28-56 193 102-67L6 28Z" fill="#297877"></path><path d="m52 154-102 67 201-26-99-41Z" fill="#227776"></path><path d="m-50 221 66 228 135-254-201 26Z" fill="#2C7871"></path><path d="m-50 221-28 271 94-43-66-228Z" fill="#317865"></path><path d="m-78 492 48 148 46-191-94 43Z" fill="#37785E"></path><path d="m6 28 46 126 112-254L6 28Z" fill="#2F7B85"></path><path d="m-30 640-112 90 220 92-108-182Z" fill="#4A7A50"></path><path d="M-163 10 6 28l158-128-327 110Z" fill="#2D7A7E"></path><path d="m-221-59 58 69 327-110-385 41Z" fill="#246E4C"></path><path d="m708 634 141 73 105-178-246 105Z" fill="#934038"></path><path d="m16 449-46 191 265-149-219-42Z" fill="#37785E"></path><path d="M235 491-30 640l321 11-56-160Z" fill="#436D56"></path><path d="M151 195 16 449l219 42-84-296Z" fill="#2D726B"></path><path d="M-30 640 78 822l213-171-321-11Z" fill="#4C764F"></path><path d="m164-100-13 295L300 62 164-100Z" fill="#2B7B8D"></path><path d="m355 309 124 182 16-252-140 70Z" fill="#585E60"></path><path d="m300 62 55 247 140-70L300 62Z" fill="#3C597F"></path><path d="M300 62 151 195l204 114-55-247Z" fill="#336882"></path><path d="m151 195 84 296 120-182-204-114Z" fill="#3C6671"></path><path d="m235 491 56 160 188-160H235Z" fill="#67715B"></path><path d="M355 309 235 491h244L355 309Z" fill="#56655E"></path><path d="m300 62 195 177 26-157-221-20Z" fill="#3A5584"></path><path d="M164-100 300 62l221 20-357-182Z" fill="#34638D"></path><path d="m495 239 178 250 20-306-198 56Z" fill="#856865"></path><path d="m291 651 51 190 210-58-261-132Z" fill="#8B674A"></path><path d="M479 491 291 651l261 132-73-292Z" fill="#8F6E4D"></path><path d="m708 634-44 143 54 34-10-177Z" fill="#853F33"></path><path d="M849 707 718 811l150 94-19-198Z" fill="#8E3D35"></path><path d="m683-20 10 203 53-107-63-96Z" fill="#725981"></path><path d="m495 239-16 252 194-2-178-250Z" fill="#886D5F"></path><path d="M683-20 521 82l172 101-10-203Z" fill="#554C76"></path><path d="M829 378 673 489l281 40-125-151Z" fill="#945050"></path><path d="M164-100 521 82 683-20l-519-80Z" fill="#3F5684"></path><path d="m521 82-26 157 198-56L521 82Z" fill="#524F7F"></path><path d="m552 783 112-6 44-143-156 149Z" fill="#914134"></path><path d="m479 491 73 292 156-149-229-143Z" fill="#9A5C4E"></path><path d="m673 489-194 2 229 143-35-145Z" fill="#9A6556"></path><path d="m693 183 136 195 41-242-177 47Z" fill="#8A5F6E"></path><path d="m693 183-20 306 156-111-136-195Z" fill="#936360"></path><path d="m708 634 10 177 131-104-141-73Z" fill="#994B3A"></path><path d="m746 76 124 60 243-236L746 76Z" fill="#765076"></path><path d="m683-20 63 96 367-176-430 80Z" fill="#644B7B"></path><path d="m746 76-53 107 177-47-124-60Z" fill="#7A5A6F"></path><path d="m673 489 35 145 246-105-281-40Z" fill="#924E4C"></path></g><mask id="c" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="0" y="0" width="804" height="715"><path d="M804 0H0v715h804V0Z" fill="#fff"></path></mask><g opacity=".1" stroke="#272D2E" stroke-width="1.2" stroke-miterlimit="10" mask="url(#c)"><path d="m1145 285-1-1-3 1-2 1-2 2-5 6h-4a122 122 0 0 1-8 0h-9l-3-6-3-4 3-3-1-2v-1l-1-1c-3-1-9-6-9-7h-4l-5-2h-6c-1 0-4 0-5-3l-1-3v-2l-3-3-1-3v-1c1-2 2-4 0-5h-1c-3-1-4-2-4-4v-4l-2-3-1-2v-4l-1-1h-1v-3l1-1-1-1h-2l-1-1v-4l-2-1-3-2c0-2-1-3-2-3h-7a59 59 0 0 0-15-7 253 253 0 0 0-26 8l-5 5v5h1l3 1 1 2v7h1l-1 2-4 4-8 22h-1l1 2 1 1 1 2-3 2-5 3-3 2-4 1-1-1-8-1-2 4-1 1-1 4-4 9-2 3-2 3 1 4 5 3h14l2-1 3-2c2-2 3 0 5 1a22 22 0 0 0 6 4c3 1 5 2 6 4l2 3 2 3-1 2c-3 2-5 3-8 2l-2-1c-1-1-1-2-2-1l-7 2h-4l-2 5h-5c0 1-4 9-6 10l-7 5v1h-8v1c0 2 0 4-2 6l-5 1-8 1-5-1c-1-1-5 0-7 1l-3 5 5 10s-8 5-9 8l-5 6-3 2-7 4-17 2a312 312 0 0 0-28 14l-2-2v-2h-17l-10-5-8-2h-8l-3 1h-6a608 608 0 0 0-12 0h-6l-6-1-2 1h-2l-1 1v1h-1l-2-2-7-10v-3l-2-3-1-2 1-2h-8c-2 0-3-1-5-3-3-2-6-4-11-5h-20c-3 0-4-1-5-4l-1-2v-2l2-5-1-3 1-5-1-2-1-1c-2-4-4-10-6-11l-4-3-1 1-1-1-1-2-2-1h-5l-3-2-4-3-1-1-2-3-5 3h-1l-2 2c0 1-1 2-3 1l-6-1-6-1-5-1-6 23c1 1 3 3 2 4v1l-1 1h-6v-2l-3 1-4 2-6 3h-5c-1-1-1-1-2 1l-1 2v1l1 1 3 2 2 2v6l3 6 1 2 1 2c0 1 1 2-1 3l-2 1v2l1 1-1 1h-1l-1 2v5h-1l2 3v2h-4l-1 1-5 3-7 5-3 2-5 4c-1 2-2 2-3 1l-2-1c-2 0-5 1-7 4l-2 3-4 4-5 1-1-5-1 2-5 1h-1l-1 1-1 1-2 2-4 2-2 1-1 1 1 2v4l-1 1h-3l2 4 1 4 1 2 4 2h2c3 1 4 1 5 3v2l1 2 1 1 1 1v6l-2 2v1l-2-1h-2l-1 1v1l1 1v2h-10l-3 2c-1 1-2 1-2 3l-2 4h-1l-2 1h-1l2 2c2 3 4 4 7 4l2 1h3l2 2-1 4-1 2-1 1-1 2-1 1 1 2 1 3 1 1v10c-1 2-1 3 1 4h2l3 1 5 3v2h6c1 2 3 2 3 2l1 2 2 1 2-1 3-1 4-3 4-3 1-2-1-2c1-2 2-3 5-3l1-1 2-1 6 1 2 1 1 1h2l2-1h2l1 1v1l1 3 2-1 1-1 1 1-1 3 1 2 2 4 1 1 1 1 1 3v5c0 1 0 2 2 2h5l2 1c2 0 3 0 3 2v1c1 2 1 3 3 3l1-1h2l1 2 3 3h1l1 1 1-1v-2l2-1h7l1 2v1l-1 1 1 1h1l3 1 3 2 4 2 1 2 2 3h2l2-1h4v2l1 3 2 1 2 2h1l3-1 1 3v1h3l2-1 3 4 1 1h2v1l1 1h1l1-2 1-1h1l7 3h9v2l-1 4 3-2 2 2 2 1 3-1 2-2 2-2h13l3-1h5l1 1 3 2 1 2 1 1v6h1l1 1-1 1h13l2-1v-1l2-2 1-1 3-1h2l4-4 3-2 3-2c1-2 2-2 3-1l2 1 5 1 1 1 3 1 3 2 1-1v-4l-2-1-3-3-1-2v-1l-1-2-3-3-2-1-3 1-3 1-5 1-3-1-2-1-1 1-1 2-1 1-1 1-2 1-2 2-4 1-2 1-2 1-1 1-2 2-1 3h-4v-1l2 1 1-1 2-2 2-2 1-1 2-2h2l4-1 2-2 2-2 1-2 1-1 2-1 2 1h8l3-1 2-1 1-1 2 2 3 3 1 2h1l1 3 2 3 2 1 3-3 1-1v1l3 2 2 5v3l-1 1h1l1-1 1-1 2 1 1 6a101 101 0 0 0 0 8l-1 2v5l-1 1-2 1h-1l-1 1-1 1-1 1c-2 1-2 1-2 3l-1 2-1 1-1 1v2h2l1 1v2l-2 2v1h4l2-2 3-1h5v1l-1 3c-1 1 0 2 1 3v4h-1l2 1 2-1 2 1h1l-3 9 1-1c2 0 3 1 4 3l3 3c2 4 3 5 4 4l4-1 3-2 2 1v1l1 2 2 1 2-1-1-6v-6h4v1l3-4 3 1 2 2 3 1 1-1v-1l1-3 2 2 1-3 1 1v1l2 2 1-2v-1l1-1v1l-1 1h2l3-3 4-2 2-1h2l2 2 3 3 2-1 4-1 2 1h1l1 1-1 1-1 2-1 2v2c2 2 3 3 5 3h1l1 1c2 0 2-1 3-4 1-2 3-1 4-2 2-1 2 0 4 1 2 2 4 1 7 0 2 0 3 3 2 4-1 2 0 5 1 8s5 3 7 2 1-3-1-4l-2-4c0-1 3-4 4-3l10-2c4-1 2-3 3-3h5c2-1 2-4 5-4s3-1 3-6c1-6 2-4 5-1 2 3 3 4 4 2l2-2 4-1 6-1 6-2c5-1 6-2 7-6l1-3h5l2-3 4-2 1-2-4-1c-1-1 1-2 2-3h6c3 0 0-2 0-3 0-2 1-3 2-3v-4l2-1h3l1-5-2-2v-2l3-1-1-2-3-2 1-4c2-1 2 2 4 2l5-7 3-12c2-3 4-1 5-2 2-2-1-3-1-5s2-2 2-3l-5-2c-1-1 2-1 5-1 2 0 2-1 2-3 0-1-1-3-2-2s-4 3-6 2c-3 0 0-1 2-2 2 0 3-2 3-4 1-2-2-2-3-3l-6-2c-4 0-2 3-4 2-3 0-3-3-1-4l4-1 3-3 4-2c1-1-1-5-3-6-1-2-4-2-7-4-3-1-5-3-4-4l3 2 4-1 6 1c3 0 0 0 0-3l-5-5-6-3c-2-1-1-5-2-6l-5-5c-1-2-1-10-9-12-7-2-8-7-9-9-1-1 0-5 1-8 1-2 3-2 5-3 2 0 1-2 0-4s1-3 4-3 3-3 7-5 8-2 11-1c2 0 2-6 2-9 1-4-3-3-8-3s-8 0-11-2c-4-2-6-3-10 5-4 7-10 4-11 2-2-3-2-7-5-7s-4-1-9-4c-5-4-4-14-1-13 4 0 11-1 11-3l1-9c1-2 9-5 9-8 1-3 1-11 10-10s4 12 3 14v7c2 1 3 2 3 5 1 4-4 2-5 3-2 2 0 4 3 4 2 0 4-1 7-7s10-9 14-10c3 0 4-1 8 1v-1l3-3 1-3v-3l1-1 2-4 3-2 1-1 3-3a98 98 0 0 0 1-6l1-5 3-2 2 4 8-1 1-4-3-4 6-2 2-4 6-2-3-9 5 1 2 2 4 3s1-1 2 1h1c2-1 3-2 3-4 0-1 0-4 2-6l2-2v-2l1-5c-1-3 1-4 2-4l2-1 3-5v-1l3-1h1l2-6 3-2v-2l2-5 1-1 2-1v-8h1l3-2 4-4 2-3 2-3-2-2Z"></path><path d="M559 469h-2l-7 1c-2 0-3 0-3 2l-3 4-2 2-1-1v-1l-3 5 3 4 2 2-1 3-1 1 2 1v1l-6 8-1 2c1 0 2 3 0 5l-5 1-3-1-3 1 1 1 3 5 1 4-5 1-3 4-1 2h1v1c1 0 1 0 0 0l-4 2 1 1 1 1-1 5-1 1-1 1c-1 1-1 2-3 2l-1-2-1-1-4 1-4 2-3 1v1l3 3-1 1h-5l-4 1-3 1-4 4c-1 1 0 2 1 3l1 1v6h-10l-3-1-2-1-3 2-2 2h-3a8 8 0 0 1-3 0l-5-1h-10l2 5c0 2 1 4 4 5h9-1v10l3 2 4 2-1 2-2 5h-2v-1l-2 1c-2 0-4 2-5 3l-3 2h-1v12l11-1 6-1 6 1 9-2c3-1 10-1 13 2l5 4c4 2 4 9 5 11s7 5 10 2l4-1a10 10 0 0 1 4-2l1-2 1-2h3l2 1 3 1 2-1c1-1 2-2 3-1l3-1h1l1 1h4v-4l-3-8v-4h-3c-1-1-4-2-3-3l1-8h-5l-2-1c-1-3-1-9 4-12 4-3 6-4 7-3h1v1c1 1 1 2 3 1l3-1 5-1c3-1 3-2 5-5a423 423 0 0 1 9-13c1-3 2-6 5-8l4-3v-2l2-2 3-3 2-4h1v-6l-2-2h1l-3-1-1-1-3-3h-5l-1-1v-1l-4-3h-3l-3-1-1-4v-4l1-2c0-1 1-2-1-4l-1-1-1-3v-3l1-2 1-2 1-1c1-1 2-2 1-4l-2-1-2-1-3-1c-2 0-5-1-7-4l-1-3h3v-1l2-3 2-3 4-2h-3ZM339 618l4 2h1l1-4-1-10c-1-6-2-5-4-6s-2 2-3 3 0 4 1 6v5h-1l2 3v1Z"></path><path d="m382 645-25-3-8-18v-1l-4-1v-1h-3l-3-3a75 75 0 0 0-4-6l-2-5-2-3-2-7-1-4-2-2-3-4-2-2-4-3-3-2-1-3a17 17 0 0 0-5 1l-2-5-10-2-6 1c-5 0-10 1-12-1-1-2-20-19-30-25l-25-11h-2l-3 2-19 5 4 5 5 8v1c-1 1-3 4-5 4l-3 1c-2-1-3-1-5 2l-1 2c-1 2-2 4-5 4l-15-3-1 8c-1 4-2 5-1 6l6 3 8 11c2 4 3 9 7 12 5 4 5 8 6 11 0 4 4 5 10 8 5 4 8 12 9 23 1 10 8 16 13 18 4 3 7 6 10 13 3 8 6 12 9 15 4 3 3 5 5 8l5 6 2-5h1l1 1 1 1h12l7-3 8-1 4 2 3 2c1-1 3-4 4-9 0-5 16-8 20-8l24-3 30-12 6-21-1-7ZM31 248l-1-1 1-2 2-2v-3l-1-1-1 1h-3l-1 1-4 1 1 1c5 2 0 5-2 6l-16-1 3 2h7l3 1h7l2-1 2-1h1v-1Z"></path><path d="m55 235-2-1-1-1 1-1v-1l1-1-1-1h-1l-2-3-1-2-5-2h-1l-2-2v-1l-2 2h-3c-1 0-4 0-5-2h-2l-1 1h-6c-3-1-4 0-8 3l-4 2-2 2c1 3 6 10 8 11l6 3a22 22 0 0 0 6-1l3-1h2v4l-1 2-1 1v5h7l2-2h2l1-1 1-1v-1l1 1 1 1h1v-1h-1v-5l1-1 1-1v-1l1-1 1-1 1-1 1-1h4-1Zm1346-451c-2-5-5-4-4-7 2-4 1-8-2-10-3-1-8-10-6-13 3-3 7-6 5-11s-5-3-5-8c0-4-1-6-5-7l-15-4c-2-1-9 0-10 1 0 1-4-1-11 8-6 8-7 0-13-4-5-4-14-1-18-2-4 0-11 0-21-2l-18-1c-5 0-9-3-19-6s-15-2-25-3c-10-2-30 7-38 8s-18 1-15 3 4 7 7 12c3 6 8 2 16 14s-7 11-11 8c-3-3-2-5-6-5-3 0-9-1-11-6s2-5 4-10c1-5-8-6-14-6-5 0-1 7-1 14s-6 5-10 6c-3 0-9 5-13 4s-6-2-10 3c-4 4-9 6-19 8s-15 0-20-15-22-13-28-13c-7 0-6 3-10 3l-12 8c-5 3-14 9-19 10s-4-4-5-7c-1-4-12-7-14-6-1 2-5 9-7 7-1-1 2-4-2-6-5-2-5 4-6 3 0-2-6-4-8-4-2-1-2-5 2-6 5-1 1-6-4-9-5-2-17-1-22 2-5 4-9 7-10 6-1-2 4-3 0-3l-31 2h-16c-6-1-7 4 2 5 8 1 1 6-5 7-6 2 0 9 1 11 2 2 3-1 5-1 1 1-1 4 1 5 3 1 1 2 6 5 5 2 3 5 1 7s-3 1-5-2c-3-3-7 2-8 3-1 2-3 4-11 4s-11 1-11 6-4 4-9 4c-4 0-9-2-12-5-4-3-5-5-6-4s2 4 3 8c1 5 1 7 5 13 3 7 1 11-4 11-4 1-3 0-7-3-5-2-9-8-14-10-6-2-10-2-15-5s-7-7 0-5 8-2 7-6-4-5-7-7c-4-1-5-5-11-13-6-7-18-8-24-7-6 0 0 5-3 5-3-1-3-3-16-5-14-2-9 10-3 16s2 7 0 7-4-2-8 1c-3 4-13 5-25 5-11 0-8-6-6-11 1-5-10-1-13 0-2 1-11-1-16 2-5 2-14 12-14 7-1-6-6-2-6-1s-2 3-6 3c-5 1-4 0-6-1s-4-1-3-4c1-2-1-4-2-3s1 6-3 3-8 0-8 1v7c-1 5 4 3 6 1 2-3 4-4 5-3l-1 5-6 8c-3 4-4 5-12 10-7 4-7 0-6-3 0-2 0-8 2-9s4-2 5-5c2-3-1-6 0-9 1-4 3-6 2-8s1-4 3-7l3-7v-7c0-3 4-6 4-9l-2-12c-1-2-4-1-4-2-1-1 1-3 1-5 0-1-3-6-7-8-3-3-4-6-7-7-3 0 1 5 0 6s-5-3-6-6c-2-2-4-4-8-5-5-2-8-1-9-5 0-3-5 0-10 4s-7 4-11 4c-4 1-4 1-3 3 2 2 2 6 0 10-1 4-3 3-7-2-3-6-2-17-7-18-6 0-11 5-13 5-3 0-1-2 0-6 2-4 1-7-1-9s-5-2-10-3c-4-1-7-1-11 2-5 4-2 14-4 18s1 6 1 8c1 3-4 3 4 9 8 7-1 12-4 12-2 1-4 2-4 5 1 3 2 4 0 4l-4 5-4 4c-1 0-1 5-2 4l-2-2c0 1-3 4-3 2v-5c-1-3-6-1-12 1s-11 4-11 7 1 5-2 9c-3 3-19 10-19 13l-4 10c-1 3-3 9-3 14s3 6 5 7c1 1-4 8 4 9 7 0 2 6 1 6l-13 6c-3 0-6 3-10 4l-14 4c-8 3-5 8-2 11 2 3 6 6 7 11 1 4 4 8 10 7 6 0 5 0 10 7s1 10-3 10l-8-5c-2-2-3-4-5-4s-5-1-8-4c-4-3-12-1-14-1-1 1-7 7 1 9 9 2 3 10-3 6-6-3-9-2-10 1-2 2 2 5 9 11s-4 7-5 6c-2-1-6-9-7-10l-3-7c1-3-1-4-1-6 1-3-2-2-2-4 1-3-1-3-4-7-2-3-4-2-2 2 2 3 3 8 3 12 0 5-4 6-6 9-1 3 2 3 0 10-1 7-8 2-9 0v-7c1-2-1-14-2-18-1-3-3-3-6-5s-7-2-10-1h-12c-3-1-3 2-3 5l2 13c2 8-1 17-6 24-4 7 2 13 5 15s1 6 3 9 0 4 1 9 3 4 9 5c5 1 4 1 4 5 1 3 5 4 11 7 5 3 3 11 1 13-3 1-7-2-9-4l-7-7-11-4-9-3-6-6c-4-2-12-2-21-2l-11 1-1 1c-2-4-6-5-10-8l-6-5-2 1c-2 2-3 4 0 8s6 5 8 6l5 2c1 0 5-1 5-3v2l2 7c2 3 6 4 7 7s-1 4-2 6c0 2-3 0-5 0l1 4c1 2-1 5-4 5s-1-7-2-11c0-4-4-2-8 1s-7 7-10 7-10 0-13 2-5 7-7 7c-3 0-3-2-3-3l-1-5c-1-2-4-3-3-4 2-1 5-3 4-4l-7 2c-4 2-4 4-6 5s-1 4-7 5-7 3-9 5l-6 7c-2 2-3 5-4 3-1-1-3 0-2 1 2 2 3 4-1 4-5 0-6 1-5 3l-2 11c-2 3-6 2-9 2-2 0-5-1-7-4l-5-6c-1-1 1-2 2-4 0-2 1-2 2-2l7-2c2-1-2-4-4-6-2-3-3-2-4-5s-2-4-7-3h-12c-6-2-3 2 1 4s5 7 4 14c0 7 0 9 4 11s3 3 4 10c2 7-4 6-7 5l-12-2c-4 0-7 7-12 13-5 5-4 8 0 15 5 7-2 11-5 11s-2-3-4-5l-9-3-6-4c-2-1-4-1-5 1-1 1 0 3-2 5-1 1 0 3 2 5s3 3 7 4c4 2 8 0 6 6-1 6-11 3-15-1-5-4-10-4-12-6-2-3 0-7-2-9-1-2-3-6-2-13s-9-9-11-10c-3-2-2-5-2-7 1-2 4-2 5 0s1 3 4 3 4-1 7 1l7 3 15 2c9 1 14-2 21-11 8-8 2-16 1-18l-6-6c-2-1-8-3-21-12-12-9-27-14-30-14L88-4c-2 1-3-1-7-3-4-1-4-3-7-4-3 0-6 2-7 1l-2-1-1 2-1 4v3c-1 1-4-2-5-2v-1 2l-2 4c-2 0-3 2-4 3l-1 1-1 2-1 2V8l-1 1-1 2v3l-1 2c-1 2-1 2 1 4l1 4 3 4 5 9-6 13a734 734 0 0 1 6 24l-2 4c-1 3 0 5 1 7v2l1 2 1 3 1 1 1 4 1 2v1c1 1 2 2 0 4l-1 1c-2 2-2 2-1 4l3 3c2 1 5 4 6 7 2 5 1 7-10 21a248 248 0 0 1-17 21l5-1c2 0 2-3 5-2l13-2c2 1 3 0 5-2h2c1 1-1 3-1 5-1 1 1 3 2 2s1-3 7-1c5 3-1 4-3 6l-5 1c-2 1-4 1-4 3l-2 3a60 60 0 0 1 0 4c1 1 0 3-2 5h-1l-1 6v5l1 2 1 3v1l-1 1-2 1-1 1 1 1v1h2v2c2 0 2 3 1 3v5l2-1h1l-1 1v2l1 2v4l1 1h1l2 1v1h4l1 1v2h2c2-1 4-2 5-1h1l3 3v8l-1 1v1l3 1 1 1-1 1v1l1 3c2 0 3 1 3 2l2 3h2l2 1 2 2h1l4 2v1c0 1 0 2-2 3v5l3 2 3 3 6 7 1-1 1-1v-1l2 1h2l1-1h3l1 1c1 0 0 0 0 0h3l1-1v-4l1 1 4 1 2-1v-1h3l1 1 2-1 3 4 2 3 1 1 1 1v1h-3l-1 1 2 2h1l-1 2 1 1-1 1h4l1 1h1l2-1 1 3v1l1-1h1v3l1 2v1h-1v2l1 1a11 11 0 0 1 1 2h1v-1h4l1 2h1l1-1 1 1v1l1-1h1l3-1c2 0 3-2 3-2h1v2l1 1v2h1l2 2 1 1 1-1v-2h1l1 2h3l1 1 1 2 2-2 2 1v1l1 1h1l1 1 1 1v1l1-1 1-1h1v1a7 7 0 0 0 1 3l1 2-1 1h-1l-1 1-2 1v1h3v3h-4l1 1v1h1v3l1 2h1v1l-1 2-1 3h-10c1 1-2 2-4 3v1h-1l-1 2 1 1 1 1h-1v1l1 2c1 1-3 3-6 6-4 3 1 3 1 4v5c0 1-1 5-5 5-5 1-2 3-1 6s2 3 6 5c4 3 6 3 13 5s6 5 12 9l5-4c4-2 17 6 19 6a324 324 0 0 0 6 0c2 0 2 0 5 3 2 3 4 3 4 3h1v2l4-1 5-1 2 1 2-1h2l1 2 2 1h2l1 1v1l-2 2v1l2 1h1l4 2 2 1h3l6 6 2 3h2l3-4 2-3 1-1 3-3-1-1c-3-6-8-7-12-11s-3-10-3-13c-1-3-6-7-7-14-2-6 4-9 7-11l10-6 7-6-2-1-2-2-4-2v-2l2-1h1v-1l-2-3-1-2-2-3-3-4-4-3h-4l-1 3-2-3v-6l-3-2-6-2 6-11-2-2-1-1v-8l3-2 2-5 3-4h1l9 11 4-4-4-9h-1 1l4-3c2 0 4-2 5-3v-4l-1-1h3l1-1c6-1 7-4 7-6 1-2 2-1 3-1v-1l-1-1 1-1h6l1 3v1h3l1 1v-1l1-1c0-2 0-3 2-3h1l1-1c2 1 3 2 3 4h7c3 0 4 1 4 2l1 1 3 2 3 3 2 1 1 1 1 2-1 2v1h1l2-1v-4l-1-1h-1l1-1h2l2 1c1 0 2 0 2 2l1 1 2 1 3 1h1c1 1 2 1 3-1l-1-2 1-2 3-1 1-1 1-1h1v1l1-1 2-1h1l3 1 2 2h1l1-1v-2l1-1h4v-1l2 1 2 1v1l1 1c2 2 4 2 5 2l1 1 4 2v1h1l2-1 2-2v-1l1-2h1c0 1 1 2 4 2l8-1 1-3 1-1v-2c1-1 2-2 0-3l-3-2h-1l-2-2-1-1h-6 1v-2l-1-1h-2l-1-1-1-1-1-1 1-1 3-1 2-2c2 0 3-1 3-2v-3l-1-3v-1c-1-2 1-3 2-4l2-2h8l1 1v-2l-1-2s-8 0-9-2l1-2 1-1 3-1h-6v-5h1l-1-2 2-1v-1h1l2-1 3 1h2l1-1h3v1l1 1 1-1v-1l3-1 3-1h-1l1-1h1l7-1 1-1 1-1 2-1h2a4 4 0 0 0 3 0l2-1 1 1v-2l-1-1h5v-2l1-1h3v-2l1 1 3 1 12-4 8-4h1v-3h3l1-2 1-1h2v-3l2 1 6 1 5 1h3l2-1h1l1 1 1 3 2 3 1 2 2 2v4l-2 2v1l-1 2v1h5l1 1 2-2v-1l3 1v-3h1l3 1 1 4-1 2h4-1v-3l1-1 2 1h1l4 1h3l2 2-1 1h-1l-2 2h-1v5c1-1 3-3 5-3 3-1 3 0 4 1v1l3-2c0-2 1-3 3-3l3-1 2-1 1-2v-1c0-1 0-2 2-3l4-1h1l1-1 3-2h1l6-3v1l-2 3-2 2-2 2h1v1l1 2 2 3 11 9 26 41a19 19 0 0 1 3-3v-4l3-2 2-1 1-1 1 2v4h3l1 3v1h12l3-3 8-2h1c1 0 2 0 4 5l3 5 1 1c0 1 1 3 3 3 3 1 5 3 5 4v1l2 2c4 2 6 2 9 2h1l2-3 1-2h1l1 3 2 2 4 3 1 1 1 1 2 2-2 1-2-1-2 1-2 4-1 2c-1 2-3 4-6 5h-2c-1 0-2 0-2 2v5h8l3-2 3-2v-1c1-1 0-1-1-2l-1-1 3-2h2l7-2 1-2 3-3 2 1h2l1-1 2-3 2-3 1-1 2-2h1c1 2 1 2 4 2v-1l2 1c3 2 6 2 9 2h1l3-1 2-1 1 2v2c0 2 1 4 3 4l8 1 3 1 3 1h8l4 1c1 1 1 1 2-1l1-2h1c2 0 4-3 4-5l1-3c1-1 1-2-1-3l-3-1-1-4h-1v-2l2-3a23 23 0 0 1 2-4l3-6v-2l1-4 2 1 8 5h2l4 1 5-1 6 1 5 1c2 0 3 0 4 2l-1 4v4l4 3 4 3 2 1 3 1 3 1c3 2 3 2 6 1l5-2c1-2 2-3 4-3l6 2c4 1 8 2 10 1l3 1 4 1 2 1c4 0 6 1 8 3l1 2c1 2 2 2 5 3h2l8 1h4c8 1 11 1 15-1l4-2 9-6 5-5c2-2 3-4 5-4l9 1 10 1 6-1h3v3l8 1h5l2-2 6-4 2-1-1-2-1-1v-3l9-22 3-3 2-2h-1v-5l-1-2-1-2-2-1h-2v-5l6-6 7-2 2-1a256 256 0 0 1 17-4c4 0 14 6 15 6h2l2 1h3c2 0 2 1 2 3l3 1 2 2v4l1 1h2l1 1v1l-1 1v1h2l1 1-1 2v3a54 54 0 0 1 3 5l1 3v1c0 2 1 2 3 3l1 1c2 1 1 3 1 5l-1 1 1 2 3 4 1 2v3c2 3 3 3 5 2h6l5 2h4s6 7 9 7l2 2v3l-2 3 2 4c2 1 3 5 4 6h16l3-1h1l5-5 2-3 1-1h5l2 3-1 3-3 4-4 3-3 2v8l-3 2-1 1-1 4-1 2-3 2c0 1 0 5-2 6l-1 1h-2v1h-1c0 2-1 4-3 5l-2 1c-1 1-3 1-2 4v5l-1 2h3c2 1 2 6 9 7 6 1 8-4 13-9 5-4 4-8 6-12l5-13 4-12 5-10c1-2-1-4 1-6l1-6 1-9 4-16c2-3 1-12 0-14l-2-11c0-2 0-11-4-15-4-3-4-2-3-13 1-10 2-11 7-4l12 17c6 8 3 10 3 20 0 9 1 7 6 14s4 7 1 12c-4 5-4 9 0 10s6 6 8 9 0 8 3 10c2 1 3-4 3-7 0-2 1-4 3-5s6 0 6 2c1 2 4 6 4 4l-1-7-4-4c-2 0-4-2-4-3 0-2 0-4-4-7s-3-3-5-7c-1-4-2-7-2-17 0-9-1-6 2-8 2-2 5 1 8 4 2 3 5 6 5 4s-2-3-3-5l-5-6-7-19c-4-14-17-28-22-31-5-4-1-5-1-8s-2-3-4-5c-2-1-2-4-1-3l4 4-5-8-5-5-3-4-1-4c-1-1-2 0-3-2-1-1-1-2-3-2s0 3-1 3c0 0-2-2-3-1l3 4 4 3 2 5c0 2 2 2 1 3-1 2-3 0-6 0s-1 3-4 3-13-6-15-8c-2-3-5-4-9-4-4 1-3 2-5 1-1-2-3-1-3 0v6c0 3-4 7-6 6-2 0 0-4 0-6 1-2-4 0-6 1-2 2-4 2-5-2l-2-8c-1-3-3-4-6-2-4 2-5 4-9 3-5-1-3-4 0-9l7-14c3-9 3-12 3-17s2-9 4-12c3-4 3-8 5-11s1-10 2-15c0-5 4-7 4-12 1-5 6-12 13-15 7-2 10-4 13-2 3 3 7 3 8 1s-4-5 2-5c6-1 22-4 21-9-2-6 4-5 9-5 6 0 13 1 17 3 4 3 8 7 12 7 4 1 6-6 6-8s8 0 10 0 4-5 1-7c-3-3-8-2-10-4s-1-7 0-11c0-5 2-5 2-23 0-19 6-16 9-17 2-1 7-6 10-5s6 5 7 3c1-3 1-5 4-3 3 3 0 9 0 12-1 2 2 3 6 3 4 1 3 4 5 7 3 2 4-3 5-7s2-15 4-18c1-3 4-4-1-16-5-11-1-12 5-13s8 5 6 5c-3 1-4 3-3 9 0 6 6 8 6 9 0 2-3 6 0 8 2 2 2 3 2 7s3 6 1 8c-1 2-6 5-7 11-2 6 3 11 1 14s-3 9-3 17l-1 19c-1 8-3 3-5 9s-3 5-7 6c-5 0 0 3 3 5s1 8 1 12c-1 5-5 11-3 18l4 14c1 6 18 28 19 32s8 8 9 13c0 5 8 8 11 10 3 3 4 10 4 14 1 4 3 11 6 11 4 1 3 8 4 8l3-6 5-8c2-3 2-14-2-18-4-3-1-9 0-12s10-3 8-5l-6-12c-3-5 1-14 7-16 7-2 6-6 4-10-3-5-9-11-10-16s0-12 4-10c4 1 4-2 4-6 1-5-3-5-4-9-1-5-4-1-7 0-2 1-2-3-4-7-1-4 1-6 1-10s-7-7-10-8c-4-1 2 8 0 8-3-1-5-5-8-11-3-7-1-25-3-30-2-4-3-6-2-10 1-5 3-2 7-1 3 1 3-2 3-6 1-5 3-7 6-6 3 0 2 10 6 11 3 1 2-7 1-14-1-8 8-7 13-9 6-2 8 1 10 3 2 3 9 6 13 7 4 0-1-6-2-15s4-18 5-25 6-13 10-23c4-11 11-14 19-14 7 0 11 0 12-4 0-4-1-8-3-10l-6-8c-2-4-4-3-9-4-5-2-7-5-7-10 0-4-3-2-6-2-2 0-3-3-2-6 0-3-7-6-7-4s-1 4-7 1c-7-4-5-7 4-8 8 0 6-9 5-13v-18c-1-3-4-7 0-11 4-3 4-6 4-10s11-8 15-1c5 6 5 7 12 5s4-2 13-2c8 0 5-6 3-10Z"></path><path d="M48 6V2l2-2v-4l-3-3-3-2-3-6-1 1c0 1-1 2-4 2h-4l-2 1-2 5-1 4c-2 3-3 8-3 10l-2 3-1 1-1 1-1 4h-1l-2-2c-1-1-2-3-4-3l-3 2-4 2H2c-1 0-3 1-4-3l-1-4c-1-2-1-5-3-6-3-1-3 0-5 3v1l-2 1 1 2 6 6c5 3 10 5 10 7l2 3 1 1v7c0 3 0 4 2 6v6l1 9a76 76 0 0 0 0 11l10 1c3 0 7 2 10 5 2 4-2 9-3 10l-9 12-7 8-3 5c-1 3-2 4-4 5s-5 5-5 10c0 4 2 4 2 5l1 7 1 16c0 7 3 6 6 6s3 2 4 3l6 1c2 2 4 7 6 7 1 0 4 0 8-4l6-2 7-9 10-12c12-15 12-17 10-21-1-3-3-5-6-7l-3-2c-1-3 0-4 2-6h1v-4l-1-1v-2a14 14 0 0 1-2-5c0-2 0-2-2-3l-1-2v-2l-1-7 3-4 1-2-8-22 7-13c0-1-3-6-6-8l-2-5-2-4-1-4 2-2v-3l1-3V6ZM16 406h-3c0 1 0 0 0 0v3l1 1 1 1v1h1l1 1 1 2v2h2v-1l1-1 1-1 1-1 1 1 1 1v-1l2-1v-2h1v-4h-2l-1-2-2-1v-2h-1l-1-1-1-1-2 2 1 1-3 3v-1 1Zm0-1Z"></path><path d="m40 400-1-1-1-2-2-3-1-1v-3l1-1 1-1 1-1-2-1v-2l1-1h1l-1-1h-2l-1 1-1 1-2-2h-2l-2-1v-1l-2-1v-1h1l-1-1v-1h1v-2h-2v-1l-3-1-1-1-1-1 1-1v-2h-2v-2h-1l-1-2-1-1h-1l-1-1-1 1H8l-1 1-2 1-1-1-1 1-1 1v2h1v1H2v1l1 1v1l1 1 1 1 2 2H5l-1 1v2h2v3l-1 1v1l-1 3h1l4 4v1H6l-1-1 1 1 2 4v1l-1 1v-1H6l1 2 1 1 1 2 3 1 1 1 2 1 1 1c2 0 2-1 2-2v-2l2-1 1 1h1l1 1 1 1 1 2 2 1 1 1h1v2l-1 2v1l-1 1 3-1h2l2-1 1 1 1-1v-2l-1-1v-2l1-2h1l2-1 2-2-1-1Z"></path><path d="m-10 403-1-1-2-3v-1l-1-1-10-9v-3l-1-1v-2l-1-1-1-1h-1v-6h3l2 3h1l1-3h3l1-1 2 1 1 1v-1l1 1h4l1 1 1-1h2v1h2v-1l1 1h3v2l1 1h2a6 6 0 0 1-1-2v-1l2-2h1-1l-1-1H3v-3l-1-1v-1h1-1v-3H1l-2 1-2 1h-6l-2-2h-2l-1-3-1-1h-2l-1-2-1-1-1-1h-1 1l-2-1-1 1v1h1-3v1l-1 1h-1v1h-2v1h1v4h-3v1a25 25 0 0 1-1 0l1 1-1 1 1 1v1h-3l-1-1h-1l-1 1-1-1-1-1v-1 1l-2 2h-2l-1-1v1h-2l-3 1-3 1v4c0 4 4 5 6 4 2-2 1-5 3-6 1-1 3 2 4 5l3 7c1 2 0 5 2 7 2 1 6 4 10 4 5 1 6 1 9 4l2 2h3v-1Zm27-217 7-1c1 0 3-2 0-3l-6-1c-3 2-2 2-3 4-1 1 0 2 2 1Zm60 313-9-3c-6-2-4 2-7 1-2 0-3-2-7 0-2 2 0 5 1 5h7c2 0 4 4 6 4l6-2c4-1 7-1 8-3 2-2-2-2-5-2Zm71 8c3 0 5-2 7-3 2 0 5 1 5-1 0-1 0-4 2-5l3-4-6 3c-2 1-4 2-5 1l-3-1c-4 1-4 3-7 4-3 0-5 2-3 4 2 1 4 3 7 2Zm69-528c-7 0-10-2-12 2-4 8 0 12 3 15 3 2 1 5 5 4 5-2 7-5 9-6 3 0 7-5 5-8s-3-6-10-7Zm-40 538c2 0 2-1 3-2l1-1 1-3 3-2h1l1-1v-3l1-2-1-1c0-2-1-2-3-2h-7c1 1 2 2 1 3a119 119 0 0 1-5 15h2l2-1Zm0 1h-2l-2 1-3 5c-2 2-1 5-2 9l-2 4 6 23c2-3 7-22 7-43l-2 1ZM50 295l1-1h-1v-2l-2-2-1-1-6-6 1-1 1-3 1-1v-2c1-1 0-2-1-3l-2-3c0-2-2-3-4-5l-2-3-4-10a59 59 0 0 0-1-3l-1 1-3 1H16l-7-1-4-2-5 1c-4 0-5 2-7 3-1 0-5-1-5-4-1-4-4-4-6-3l-9 1c-2 0-1 2-2 3-2 1-4 0-5 2 0 1-1 3-4 3l-3 1v7l-2 2 2 2 2 2v4l2 2v3l-1 3 1 2-1 1v1l2 1 1 1 1 1-1 2-1 3v2h1v-2h2a221 221 0 0 0 2 3h2l1 1h1l1 1h1v1-1h2l1 1h1v1l-1 1h-1v1l1 1 1 1 1 2h2l1-1 1-1h-1v-1l-1-1 2-1 1 1 1 1 2 1h2l1-1 1 1-1 1a7 7 0 0 1-1 1l2 2h1l1-1 2 2h1c2 0 2 1 2 2l1 1 1 2 1 1h1v1h1l1-2h1l1-1 2 3 2 1v2h1l1 1v-1l1-1 1-1h5l1 1 1-1h1l4-1h2c2 0 3 2 3 3l4 1v1l3 1v-1l-1-1-1-5 5-6 3-5 4-1 1-2v-5Z"></path><path d="m-38 295-1-1v-2h-2v2h-1l-2 1h-1v1h-3l-1 1-1 1h-1l-1 1-1 1h-1l-1 1h-2l-2 1v1l-1 2-1-1-1-1v2l3 2 1 1-1 2v2l1 1 1 2 1 2h2l2 3h1l1 1 1 1h1l2 3 2 1v1l2 1 1-1h3l1-2h1l1-3h3l3 1h1l2 1h1l1 1h2l2-1 1 1h1l1 1v1l2-4 3 1h2l1-1h1v-1l1-1h1v-1l1-2 1-1 2-3h3v-1l-1-2-1-1-2-2h-1l-2-1h-3l-1-2s-1 0 0 0v-1h1v-1h-4l-1-1-2-1h-1v1h1v2h-1l-1 1-1 1h-1v-1l-1-1-1-2h-1v-2l1-1h1l-1-1h-3l-1-1-1-1h-4l-1-1-1-3-2 1v2h-3Zm20 63v1l1 1h2v1l1 1 2 2h2l1 2h3l2 1 3-1 2-1h1v-1l2-1h2l2-2a56 56 0 0 1 4 0h7v-1h2l2-1 1-2h1v-1h-1 1v-2h1v-1l2-3v-1l1-1 1-1 1-3 1-2 1-1 2-2h1l1-1 2-1v-1h1v-1h-3v-1l-1-1-1-1-1-1-2-1-1 1h-2l-1-1-1-1-2-1-3 1-2-1-3 1-1 3-2 1H7v1l-2 1-2-1-2 1v1l1 2v1l-3 1h-1l-8-1-3-3h-2v1l-1 1 1 1s1 0 0 0l-1 1h-3l-1-1-1 1 1 1 1 1v1l-2 1a20 20 0 0 1 0 3l1 1v1l-1 1h-2l-1 2h2v2l1 1 1 1v1l2 1Zm110 12 1-1v-2l1-1h1v-3h1l1-1 1-1h-1v-2l-1-1v-1l1-1h1l2 1 1-1v1h1l1 1 1-1 2 1h2v-1l-2-1h-1l1-2v-2h-1l-1-1h-1v-3h-1v-1l1-1-1-1h-1l-1-1-1-1-1-1 1-1v-4h-2l-2-3h-2l-1 1v-1h-2l1-1h-2v-1l-3-2h-4l-1 1-1-1h-4v1h1l-1 1 2 1 1 1a14 14 0 0 1 2 5l1 2v1l1 1h1l1 2h-1 1l1 1v1l1 1 2 1 1 4v6l-1 1v10h3Zm135 50h3l4-1 1-1 3 1 1 1 1 1 1 2 2 1 13-2h3v-1l1-2 3 1 6 3 4 1h2v-2l-2-2-1-2h-1v-2l2-2-1-1-4-1-1-1-2-1v-1l1-2 1-1h-3l-3-2-1-1v-1h-1l-2 1-2-1-5 2h-4v-2h-1s-2 0-5-3l-4-2h-7s-14-8-18-6l-5 3h1c6 4 9 5 15 12 6 6 4 9 2 13l3 1Z"></path><path d="M103 372h-3l-1 1-2 1-1-1-1 1h-2l-2-1-1-1-1-1-1-2 1-2v-9l1-2v-2l-1-1-1-3-1-1v-1l-1-1v-1h-1l-1-1v-1l-1-1h-1v-2h-1l-1-2v-2l-1-2-2-2-1-1h-2l-1 1-1 1-1 2-8 1c-1 1-2 3-4 3l-1-1-1-1-2-1h-7l-2-1v1h-1l-3-3-1 2h-1l-1 1-1 2h-2l-1 1-2 1-1 1-1 2-1 3-1 1-1 1v1l-1 3v1h-1l-1 2a4 4 0 0 1 0 1l-1 2-1 1h-2l-1 1h-1v1h-3a11 11 0 0 0-1 0l1 1 2 2 1 1 1 1v4l2 1 2 1h1l1 1 1 1v1l-1 1 1 1v1h-1l-1-1 1 1 1 1h1v1h1l3 1 1 2v-1l2-2h2l1 1v1l-2 1v1l2 2h1l2 2h1l-1 1-2 1 1 1h6l2 1 2 1h12l2 1h1l2-1 4-3 4-2 4-1 2 1 2 1h3l1-1 1 1 1 3h1l6 1 2-8c2-4-1-4 0-6l6-3v-3l-1-2Zm582-56 1 2 4 3 3 1h5l2 2 1 1 1 1v-1l6 3a93 93 0 0 1 7 16l-1 3 1 4v1l-2 4 1 2 1 2c1 3 1 3 4 4h20c5 1 8 3 11 5l5 3h3l4-1 2 1-1 1-1 1 1 2c2 0 2 1 2 3l1 3a43 43 0 0 0 8 11v-1h2l2-1h9l5 1h12l6-1 3-1h5l3 1 8 1c1 1 4 4 10 5l3 1v-1h13l2 1-1 1v1c1 1 2 2 6 0l24-12 17-3c3 0 4-1 6-3l3-3 6-5c1-3 7-7 8-8l-5-10 4-6h20l5-2 1-5v-2h8l8-6 6-10h5l2-4h4l6-3 3 1 3 2 7-3 1-1-2-3-3-2-5-5-3-1-3-2c-2-2-3-3-5-2l-3 2-2 1h-14l-5-2v-1l-1-4 2-4 1-2 4-9 2-4 1-2c1-2 3-5 2-6h-3l-6 1-10-1h-9l-5 3-5 5-9 6-4 2c-4 3-7 2-15 2l-4-1h-8l-2-1c-4 0-4-1-5-3l-1-1c-2-3-4-3-8-4h-2l-4-2h-3l-10-2-6-1-4 2c-1 1-2 3-5 3l-6-1-3-1-3-1-3-2-3-3-4-3v-8l-2-1-6-1c-3-2-4-2-6-1h-9l-2-1c-4-1-4-2-8-5l-2-1-1 4v2l-2 6-2 2v2l-2 3-1 2h2l1 3 3 2c2 1 1 2 1 3l-1 3c0 2-2 5-5 5h-1v3l-3 1-4-1h-8l-3-1-2-1-9-1c-3-1-3-3-3-5v-2l-1-1h-1l-4 1h-1c-3 0-6 0-9-2h-2l-4-1-1-1-2 3-1 1-1 2-2 3-2 2-2-1h-2l-2 2-2 2a170 170 0 0 0-11 4l1 1 1 2v2h-1l-2 2-4 1c-2 2-4 1-5 1l-3-1 1 1v10l2 3Z"></path><path d="M203 316h-1v-3h-1l-2 1-1-2-1-1h-2l-1-1-1-1-2 1-1-1-2-1h-1l-1-1-1-1h-1v1l-1 2-1-1v-1l-2-1-1-1v-2l-1-1-1-1-3 1-3 1-2 1-1-1h-2l-1-2h-3v1h-2l-1-1-1-1v-4l-1-1v-3h-1v-1l-1-2h-2l-1 1-1-1h-4v-5l-2-2 1-1h2v-1l-1-2-2-3-3-3h-3l-1-1-2 1c0 1 0 2-2 1l-4-1-1 3-1 1-1 1-2-1h-2l-2-1-1 1h-4v2l-3 3h-1v3l1 2-1 2h-1v-1h-1l-1-1-1-1h-1l-1 1h-1l-1-1v-1l-1 1-2 2-2-4-3 1-1 2-1-1v-1h-3v-1l-1-1v1l-2 1-1-1-1 1-1 1v-1l-1-1-1 1-3-1v-2h-2l-3-1-1 1v-1l-3-1h-1l-1-1h-2l-2 1v-1h-4l-4 1h-3l-1 1-2 3h-1v1l-2-2-1 1v5h1v1l2 3 1 1v2h-1l1 1v3l-1 1-1 2-3 1a123 123 0 0 1-8 11v5h1l1 1v1l-1 1h-1l-2-1v1l-1 2-1 2-1 2v2h1l1 2 1 1 2 1v1h2v1l1-1 1-1 3 2v-1l3 1h2l3 1 1-1 2 1 1 1 1 1 1 1 3-3 8-2 2-1 1-1 1-1h1l1-1v-1h3l1-1 1 1 1-1 1 1v-1h3l3 3h2v2l1-1v1h4l1 2h3v5l-1 1v1h1l1 1v1h1l1 1v1l-1 1h1v2h1l1 1h1v5l2 1v1h-1l-1 1-2-2v1l-1 1-1-1v-1l-1 1v-1l-2 1-1-2h-1v3l1 1v1l-1 1v2h-1v1l-1 1-1 1v1l-1 1v1l-1 1h-2v1h2l1 1h2l1-1v1h1l1-1 1-1c2-1 3 0 4 1l1 2 1 2c2-3 0-4 0-6l4-2c2-1 3-6 6-10 4-4 4-2 9 0 4 3 2 3 5 3 4 0 9 2 9 4 0 3-2 2-5 4s-2 4 0 4c1 0 6 3 5 6-2 3 4 4 9 4 5 1 4-3 5-4l6-1 4-4h9c4-1 0-3 0-4s-2-2-5-1h-7c-3-1-3-4-4-6-2-2-2-2 0-3 1 0 0-6 2-5 7 1 11-2 15-5 5-3 5-4 8-4l4 1 1-1-1-1v-2l1-1a2 2 0 0 1 0-1l1-1c3 0 4-1 4-2h-1l1-1h6l1 1 2-1 1-2 1-2v-1c-1 0-2-1-1-2l-1-2v-1c-1-1-2-1-1-2l2-1h1l1-1h-3l-1-1v-1l2-1 2-2 1 1v-3Z"></path><path d="m34 325 1-2 1-1v-2l-5-2c0-1 0-2-2-2l-1-1-2 1h-3l-1 1h-1l-1-1h-4l-1 1-1 1v2l-2-1h-2v-3l-2-1-1-2H6l-1 1v1l-2 1v-1h-4l-2 2h-1l-1 1v2l-1 1-1 1-1 1-1 1h-1l-2 1-3-1-1 4-1 2v1l1 2 1 3v-1l2 1 3 2 8 1h3v-4l2-1h3l1-1h7l1-1 2-4 3-1 2 1h3l3 1 1 2 2-1h1l1-2 1-3ZM14 222c4-3 5-3 8-3h1l4 1h1l1-1h3l4 2h3v-1l2-2 1 1v1l1 1 1 1 5 2 1 2 2 2h2l2-1h4l2-1v-2l3-2v-4l-1-2-1-1v-1h-2l1-4v-1l-1-3-1-1v-1h-5l-3-1c-1-1-3-2-3-4-1-1-6-3-7-2l-2 1-4 2v8c-1 6-5 5-7 4l-1-2-4-5c-1-2-3-3-6-3-2 0-6 4-8 6-3 2-2 3-1 4l-1 4-1 11a98 98 0 0 0 7-5Z"></path><path d="M42 196c1 0 6 1 7 3l3 3 3 1h2l2 1-1-1v-1l1-1 2-1 1-1-1-1-1-3v-2l-1-5c0-2 0-4 2-6l1-1 2-4v-2l-1-2-2 1-5-1-6-2c-3 0-5-2-6-1l-3 3-9 2-5 4v9l-3-2-5 2-2 1-2 1-2 2 1 3v5l2 1c2 1 1-2 1-2l1-2 2-2 2-1 1-1v-4h2l2 1 2 2 4 3 3 2v2l3-2 3-1Zm735 465c0-3-1-6 1-7l1-1 1-3v-3l2-1h1l1 1 1 1v-1l1-3v-1l-1-2-1-4-1-2v-3l-2-3-1-3-1-6h-2l-2 3v5l-1 1v1l-1-1-1-3h-1l-1 1v1-4l-1-2v-5h1v-1l2-1h1l1-1 1-2h1l1-2v-1h-6a12 12 0 0 1-2 1l-2 1h-2l-2-1-4 1h-4v-1l-3-3-1-2-1-3v-3l-1 1-2 1-3-2-1-2-1-1h-2l-4-3v4l-2 2v8l1-2h1l6 5v1h-6l1 1 1 2-1 1 2 4 1 2-1 1-2 1v1l1 2 2 3 1 2 2 3 2 6 1-2c2-1 1-3 1-5 1-3 3-1 5 1 1 1 2 2 4 1 1-2 3 2 4 5 1 2 2 4 2 9 0 4 4 8 8 13 2 3 6 4 9 4l-2-4v-1ZM267 446l-1-1h-3l-3-1-1-1h-2l-1 1v3h2l4 3 3 2 3 1 1 1a110 110 0 0 0-2-8Zm261-20-2-2v-2l3-4-2-3-2 1-2 1-2 2-2 1-1 1-1-1-1-1-1-1-1 2v1l1 4v1l-2 1h-7l1 1 2 2-1 1-1 3-1 1h-8l-3 1h1l-1 3-1 1 1 1 1 1h2v1l2 1h3l1 2-1 1 1 5v1l1 1v3l-3 7-1 3-1 1s1 3 3 3h1l1-1 2-1 4-3h2c1 0 0 0 0 0l1 1 2 1h1v-4l2-1h3l2 1h1v-2l1-2v-1l1-1a53 53 0 0 1 1-3l1-2 1-2 1-1 1-1h2l1-1 1 1 1 1v2l1 2v2l1 2v3c-1 2 0 4 1 8l1 2h3v-1l1-1 4-1h2l1-1 1-1 1-1 1-1 3-2c3-2 5-1 6-1l-1 3 3-1 6-2c2 0 3 1 3 2h1l1-2v-6l-1-1-1-2-1-2c0-2-2-2-4-3h-2c-2 0-4 0-5-2v-2l-1-4-2-4h-4l-7 1-2 2-1 1-1-1-1-1h-1l-2-1v-1l-2-1h-3l-1 1c-2 1-4 2-5 1l-2-1v-1l-2 1-2 1h-5l-3-1c-2-1-2-2-2-4l1-3 1-1 1-1v1a20 20 0 0 1 6-2l2 2 1 1h2l2-1 1-1 1 1 2 2h1l-1-2-1-1v-1a44 44 0 0 0-5 1Z"></path><path d="M382 414v-5l1-2 1-1h2l3-1 1-1h1v-1l1-2h3l1 1-2-3 4-2v-2l2 1 2 2 3 3h5l3 3 1 2c-1 0-1 1 1 1l2 1h1l-1 2-2 3-1 1v1l5 2h9l2-1h2c1 0 2 0 3 2l1 2 1 3 5 11 35 21h3l2 1 3 1 2 3v6l5 1 6 1h1l1-1 1-4 3-6v-4l-1-1v-8h-3l-2-1-1-1h-2l-2-2 2-2v-3h11l1-2 1-2v-1l-2-2v-1l2-1h6v-1l-1-4 1-1 1-2h1l2 2h1l1-2 3-1 1-2h3c2 1 3 2 2 3l-3 4v1l1 1 1 1h5v-1h3c2-1 2 0 2 1l1 1 1-1 1-2 2-2h3l1-1 2-1 2-1 1-1 1-2h-4l-3-1h-2v-2h-3l-1-2a4 4 0 0 0-1-2c0 2-3 4-5 4l-2 1-2-1c-2 0-2-1-2-2v-2l-2 2-1 1-2-4c-1-1 0-2 1-2l1-1 3-1h1v-1l1-2 3-2-3-2-4 5-1-1v-1s-8 11-11 11h-3l-1 1-1 3h-1l-2 2v6h-2l-1-1c-2 0-3-1-3-2v-1l-1-2v-3h-2l-12 1h-1 1s0-9-3-10h-4l-1-2v-3l1-9h-4s-4-10-8-10h-2c-1 1-2 2-4 1h-1a63 63 0 0 0-22 2l-3 1-2-3c-2-4-5-9-10-10l-13-8c-5-4-10-8-13-8l-27 10 3 53 10-1v-3Zm-293-9c0-6 3-5 5-8l2-2-6-1-1-1-2-2v-1l-2 1-1-1h-2l-2-1h-5l-4 2-3 3-3 2h-1l-2-1h-5l-2-1h-5l-2-1h-8l-1-1v-1l1-1 1-1-2-2h-1v1l-2 1-1 2 1 2v1l2 3 2 2v1l1 1c1 1 0 2-1 2l-1 1h-2l-1 1v6l-1 1 2 2 3 2v2l1 1-1 1v2l1 1v1l2 1 1-1h2l1-1h4-1v-1h3l2-1 1 2v1h2v-1l1 1 4 1h4v-1h4l-1-2v-1l1-2h1v-1h2v-1l1-1h1l3-1h3l1 1 1 1 1-1h1v1-1h6l-1-2c-2-4-2-4-2-9Zm185 45h1l-1-2v-2h-1l-1-1-2-1-3-2-1-1-1-1v-1h3l1-1v-1l-2-1-2-1-1-3v-5l-2-1-2-1v-2l-1-1h-3l-13 3h1v7l1 2v2l3 2a50 50 0 0 0 5 1l3 3v1h1l2-1 1 1 3 2h3l1 1 1 1a121 121 0 0 1 3 7l3-2v-2Z"></path><path d="M499 469h-1l-6-2a71 71 0 0 1-15-3l-2 2-2 2-2 1c-1 0-2 0-2 2l-1 3-1 4c-1 4-4 6-6 6h-4l-1-1v1l-2 2h-6v2l-1 2-4 3c-2 2 0 4 0 4v3l-1 1-2-1-1 9h5l-4 3 1 6v10c0 4-1 5 2 7s8 0 9 0l2 1-2 3c-3 2-4 5-5 7l-1 3c-2 1-3 4-3 7l2 4 2 2 8 1h3a14 14 0 0 1 6 0h4l3-1c1-2 2-3 3-2l2 1 3 1 1-1 4 1h4v-7c-1-1-2-2-1-4l3-4 4-1h4l2-1h2l1 1v-1l-2-3v-1l2-1 5-2c2-1 4-2 5-1v1l1 1 3-1 1-1 1-1v-4l-1-2-1-2h1l4-1-1-1v-2c1-3 2-4 4-4l4-1-1-4-2-5-1-2h11v-5l1-2 5-8-1-1v-2c1-2 2-2 1-3l-1-2-3-4h-1l4-5 1 1v1l2-2 2-4c1-2 1-3 4-2l7-1 2-1 3 1a48 48 0 0 1 5 0h5v-1l-1-2v-2h4v-1l-3-1c-2-1-5 0-6 1l-4 2-1 1 1-1 2-3h-5a41 41 0 0 0-5 3l-1 1-1 1v1l-3 1-4 1v1h-2l-1 1h-1v-1l-1-2c-2-3-2-6-2-8v-1l1-2-2-2v-4l-1-2v-1h-3l-2 2-2 2v2l-1 2-1 1v1l-1 1v3l-1 1h-1l-2-1h-3l-2 1v5h-1l-2-1h-1v-2l-2 1-4 2-2 2h-1l-2 1-2-4-1 1ZM27 430l5-4 1 1h4l1-1 1-1 1-1v-6l-1-2-2-2c-2 0-2-1-3-2h-4l-2 1-2 1-1 1-2-1h-1l-1 1-1 1v2h-2v3l-1 1v1l1 1-1 1v1l1 1 1 1v1h1v1h7Zm714 158h1-1l-1 3 5 3 2 1h4l2-1 1-1 3-1h1l5 2 2 1 3-1h1l5-1 2-1h-1l-1-1v-6l-1-1-2-2-2-1-2-1-2-1-2 1h-16l-2 2-2 2-3 1v2l1 1ZM346 406a456 456 0 0 0 9-1l3 3c6 3 8 9 9 11l5-1-3-53v-1l27-10 14 8c5 4 9 7 13 8 4 2 7 7 9 10l3 3h2l9-2h14l3-1 3-1c4 1 8 9 8 11l4-1v15h4c3 1 3 8 3 10a147 147 0 0 0 14-1v1l1 1v4l3 2a77 77 0 0 1 3 0v-2l-1-3 3-2 2-3v-1l2-1h2c2 0 9-8 10-10h1l1 1 3-5 3-5c2-2 4-2 8-2h3c4 0 7 1 9 3l3 1h1v-5l2-4 3-2c1-2 2-2 3-2l1 1 2 1 3 1 6 2 5-1h31c4 0 5 2 5 2l5 3h1l6 2v-3l-1-2 1-2 2-1h1-1l-1-1 1-2 2-1v-3l-1-2-1-2-2-6-1-5 1-1-2-2-3-2-2-2h1l1-2c1-2 1-2 3-2h4c3 0 4-1 5-2l5-2 3-1v1l1 1h4l2-1v-2l-3-3 7-24 5 2h6l6 2h1l2-1 1-2 2-1 4-3v-2l1-6-1-2-1-6c1-3 1-3 3-3h2a10 10 0 0 0 7-7l2-3 2-1h4l-2-2h-1l-2-2c0-1-1-2-3-2-2-1-2-2-2-3l-1-2-1-1-1 2-2 4h-1c-3 0-5 0-9-2l-3-3 1-1c-1-1-3-3-5-3-3-1-3-3-3-4l-1-1-3-5c-2-4-3-4-4-4h-1l-7 1-4 3-9 1h-1l-2-1v-1l-1-2h-3v-5l-1-1-1 1-2 1-2 2-1 1v2l-3 4h-1l-25-42a155 155 0 0 1-13-12l-1-2h-1v-2l2-2 2-1 2-3-6 2-1 1-2 1-2 1-4 2c-2 0-2 1-3 2v1l-1 2-2 1-2 1-4 3c0 2-1 2-3 2l-1-1-2-1-6 4-1-5 1-1c0-1 0 0 0 0l1-1 2-1h1v-1l-1-2h-2l-1 1-4-1h-1l-2-1v3l-3 1-2-1 1-1v-4l-3-1h-1l1 2v1h-1v-1h-3l-1 2h-3v-1h-4v-3l1-1 1-2v-4l-1-2-2-2-1-3-1-3-1-1-1 1h-2l-1 1h-2l-5-1c-2 0-4 0-7-2h-1l1 1v1h-3l-1 2v1h-3v3l-1 1-9 3-12 5-3-2v1l-1 1h-4l1 2h-5v1l1 2-1 1-1-1h-2l-1 1h-4l-2 1-2 1-6 1-1 1-4 1-2 1-1 1-1 1h-1v-1h-12v1l-1 1v1l1 1-2 1v3h4l2 1v1l-2 1h-2v2l8 2 1 2 1 1v1h-10l-2 1v1l-2 2 1 2 1 3v3l-4 3-2 1-3 1-1 1 1 1 1 1h1l2 1 2 1-1 2h5l2 1 1 1 1 1 3 1c2 1 2 3 1 5a19 19 0 0 0-1 2l-2 3c-1 1-3 2-8 2-3 0-4-1-5-3v3l-3 3h-3l-1-1-3-2-2-1-4-1c-2-1-2-2-1-2v-1l-2-1a89 89 0 0 0-1 0l-1 1h-5l1 2-2 2h-1l-2-2-1-1-2-1h-1l-2 1v1h-2v-1l-1 1v1h-1l-3 1v5c-1 2-2 1-4 1s-2-1-3-2h-1l-1-1-2-1-1-2-3-1-1 1h1v6l-2 1h-1v-5l-2-2-1-1-3-3-3-2-1-1-4-1h-7v-1c0-2-2-3-3-3h-2c-1 1-2 1-2 3v1l-1 1h-1l-2-1-1 1-1-1 1-1-1-2h-6v1l1 1h-1l-2 1c-1 3-2 6-8 7h-3v6l-4 3-5 2a74 74 0 0 0 5 9l-5 5-10-12-3 4-2 5-3 3v1l1 3-1 3h1v1l2 2-6 11 6 2 3 1v7l2 2v-2h5l5 3 2 3 3 4 1 1 2 4v1l-2 1h-1v2l4 2 1 1 2 2 6-4c2-2 9-2 11-1s5-2 8-3c4-1 6 7 7 12 1 4-1 9-5 9-3 0-9 2-12 5-2 2 3 8-1 8s-7 3-5 4c2 0 5 5 7 7l4 8c1 2 8 3 13 4 4 1 2 6 0 13v5l4-4c5-5 5-5 12-7Zm309 145-3 3c-2 1-2 1-2 3v5l-1 2-2 3 3 2 2-1h1l7 4v1l1 2 1 1a42 42 0 0 1 10 4h3l1 1-1 1 2 1h1l3 1 1-1a163 163 0 0 0 6 1l1-1 3 1h1l3 2v3h1l1 1 4 1h4l2-1v1l1 2c1 1 1 0 2-1h2l4 2h3a23 23 0 0 1 1 0l1-1h1l-1 1 2 2c1 1 1 0 2-1l2-1h3l1-1 1-1v-1h1v-1l-1-2v-10h-2l-6 1-7-3-1-1-1 1-1 2h-2v-2l-2 1-2-2-2-3h-2l-1 1-2-1v-1l-2-2h-3l-3-2-1-1c-2-1-2-2-2-3l1-1h-5l-3 1c-2 0-2-2-3-4l-1-2-3-2-3-1-3-1-1-1-1-1v-1l1-1-1-1-1-1h-6l-1 1v1l-1 1-1 1h-1l-1-1-1 1h-1ZM271 416l1 1v1l1 2 2 2 1 2-1 1-2-1-4-1-6-2-1-1-1-1-1 2v2l1 1v1l1 1 2 1v5l2 2 1 1 2 1 1 2h-1l-1 1-2 1v1l2 1 2 2h2l1 1h1v2l1 1v2l-1 2 5-3 3-2 4-3h3l2 1v1l2 1v1l-1 2v2l-1 1v2c1 1 2 3 5 4 2 2 3 1 4 1h1v-1c-2-3 0-8 0-11s3 3 3 3l1-6 1-9c1-2 6-3 8-4 1-1-4-4-7-5-3-2-8-9-11-15l-2 3-2 2-1 2c-1 2-2 4-4 4h-2l-2-2-6-6h-3l-1-1-2 2Z"></path><path d="m361 458 5 2c2 1 3 1 6-2 3-2 4-4 4-6 1-2 1-3 3-3l3-1h8c1 0 4-4 6-3h6l4 4 4 2 3 1 3 2 3 2 2-1c1 0 3-1 5 1l2 2 1 3 6 3 5 2h7v18l1 2 4-1 1 1 1-1 1-2h6c2 0 5-1 5-5l1-4 1-3c1-3 2-3 3-3h2l1-2c1-1 1-2 3-2l6 1 4 1-1-3v-2l1-1-2-2-3-1-3-2h-3l-34-21-5-11-2-3-1-2-2-1h-4v1h-1l-2-1h-2l-2 1h-2c-2 0-4-2-5-3l-1-1 2-2 2-2 1-2h-4l-1-2v-1c0-2-2-3-3-3h-6l-3-3a72 72 0 0 0-2-3l-1 1-3 2 1 3v1l-2-1-2-1-1 2v1l-1 1h-1l-3 1-1 1-2 1-1 1v3l1 1v1l-1 3-10 2h-6s-2-7-8-10l-3-4c-1-1-1-1-6 1h-3c-6 3-7 3-11 7l-4 5 5 4c3 4 1 4-1 7-1 4 3 10 5 10 1 0 2-3 5-1 3 1 1 3 0 6-1 2 1 3 4 5 2 3 3 5 2 10v1l3-1 7-1Zm382 177-2-3-2-3-1-3-1-2v-1l2-2 1-1-1-1-2-4h-1 1v-2l-1-2 1-1h4l-5-5v1l-2 1v-8l2-3v-4l5 3 1 1c1-1 1 0 1 1l2 2 2 2 2-2 1-1 1 1v3l1 3 1 2 3 3 3 1 3-1h4v1l2-1h1l2-1h6l-1 3v1l-2 1-1 1v1l-2 1h-2v4l1 3v3l1-2h1v1l2 2v1-3l1-1v-2l2-3 1-1 1 1c1 0 2 2 2 6l1 3 1 3v1l1 2v2h2v-12h1s1 2 3 2v-1l2 1 2 1 6-14-2-1s0-3 2-4l1-1 1-1 2-9v-1l8-6c3-2 6-3 8-2l2 1 1 1-1-2-1-1 1-1 2-3-3-1-2-1-2-1-4-2-3-1-2 1a261 261 0 0 1-12 9l-2 1-2 1-1 1-1 1-2 1h-9l-4 1h-1l-5 1h-6l-6-2-2 1h-1l-3 1h-4l-2-1-6-3a144 144 0 0 1 1-3v-3l-2-1-2-1-3 2 1 3v4a34 34 0 0 0-1 1v1h-5l-1 2-2 1h-1l-2-3v-1 1l-1 1h-2l-2-1-4-1-1-1-3 2-1-3-2 1h-4l-4-2h-1l-1-1v-3l-3-2h-1l-3-1-1 1h-3l-3-1-1 1h-3l-1-1-2-1v-1h-2l-1-1c-1 1-1 0-2-1l-8-3h-1l-2-3v-1l-7-4-2 2a28 28 0 0 0-4-3l1-1 2-2v-2l1-5c-1-2-1-2 1-3l3-3 1-1h1l-2-3-1-2-1 1-2 1h-1l-2-4-1-1c0-2-1-2-2-2l-2-1h-3l-2 1c-2 0-2-2-3-3v-5l-1-3-1-1v-1l-3-4v-5c-1 1-2 2-3 1-2 0-2-1-2-3v-2l-2 1-2 1-2-1-2-1h-1l-6-2-2 1-1 1c-2 0-3 1-4 3v4c-1 2-4 3-5 3l-4 3-3 1-2 1v1l1 1v7l-3 4-2 3a37 37 0 0 1-3 3l-4 4c-2 1-3 4-4 7l-2 5-4 5-2 3-1 1-6 4-4 1-4 1c-2 1-3 1-3-1l-1-1-7 3c-6 4-3 12-3 12l1 1 5-1h1l-2 9 3 2h3v4l4 9v4h-10l-3 1-2 1-3-1-2-1h-3v2l-2 2a9 9 0 0 0-4 2v1c0 1-3 3-1 6s8 4 13 3c6-1 5 1 2 3-3 1-10 1-5 10s16 11 17 11l9-2c3-1 3-5 4-7s0-4-1-7c-2-3 1-3 2-3h4c1 1-1 1-2 2v5l3 2c-1 1-2 1-2 3 0 3 2 4 2 10s-1 7 1 10l3 13c0 5 3 10 5 14 1 4 0 8 3 13s9 13 11 21 5 15 9 18c5 4 11 20 12 24s1 12 9 19c7 7 10-2 10-4s2-3 6-4c5-1 3-3 4-7 1-3 4-4 7-6s1-6 0-11l1-9c2-3 4-9 4-13s-3-5-4-12c-2-8 2-10 8-17 7-7 11-5 13-7l3-8c1-2 5-3 7-5l8-8c3-1 2-3 4-6l5-7c2-3 5 0 11-5 7-5 5-8 5-11s2-5 4-6l8-4c3 0 5 1 5 2l7 1 6-3 3-4v-1l-2-5Zm-437-91h-3v-5c0-3 1-3-1-9-2-5-5-6-8-8h-2l-3-1-3-2-1-2 2-1a71 71 0 0 1-7-9l-1-1h1v-3l-1-1v-1l1-1h1l1-1v-2l2-3h1l1-1 1-1-1-2v-3l1-2-5-1-3-2-1-1v-3l-2-1-2-2v-3l-1-3v-2l-1-1-2 1-2 1-1-1-3-1h-9l-3-1v1l-4 2c0 1-4 5-8 7l-3 1v2l1 1v10c0 6-2 11-3 12l-23 14c0 2 3 10 5 12l2 2 2 2v4h2c4 0 15 5 25 11s29 23 31 25h17l10 2 2 4h5v-2l-4-4-2-5v-7l1-4c1-1 2 1 3 2h2l-7-8v-5ZM72 427v-1l1-1 1-1v-3h-1v-1h-2l-1 1 1 1v2l-1 1-2-1h-1v1h-3l-2 1-3-2h-1v1l1 1-1-1-2-1-1-1v-1h-4v2l-1-1h-1l-1 1h-4l-1 1h-4l-1 2h-6l-5 4-2-1-3 1v4l-2 1v1l-1 3h-2l-1 1v2s1 0 0 0v1a3 3 0 0 1-1 0v1h-5l2 5c2 2 6 1 9 4 2 3 1 5 3 6 3 1 4 2 5 5 0 4-2 3-2 5 1 3 5 4 6 8s6 7 7 9c2 2 3-1 3-4 1-3 3 2 5 2 3-1 1-3 0-4s-2-2-1-4c2-1 5-2 2-3-2-1-2-2-2-4 1-2 5 1 8 2 3 2 0-2 0-4-1-2 1-3 1-2 1 2 4 5 6 4 3 0 1-3-1-4s-4-2-4-7c-1-4-4-3-7-3-2 0-3 2-4-3 0-4-4-7-5-10-2-3 0-5 4-4 5 1 2 4 5 4 2 0 0-3 1-3 0 0 2 3 4 2 2-2-2-4-2-4h4c0-2-4-3-3-5l3-3c1-1 4 2 5 0 1-1 4 0 8 1l2-2v-2Z"></path><path d="M179 487h1c3-1 5-1 6-3v-2l1-2 2-1v-5l1-3h1l1 1c1 1 1 2 3 2l6-2 1-1c2-1 4-2 5 0l1 2 1 1 5-1 7-2 9-3 4-1 6 1 5-2 1-1h1v2l1 1 4-3v-1l1 1h2l4 1h5l-5-4-2-3-1-2-1-3-1-1v-3h1l2-1-1-2v-2l-1-2-2-3-3-1h-2c-1-1-3-1-3-3l-1-2v-8h-1c0-2-1-3-2-3l-1-2-1-1h-1l-3-1h-1l-4 1h-6l-1 1c-1 5-7 5-12 6-6 1-13-1-23-2-10-2-11-4-14-6-2-2-5-2-10-4s-8-1-21-1c-12 1-12 4-15 7s-6 5-9 5c-4 1-5-1-10-1l-10-2c-4-1-5-4-6-7h-6v2l-1-1-1-1v1h-1c-1 1-1 0-1-1l-1-1h-3l-3 1h-1v2h-2v2l2 1v4h-2l-1 1v3l-1 2 3 1c6 1 5 4 3 8s1 8 4 8c3 1 4 9 1 11-2 1-3 5-2 6s4 1 5 3c2 2 2 10 5 11 4 2 12 2 15 7 2 4 13 6 17 2s3-8 6-7c4 0 8 2 11 5 4 4 10 3 15 2s5-2 6-5c2-3 4-3 6-3 2 1 3 3 8 1 5-1 2 2 1 3v3h4Z"></path><path d="m452 610 1-6-1-2 1-3h1l2-2 6-4h2c1 0 0 0 0 0v1h2l2-6v-1l-3-2-3-1v-11h-9c-3-1-3-3-4-5l-1-4-2-2-1-2c-2-1-3-2-3-4 0-3 2-6 3-8l1-2c1-2 2-5 5-7l2-3-1-1c-1 0-6 2-9 0s-3-3-2-7v-9l-1-7 2-3h-3l1-9h2l1-3c-1 0-2-2-1-4l5-4v-1c1-2-1-4-1-4v-17l-6-1-5-1s-4-1-6-4l-1-3-2-2h-7l-3-1-4-3h-2l-5-3-3-4h-6c-2 0-5 3-6 4l-4-1-4 1h-3c-1 0-2 1-2 3l-4 7c-3 3-5 2-7 1l-5-1h-7l-3 1c1 5 5 11 5 11 2 6-2 5-5 5l-17 2c-4 0-12-4-16-7-5-4-7-2-13-4-5-2-3-4-4-7h-1l-2 1-2-1-6-5v-2h1v-2l1-2 1-1-1-1-1-1-2-1h-3l-4 3-3 2-8 4v1l-4-2-3-1-3-1-3-3-1-1v3h-3l1 2v2l1 3 1 2 2 3 5 4c3-1 3 0 3 1l1 1 2-1 3-1v1l1 2v6l2 1c1 0 2 0 2 2v3l1 1 3 1 5 2h1l-1 1-1 1 1 3 1 3-2 1h-1v1l-2 2v2l-2 2h-1v6l1 1 7 8-2 2 1 1 3 1a64 64 0 0 1 4 2c3 1 6 2 8 7 2 7 2 7 1 10l1 5h2v5l7 8 2-1c2-1 4 0 8 1 3 0 3 0 5 3 1 2 3 8 7 12 3 5 2 8 4 9l12 2c5 2 3 4 5 6l8 4 8 1c5 1 4 3 9-1s12-5 15-3c4 3 5 11 6 14s8 3 10 2h5c1 2 7 2 12 3 5 0 12 6 18 4l5-2v-1ZM-84 180v1l1 3h1l2-5v-9l3-2v-1c3-2 4-3 3-7l-4-8h1s3 0 3-2c1-2 1-5-3-8h-1v-21c0-1-4-11 4-17 5-3 6-2 7-1h2c2-2 2-5 2-6v-2l-2-1h-1l-1-1 2-3 2-4 1-3 2-18s6 0 7-3v-2l2-5 5-8v-4l-1-2-1-2 1-1 1-1a54 54 0 0 0 5-9c1-2 3-1 3-1l3 2v-2c1-5 1-9 3-9 1-1 5 1 10 2l3 1 2-2-1-1v-2l1-3V7l2-1 2 2 1-2 1-1c1-2 2-3 5-2 2 1 3 3 3 6l1 4c2 3 3 3 4 3l3-1 3-2c2-1 3-2 4-1 2 0 3 2 4 3l2 1 2-3 1-1 1-1 2-3 2-10 2-5 2-4 2-2 4 1c3 0 3-2 4-2l1-1 4 5v1l2 1 3 4c2 3 2 3 0 4l-1 2c-2 2-2 3-1 3l1 2v1l1-1 1-2 1-1 3-4c2 0 2-2 2-3l1-2c2 1 4 3 5 2v-2c-1-2 0-3 1-5l1-2h-5c-2 2-4 1-5 1-1-1 2-3-1-4l-5-3h8c2 0 4-3 5-4 2-1 5-1 5-3 1-2-2-2-4-3-2 0-6-1-10-4-5-2-6-3-8 0s-4 4-5 3c-2-1-7-3-8-1s-3 5-6 3-7-2-10-1-10 3-12 5c-2 3-6 5-13 3-6-2-5 3-2 5 3 3 1 5-3 4-4 0-3 0-5 4s-5 5-7 4c-1-1-3-4-4-3-2 1-1 4-1 4h-3l-1 4-3-1c-1 1 1 3-1 4-1 1-3 1-3 3l-2 4c-1 1-3 1-4 4 0 3 0 6-2 7l-10 4c-4 2-5 5-4 7v9c0 3-3 4-5 4s-1 3-2 5c0 2-2 3-3 5v4l-3-1c-2 1-1 3 0 4s3 1 2 4-3 2-3 6-2 7-3 8l-4 6c-2 2-1 4-2 5s-2-2-4-1l-3 5-5 10-7 6c-3 2-5 7-7 10l-7 4c-2 1-4-2-5-1-1 2 1 3-4 6-4 3-5 8-6 14-1 7-3 5-4 7-1 3 2 7 3 6s3-1 3 1v5c0 1 3 1 4 8s-1 11-2 12-4 1-4 4 2 4 6 6c3 1 3 5 9 7 7 2 10-3 12-3 2-1 7-5 13-13l9-5 2-1Zm931 579v-1l2-2h1v-1l-1-1-1-1-1-4-1-1v-1l-2-4v-1l1-5c1-2-2-4-6-7-3-2-4-7-3-9v-1c2-1 2-2 2-5v-3l2-2 1-1-1-1-2-1v-5l-2-2-2-2-3-4-1-3-4-6v-2l1 1h3l1-1-1-1v-1c2-1 1-1 1-2v-2l1-2v-1l2-2h8v-2c0-2 1-2 3-2h3l-1-1v-1h1l2-1h4v-1s0-2 2-3l1-1 2-1 1-1 1-3 3-2h1l1-1h-2l-3 1-3 2c-3 0-4-1-6-4l-2-4-4-2-1 1h-1l3-10h-6v-5l-1-3 1-3h-4l-2 1-3 1-4 1v-1h-1l1-1 2-3v-1h-1l-2-1h-1l1-2v-1l1-1 2-2 1-4h2v-1l2-2h2l1-2 1-2-1-1 1-2v-1l1-5-1-3-1-6h-1l-2 1h-1v-2l1-2c0-3-1-4-2-4l-3-3-4 3v4l-2 2-2 2v1l1 1v2h-2l-2-1c-1-1-4 0-6 1l-9 7-1 9-2 2h-1l-2 4 2 1-6 14-2-1h-2l-3-1v9l-1 2h-1l1 4v7h-1l-1-1-1-1-1 1-1 1-1 1v4l-1 1-1 1v7l2 5h2l5 9 6 13 1 7c0 1-2 3-2 10-1 6 2 5 6 6 4 0 10-1 16-8 6-6 7-3 8-2 1 2 4 4 5 8 0 3 2 4 2 9 0 4 4 7 4 10s0 6 3 8 2 3 4 8l1 9c1 5 1 9-1 11v3l3-4 4-5Z"></path><path d="M9 55v-9c-2-2-1-3 0-4v-2c-2-2-3-3-2-6v-6l-1-2-2-2c0-3-8-6-10-7-3-1-5-4-6-7l-2-2-1-1h-1l-1 2v4l-1 3v1l1 1v1l-2 2-4-1-9-2-2 9-1 3-4-3-1 1-2 3-3 6-2 2v2l1 1v5c0 3-3 6-4 8h-1l-1 5-1 2c-1 3-5 3-7 3l-2 18v3l-3 5-1 2v1h1l2 1 1 2-3 6h-2c-1-1-2-2-7 2-8 5-3 15-3 15v21c5 4 4 7 4 9-1 2-3 2-4 2l3 8c2 4 0 5-2 8a54 54 0 0 0-3 3l-1 3v5l-2 5h-1l1 1c2 3 0 6 1 10s2 9 5 12 5 12 8 13c2 2 3 3 2 4-1 2-3 3-1 4s2 4 3 8c1 5 7 3 11 0 3-4 7-7 14-8 6 0 4-6 4-9l2-16 1-9c0-3 1-7 9-10 7-3 6-11 6-16s-9-9-13-12c-4-4-3-8-3-11l2-7v-10c1-6 4-6 5-7l3-2c0-1-1-5 3-5 3-1 3-3 4-4l5-1c2-1 5-3 6-8 1-6 3-6 4-7v-5l-2-4c-1-2 0-4 1-6l2-6 4-6 5-1a56 56 0 0 1 0-11Zm525 343-1 1-3 1v2l-1 1h-1l-2 1-1 1-2 2c0 2 1 3 2 3l3-2 1 1v1c-1 1-1 2 1 2h4l5-4v-1h1v1l1 2v1h2l1 1v1h2l3 2h4v3l-2 1-2 1-2 1-2 1h-2l-2 1v2l-2 1-1-1-2-1h-3l1 2v1l1 2-1 1-2-2-1-1-1 1a4 4 0 0 1-2 1l-2-1-1-1-2-1-4 1h-3v1l-1 1v2l1 3 1 1h9l2-1 3 1 4-1h4l3 1v1l1 1h1l1 1h2c0-1 0-2 2-2l7-1h1l3-1h3l1-1-1-3v-2l1-2 2-1 4-2 1-1 2-2 2-1c2 1 3 1 4-1l1-1v-1l1 1 1 4 5-1c2 0 3-2 4-4l2-3c3-3 5-4 7-3h5l4-5 4-2 7-4 4-3 2-1h3v-2l-1-3-5-1-1-1c-4-1-5-3-5-3s-1-2-5-2h-11l-20 1-5 1-7-2-2-1-2-2-1-1-3 2-3 2-2 3 1 3v3l-2 1-3-2c-2-1-5-3-9-3h-3c-4 0-6 0-7 2l-3 5 4 3Zm-536 9v-3l1-1 1-1v-2l1-1 1-1 1 1v1-2H2v-2h3l1-1h1v1a326 326 0 0 0-1-5l-1-1h2l1 1v-1l-4-3v-4l1-1 1-2v-2l-1 1H1v-1l-1-1-1-1h-6l-1 1-1-1h-2l-2-1h-2l-2-1h-1v1l-2-1-2 3h-1l-2-3h-2a4 4 0 0 1-1 2v1l1 1v1h-1l1 1 1 1 1 1v2h1v1h1v3a108 108 0 0 0 10 10v1l2 2 1 1 1 1v1h-1l-3 1h1l3-1 2 1 2 2 1 1 2 2 1 1v-4h-1Z"></path><path d="m6 416 1-1H6v-1l-1-1 5-6v1l1 2 1-1h1v-1l-1-1v-1h4v-1h-1v-1h-1l-1-1-2-1-2-1-2-2-1-1-1-1H3v-1H2l1 1v1l1 1-1 1H2v-1l-1 1H0v3h-1l-1 1v2l1 1v4l5 5 2 3v-3Zm341 270-24 3c-5 0-19 2-20 7 0 5-3 8-4 9l-3-1-4-2c-2-1-5 0-8 1a52 52 0 0 1-8 2h-4l-4 1h-3l-1-2-1-1-2 5c1 4-1 8-1 11s3 2 4 4v8c0 2 4 3 3 6 0 4 0 3 2 6s-1 5 8 5c9 1 9-4 13-8 3-3 3-1 8 1 4 2 9-1 11-3 3-1 2-4 5-4 4 0 8 0 10-3 3-3 6-3 10-5l15-4c5-2 6-2 9-8s8-7 11-8l-9-26-13 6Z"></path><path d="M13 445a12 12 0 0 1 2 0v-1l1-1-1-1v-1l1-1h2l1-3 1-1 2-1v-2l-1-2v-1h-1l-1-1v-1h-1l-1-1v-8l1-2-1-2v-2h-2l-1-2v-1l-1-1-1 1h-1l-1-2-4 5v1h1v3l-1 2 1 5c0 3 0 13 2 16 1 3 3 4 2 5h-1 3Zm377 171-1 1 1 2 1 4-2 3-3 2-2 1v3l-2 12 1 8-6 21-16 7 8 26c3 0 5-1 8-3s5-1 9-1c3 0 2-3 2-5 1-3 3-4 5-4 3 0 5-1 9-4 3-2 2-6 4-8s5 0 9 0c5-1-1-6-2-9-2-3 0-3 2-7 1-3 2-4 3-2 2 2 2 1 3-1l4-7c4-4 4-5 6-11s-1-4-3-5l-5-7c-2-2-2-5-4-5h-11c-6-1-7-5-9-7l-3-5-1-4-3 1-2 4Z"></path><path d="m381 644 3-12v-3l2-2 3-2 1-2-1-3v-4l2-4h1l3-1-2-4c-2-6-8-2-9 0l-3 5c-2 1-4 1-4 3 0 1-1 5-3 6-1 2-4 1-7 2l-8-1c-2-1-5 1-6 2h-3l8 18 23 2ZM47 286l-1-1 1-1-1-1v-1h2l2 1 1-1 2-2v-1h4l4-1 1-1 3 1h4l1 1h1l3 1 1-1 3 2 2-1 1 3h3s0-1 0 0h1v1h1v-2 1h2l2-1 1 1 1 1 1-1 1 1 1 1 1-1 3-2 2 4 1-1 2-1 1 1h1l2-1 2 2 1 1v1l1-1v-3l-1-2 1-1h1l1-3c-2 0-5-5-6-7l-3-2-3-3v-5l2-3-1-1-3-2h-1l-2-2-2-1h-2l-3-3-2-2-1-3v-2l-4-2 1-1 1-2v-1l-1-2 1-1v-3l-3-2-1-1-5 1h-2v-2l-1-1h-4v-1h-2l-1-1-1-1-2 3-1 1-2 1h-4l-2 1v2l-1 1v2l3 2-2 1h-3l-1 1-1 2-1 1s-1 0 0 0l-1 2v1l-1 2v1l1 1 1 1h-2l-1-1h-1l-1 1-1 1h-2l-2 2-2 1-3-1h-1v1l3 10 3 3c1 1 3 3 3 5l2 3 2 3-1 3-2 3v2l5 4v-2Zm-96 83h2v-2h-1v-3h-1v-1l1-1v-1h-2v-2l1-1h1v-1l-8-2-3-1-2-1v-1l-1-1v-2l-3 1h-6v1h-1v1l-2 1h-1l-1-1h-2v1l-1 1h1v3l-1-1-1-1h-1v4l1 1h-1v1h-1v-1l-1-1h-2l-1 1-1-2-1-2v2l-1 2-1 2-2 1 1 1v2h-2v-2h-1l1-1h-1l-1-1-2-1v-3l-3 2v2l-1 1-1 1v1h-2l-2-1-2 1-1 1-1-1-1 1h-1v2h1l1 1c-1 1-1 1 1 2v1c1 1 0 2-1 2l-2 1-1 1v1l1 1v1l2 2v1h-1l-1 2h1v1l1 2 3 1v1l2-1h1v3l-1 1-1 2 4-2c1-2 3-3 10-3 8 0 9 6 12 13 4 7 8 8 10 11s7 10 13 11c6 0 14 9 15 10 2 1 4-1 6 2l5 6c2 1 4 1 5 4l3 8c1 3 0 4-2 9-3 5-1 6 1 7 1 1 8-1 8-4l3-11c2-4 0-5-2-7-2-3-1-2 0-8 0-6 5-2 6-1l6 6c2 1 3-2 3-4s-1-6-3-7l-7-3-9-6c-3 0-6 0-6-2v-5c-2 0-7 0-11-2-4-1-5-4-7-6-2-3-3-7-6-10l-9-8c-3-2-4-7-5-10s1-8 6-11c2-2 4-1 5-1h1l2-1Zm268 161-3-3-5-11a1190 1190 0 0 1-20 11h-2l-2-1-4-2-4-1v-1c-1 20-5 36-7 39l1 4 1-1v2l15 3 5-5 1-2c2-2 3-2 5-2h3c2 0 3-3 4-5l1-1-6-7-4-5h1s14-3 19-6l3-1v-4l-2-1Z"></path><path d="M247 467v-1h-1l-1 1-5 1h-10l-9 3a257 257 0 0 0-13 3v-1l-1-2c-1-1-2-1-5 1h-1l-6 2-4-1-1-1v-1 3l-1 2v3l-2 1v2l-1 2c0 3-2 3-6 3h-4v10l1 2h7c2 0 3 1 4 3v4l-1 2-1 1-1 1-2 1-2 4-1 1-1 1v5l4 2 4 2h7a1235 1235 0 0 0 40-25c2-1 4-7 4-12a358 358 0 0 1 0-10l-1-1-1-2 3-2c5-1 8-5 9-6l-1-1Zm84 121 1 6v3c0 2-2 0 0 2 1 2 0 3 1 2 1 0 1 1 2-1v-2l1-3 1-1v-5l-2-1-2-1-1 1h-1ZM79 671h-9v45H60s-2 2-1 4-1 4-3 6l-1 1-1 5c1 1-1 2-2 3l-1 1v3c1 2 2 3-1 5l-3 4 1 1 3-1h2l1 3v3l1 2c1 2 1 4 3 5v5l2 2 2 2 4 6 1 3c3 1 7 0 10-1l2-2 2-3c2-2 4-2 6-2l3 3 2 3c0 2 1 4 5 4h14c3 2 5 2 8 0l5-2h1v-2l1-3h1c0-1 1-2 3 0l8 4 6 1 11-14-1-5-1-2-1-1v-1l5-1v-2h6l-1 5v3c0 4 0 7 2 9l3 2c2 2 4 4 4 6v2l1-1 1-4 1-2 1-5v-1h1l1-1 1 1c1 0 1 1 2-1 2-1 1-6 0-8 0-2 7-9 7-10h5l4-16-1-3c-1-1 1-10 2-13l2-2 1-3v-8h4l1-2c0-2 1-2 3-2 2-1 4-1 5-3l2-3 3-3c-3-3-14-5-15-13l-1-12-2-8-1-8H79v22Zm119-24c-1-2-6-7-9-8s-7-6-6-9c0-4-1-8-3-11-3-2-14-15-14-23-1-8-5-9-5-12l-4-6-7-8-3-7c1-1 1-1 4 3l8 11 6 5c2 0 4 2 5-5l2-10 1-2-7-28-3 5-8 2-8 1c-3-1-5 0-7-2s-7-3-11-2-3-1-8 2c-5 4-9 5-21 1-11-3-15-2-19-3h-2v3l-1 8v2c-1 3-2 7 2 14v81h119l-1-2Z"></path><path d="M259 751c2 0 3-2 4-4v-1l-10-14-13-9c-3-2-12-7-14-12-2-4-2-7-2-10-1-3-3-8-6-11l-2 4-3 2c-1 2-3 3-5 3l-3 2v2h-5v8l-1 3-2 3c-1 2-2 11-1 12l1 3h4l3-2 1 1 2 1 2-6 1-1 5 5v1l4-2 2-1h2l1 1v-1h3l5 1 7 4 3 2 4 5 10 11h3ZM-21 639v1l2 9 1 9 1 3 4 4 1 2-1 3-1 3v16l-1 8-1 7-6 7-9 11c-1 4-3 5-5 6l-1 2 1 3 1 4 1 2 4 5 3-1 3 4 2 5 2 8c0 7 1 11 3 13l4 4h1l-17-1-2 4 1 1 2 2c3 2 8 5 10 10l1 8c4 0 7-1 9-3h2l2 2 1 1 1-1c1-1 3-3 9-3 8 0 12-2 12-5l-1-3v-2l4-1c6-1 10-2 17-7 6-5 8-6 8-8v-4l6-1h5c0-1 1-2-1-4l-2-6-1-2v-3l-1-3h-2c-1 1-2 2-3 1h-1c-1-2 2-4 3-5 2-2 2-3 1-5v-1h-1l1-3h1l2-3c-1-1 0-4 1-6l1-1c1-1 3-3 2-5l2-4h9v-39l-81-43-9 5Z"></path><path d="m-56 531-5 4-5 3c-2 2-4 5-4 8 1 4-2 9-4 10l-1 1c-2 0-3 0-3 2l3 6 1 1v9h1l1 1-1 10v1l-1 1v12l-4 4 2 2 5 7 1 3c0 4 1 6 3 6l4 2a11 11 0 0 0 5 1c2 1 4 1 5 3v3l1 2h3c3 0 8 1 12 4l3 2c3 3 4 4 9 1l13-7h1l80 43v-6h10v-21h1l-1-81c-4-7-3-11-2-14l1-2v-8l1-3-8-4c-1-3-14-1-17-4-2-3 0-4-4-5s-24-4-26 2c-3 7-5 10-3 13 1 4 2 11-4 13-5 2-13 0-18-7-6-7-20-3-21-5s1-7-4-11c-5-3-17-6-21-6h-9v4Z"></path></g><path d="M96 394v1l-2 2c-2 3-5 2-5 7 0 6 0 5 2 10l1 2c2 3 3 6 7 7l10 2c5 0 6 2 10 1 3 0 6-2 9-5s3-6 15-7c13-1 16-1 20 1 5 2 9 1 11 4 2 2 4 4 14 5 10 2 17 3 23 2 5-1 11 0 12-5l1-1v-1c2-4 3-7-2-13-6-7-9-8-15-12h-1c-6-4-5-7-12-9s-9-2-13-5-5-2-6-5-4-6 0-6c5-1 6-4 6-5v-5c0-1-5-1-2-4 4-3 8-5 7-6l-1-2h-1l-4-1c-3 0-3 1-8 4-4 3-8 6-15 5-2-1-1 5-3 5v3c2 2 2 5 5 6h7c3-1 5 0 5 1s4 3 0 4h-9l-4 4-6 1c-1 1 0 5-5 4-5 0-11-1-9-4 1-3-4-6-5-6-2 0-3-2 0-4 2-2 5-1 5-4 0-2-5-4-9-4-3 0-1 0-6-3-5-2-4-4-8 0-3 4-4 9-6 10s-4 0-4 2 2 3 0 6l-1 1-6 3c-1 1 2 2 0 6l-2 8Zm210 42-1 8-1 6s-3-5-3-2c-1 3-2 7-1 11l1 1c1 3-1 5 4 7 6 2 8 0 13 4 4 3 12 7 16 7l17-2c3 0 7 1 5-5 0 0-5-6-5-11v-1c1-5 0-7-3-10-2-2-4-3-3-5 1-3 3-5 0-6-3-2-4 0-5 0-2 0-6-6-5-9 2-3 4-3 1-7l-5-4-1-1v-5c2-7 4-12 0-13-5-1-12-2-13-4l-4-8-7-7c-2-1 1-4 5-4s-1-6 1-8c3-3 9-5 12-5 4 0 6-5 5-10-1-4-3-12-7-11-3 1-6 4-8 3s-9-1-11 1l-6 4-7 6-10 6c-3 2-9 5-7 11 1 7 6 11 7 14 0 3-1 8 3 13 4 4 9 5 12 11l1 1c3 6 8 13 11 14 3 2 8 5 6 6-1 1-6 2-7 4Zm499 274c-2 2-5 2-7 2-4-1-7 0-7-6 1-7 3-9 3-10l-1-7-6-13c-1-2-4-8-6-9l-2-1c-3 0-7-1-10-4-4-5-7-9-7-13l-2-9c-1-3-3-7-4-6-2 2-3 1-4 0-2-2-5-4-5-1 0 2 1 4-1 5l-1 2v1l-3 4c-1 1-4 3-6 2h-7c-1-1-2-3-5-2l-8 4c-2 1-4 3-4 6s2 6-5 11c-6 4-9 2-11 5l-5 7c-2 3-1 5-4 6l-8 8c-3 2-6 2-7 5l-4 7c-1 2-6 1-12 8l-4 4h153v-6ZM261-1c0 1 0 3 3 3l3-3h-6Zm-46 0-2 1c-2 1-3 0-3-1h-95l15 9c13 9 18 11 21 12l6 6c1 2 7 10-1 18-7 9-12 12-21 11l-15-2c-4-1-5-1-7-3-3-2-4-1-7-1s-3-2-4-3c-1-2-5-3-5 0 0 2-1 5 2 7 2 1 12 3 11 10s1 11 2 12c2 2 0 7 2 10 2 2 7 2 12 6 4 4 14 7 15 1 2-6-2-5-6-6s-5-2-7-4-3-4-2-5c2-2 1-4 2-6h5l6 4c3 1 6 0 9 3 2 2 1 5 4 5s10-4 5-11-5-10 0-15c5-6 8-13 12-13l12 2c3 1 8 2 7-5s0-8-4-10c-4-3-4-4-4-11s0-13-4-14c-4-2-7-6-1-4h12c5-1 6 0 7 3s2 2 4 5c2 2 6 4 3 6l-6 2c-1 0-2 0-3 2 0 2-2 2-1 4l5 6c2 3 5 4 7 4 3 0 7 1 9-2l2-11c-1-2 0-4 5-3 4 0 3-2 1-4-1-2 1-2 2-1 1 2 2-1 4-3l6-7c1-1 2-3 5-4h-22Zm-38 501v-1l-1-2v-8l-1-2v-3c0-1 4-4-1-3-5 2-6 0-8-1-2 0-4 0-6 3-1 3-1 4-6 5s-11 2-15-2c-3-3-7-5-11-6-3 0-2 4-6 8s-15 2-17-2c-3-5-11-6-15-7-3-1-3-9-5-11-1-2-4-2-5-3s-1-5 2-6c3-2 2-10-1-11s-6-4-4-8 2-7-3-8l-3-1h-1c-4-1-7-2-8-1-1 2-4-1-5 0l-4 3c0 2 4 3 4 4 1 2-3 1-4 1 0 0 4 2 2 3-3 2-4-1-5-1 0 0 2 3-1 3-2 0 0-3-4-4s-6 1-4 4c1 3 5 6 5 10 1 5 2 3 4 3 3 0 6-1 7 3 0 5 2 5 4 7 1 1 4 4 1 4s-5-2-6-4c-1-1-2 0-1 2 0 2 3 5 0 4s-8-4-8-2c-1 2 0 3 2 4 3 1 0 2-2 3-1 1 0 3 1 4s2 3 0 4c-2 0-5-6-5-2 0 3-1 6-3 4s-6-5-7-9-5-5-6-8c0-2 2-1 1-5 0-3-1-4-4-5-2-1-1-3-3-6-3-3-7-2-9-5l-2-4 1-1c1-1-1-1-2-4-2-3-2-13-2-16l-1-5v-1l-2-2-5-5v25l1 5-1 4v104c5 7 13 9 18 7 5-3 5-10 3-13-1-3 1-6 3-13 3-6 23-4 27-3 3 2 2 3 4 6s16 1 17 3 4 4 7 5h3c4 1 8 0 19 3 11 4 16 3 21-1 5-3 4-2 8-2 4-1 9 0 11 2s3 1 7 1h8c4 0 7-3 8-3v1l3-5 2-4c1-4 0-7 2-9l3-5v-1l1-2 4-13-1-3Zm-95 1c-1 2-4 2-8 2l-6 3c-2 0-4-4-6-4h-7c-1 0-3-4-1-5 4-2 5-1 7 0s1-3 7-1l9 3c3 0 7 0 5 2Zm80-3c-2 1-2 4-2 5 0 2-3 1-5 1-2 1-4 3-7 3l-7-2c-2-2 0-4 3-5 3 0 3-2 7-3l2 1c2 1 3 0 6-1l5-3c1 1-1 2-2 4Z" fill="#1B253A"></path></g><defs><clipPath id="a"><path fill="#fff" d="M0 0h804v715H0z"></path></clipPath></defs></svg>`;
});
const css$2 = {
  code: "div.svelte-1qcni6y{background:rgba(34,34,34,.2);grid-column:var(--_column);grid-row:var(--_row)}",
  map: null
};
const Square = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { columnIndex } = $$props;
  let { rowIndex } = $$props;
  if ($$props.columnIndex === void 0 && $$bindings.columnIndex && columnIndex !== void 0)
    $$bindings.columnIndex(columnIndex);
  if ($$props.rowIndex === void 0 && $$bindings.rowIndex && rowIndex !== void 0)
    $$bindings.rowIndex(rowIndex);
  $$result.css.add(css$2);
  return `<div class="svelte-1qcni6y"${add_styles({
    "--_row": rowIndex + 1,
    "--_column": columnIndex + 1
  })}>${escape(columnIndex + 1)}/${escape(rowIndex + 1)} </div>`;
});
const css$1 = {
  code: ".board.svelte-1gbpcye{grid-gap:.5rem;aspect-ratio:var(--column-count) /var(--row-count);display:grid;gap:.5rem;grid-template-columns:repeat(var(--column-count),1fr);grid-template-rows:repeat(var(--row-count),1fr);margin:0 auto;max-height:100%;max-width:60%}",
  map: null
};
const columnCount = 9;
const rowCount = 8;
const Board = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$1);
  return `<div class="board svelte-1gbpcye"${add_styles({
    "--column-count": columnCount,
    "--row-count": rowCount
  })}>${validate_component(Backdrop, "Backdrop").$$render($$result, {}, {}, {})} ${each([...new Array(rowCount)], (_, rowIndex) => {
    return `${each([...new Array(columnCount)], (_2, columnIndex) => {
      return `${validate_component(Square, "Square").$$render($$result, { columnIndex, rowIndex }, {}, {})}`;
    })}`;
  })} </div>`;
});
const Playing = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${validate_component(Board, "Board").$$render($$result, {}, {}, {})}`;
});
const Finished = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `Finished`;
});
const css = {
  code: '.game-wrapper.svelte-k0wvqu{align-content:center;background:#000;display:grid;height:100%;justify-content:center;place-content:center;width:100%}.game.svelte-k0wvqu{grid-gap:1rem;background:var(--color-bg);display:grid;gap:1rem;grid-template-areas:"name characters items" "actions content content";grid-template-columns:10% 1fr 1fr;grid-template-rows:10% 1fr;height:50.625rem;overflow:hidden;position:relative;width:90rem}@media(max-width:1439.98px) or (max-height:809.98px){.game.svelte-k0wvqu{scale:.8;transform-origin:center}}@media(max-width:1199.98px) or (max-height:674.98px){.game.svelte-k0wvqu{scale:.6}}.name.svelte-k0wvqu{grid-area:name}.characters.svelte-k0wvqu{grid-area:characters}.items.svelte-k0wvqu{grid-area:items}.actions.svelte-k0wvqu{grid-area:actions}.content.svelte-k0wvqu{grid-area:content;padding-right:3rem}',
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
  return `<div class="game-wrapper svelte-k0wvqu"> <div class="game svelte-k0wvqu"${add_attribute("this", gameContainer, 0)}><div class="name svelte-k0wvqu" data-svelte-h="svelte-iqe0dn">The Hidden Threat</div> <div class="characters svelte-k0wvqu"></div> <div class="items svelte-k0wvqu">${slots.items ? slots.items({}) : ``}</div> <div class="actions svelte-k0wvqu">${slots.actions ? slots.actions({}) : ``}</div> <div class="content svelte-k0wvqu">${$section === "Lobby" ? `${validate_component(Lobby, "Lobby").$$render($$result, {}, {}, {})}` : `${$section === "Playing" ? `${validate_component(Playing, "Playing").$$render($$result, {}, {}, {})}` : `${$section === "Finished" ? `${validate_component(Finished, "Finished").$$render($$result, {}, {}, {})}` : `Unkown state`}`}`}</div> ${slots["cursor-overlays"] ? slots["cursor-overlays"]({}) : ``}</div> </div>`;
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
        showEmoji: ({ userId: userId2, emoji }) => emojisComponent?.showEmoji({ userId: userId2, emoji })
      }
    }),
    // TODO: replace input data with actual
    { input: machineInput }
  );
  const user = useSelector(machine2.service, ({ context }) => getUser(context), isEqual);
  setGameContext({
    gameId,
    userId,
    user,
    hostUserId,
    machine: machine2
  });
  const state = machine2.state;
  $$unsubscribe_state = subscribe(state, (value) => $state = value);
  let emojisComponent;
  const reportMousePosition = throttle(
    (position) => {
      socketConnection.send({ type: "mouse position", position });
    },
    50,
    { leading: true, trailing: true }
  );
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    $$rendered = `${validate_component(Game, "Game").$$render($$result, { reportMousePosition }, {}, {
      "cursor-overlays": () => {
        return `${validate_component(CursorOverlays, "CursorOverlays").$$render($$result, { slot: "cursor-overlays", mousePositions }, {}, {})}`;
      },
      actions: () => {
        return `${validate_component(Emojis, "Emojis").$$render(
          $$result,
          { slot: "actions", this: emojisComponent },
          {
            this: ($$value) => {
              emojisComponent = $$value;
              $$settled = false;
            }
          },
          {}
        )}`;
      }
    })} <pre>${escape($socketConnection.log.join("\n"))}

${escape(JSON.stringify($state, null, 2))}
</pre>`;
  } while (!$$settled);
  $$unsubscribe_socketConnection();
  $$unsubscribe_state();
  return $$rendered;
});

export { Page as default };
//# sourceMappingURL=_page.svelte-40d6f5e2.js.map
