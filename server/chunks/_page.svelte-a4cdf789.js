import { c as create_ssr_component, a as subscribe, v as validate_component, e as escape, o as onDestroy, s as setContext, b as each, d as add_attribute, g as getContext, f as add_styles } from './index3-f551e0d4.js';
import { r as readable, w as writable } from './index2-c2cdd0b3.js';
import { c as createMachine, i as interpret, a as assign } from './xstate.esm-8a1e0eb0.js';
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

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */

var isObject_1;
var hasRequiredIsObject;

function requireIsObject () {
	if (hasRequiredIsObject) return isObject_1;
	hasRequiredIsObject = 1;
	function isObject(value) {
	  var type = typeof value;
	  return value != null && (type == 'object' || type == 'function');
	}

	isObject_1 = isObject;
	return isObject_1;
}

/** Detect free variable `global` from Node.js. */

var _freeGlobal;
var hasRequired_freeGlobal;

function require_freeGlobal () {
	if (hasRequired_freeGlobal) return _freeGlobal;
	hasRequired_freeGlobal = 1;
	var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

	_freeGlobal = freeGlobal;
	return _freeGlobal;
}

var _root;
var hasRequired_root;

function require_root () {
	if (hasRequired_root) return _root;
	hasRequired_root = 1;
	var freeGlobal = require_freeGlobal();

	/** Detect free variable `self`. */
	var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

	/** Used as a reference to the global object. */
	var root = freeGlobal || freeSelf || Function('return this')();

	_root = root;
	return _root;
}

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

var _Symbol;
var hasRequired_Symbol;

function require_Symbol () {
	if (hasRequired_Symbol) return _Symbol;
	hasRequired_Symbol = 1;
	var root = require_root();

	/** Built-in value references. */
	var Symbol = root.Symbol;

	_Symbol = Symbol;
	return _Symbol;
}

var _getRawTag;
var hasRequired_getRawTag;

function require_getRawTag () {
	if (hasRequired_getRawTag) return _getRawTag;
	hasRequired_getRawTag = 1;
	var Symbol = require_Symbol();

	/** Used for built-in method references. */
	var objectProto = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/**
	 * Used to resolve the
	 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var nativeObjectToString = objectProto.toString;

	/** Built-in value references. */
	var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

	/**
	 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
	 *
	 * @private
	 * @param {*} value The value to query.
	 * @returns {string} Returns the raw `toStringTag`.
	 */
	function getRawTag(value) {
	  var isOwn = hasOwnProperty.call(value, symToStringTag),
	      tag = value[symToStringTag];

	  try {
	    value[symToStringTag] = undefined;
	    var unmasked = true;
	  } catch (e) {}

	  var result = nativeObjectToString.call(value);
	  if (unmasked) {
	    if (isOwn) {
	      value[symToStringTag] = tag;
	    } else {
	      delete value[symToStringTag];
	    }
	  }
	  return result;
	}

	_getRawTag = getRawTag;
	return _getRawTag;
}

/** Used for built-in method references. */

var _objectToString;
var hasRequired_objectToString;

function require_objectToString () {
	if (hasRequired_objectToString) return _objectToString;
	hasRequired_objectToString = 1;
	var objectProto = Object.prototype;

	/**
	 * Used to resolve the
	 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var nativeObjectToString = objectProto.toString;

	/**
	 * Converts `value` to a string using `Object.prototype.toString`.
	 *
	 * @private
	 * @param {*} value The value to convert.
	 * @returns {string} Returns the converted string.
	 */
	function objectToString(value) {
	  return nativeObjectToString.call(value);
	}

	_objectToString = objectToString;
	return _objectToString;
}

var _baseGetTag;
var hasRequired_baseGetTag;

function require_baseGetTag () {
	if (hasRequired_baseGetTag) return _baseGetTag;
	hasRequired_baseGetTag = 1;
	var Symbol = require_Symbol(),
	    getRawTag = require_getRawTag(),
	    objectToString = require_objectToString();

	/** `Object#toString` result references. */
	var nullTag = '[object Null]',
	    undefinedTag = '[object Undefined]';

	/** Built-in value references. */
	var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

	/**
	 * The base implementation of `getTag` without fallbacks for buggy environments.
	 *
	 * @private
	 * @param {*} value The value to query.
	 * @returns {string} Returns the `toStringTag`.
	 */
	function baseGetTag(value) {
	  if (value == null) {
	    return value === undefined ? undefinedTag : nullTag;
	  }
	  return (symToStringTag && symToStringTag in Object(value))
	    ? getRawTag(value)
	    : objectToString(value);
	}

	_baseGetTag = baseGetTag;
	return _baseGetTag;
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */

var isObjectLike_1;
var hasRequiredIsObjectLike;

function requireIsObjectLike () {
	if (hasRequiredIsObjectLike) return isObjectLike_1;
	hasRequiredIsObjectLike = 1;
	function isObjectLike(value) {
	  return value != null && typeof value == 'object';
	}

	isObjectLike_1 = isObjectLike;
	return isObjectLike_1;
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
  const state = readable(service.getSnapshot(), (set) => {
    return service.subscribe((state2) => {
      if (state2.changed) {
        set(state2);
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
  /** @xstate-layout N4IgpgJg5mDOIC5RQIYFswGEA2BLMAdgC4DEArrGAE6wAEZADhCkWANoAMAuoqAwPaxcRXPwK8QAD0QBGAGwyA7ADoOAVgBMchQBYdagMxqANCACeiALQG5ygxpmaD9gJzaORgL6fTqDDnxickoqWkoCCDowNH4AK1xOHiQQASERMQlpBHkZAA5lOUU5XIMXRxdDF1MLBBtbGRdFDmadVzkDGW9fdCw8QlJYAAt+AHdaaLiE7glU4VFxZKzHFRkddqL7DiaNLerERQdlDTW5NTUOfU0OTp8QP17AomUASQI5lGwSRJnBOYzFxC5GQFdR5LRKLStEzmWQuDh2XIlFwVRRqHQcXIuXJdO49AL9F5vEQfL4yJJ8X7pBagLJaZQueyODpONYXOR7WpA5QNRS5RQNNR8rYGHH3fHEQnvT5sDTklKU+aZRA6DQGAoGRQMzWKA6rdkwhCGDRHQrOS6o4oaUV4voSgAy-AARo6zCQUBA0LgCGEiCgqEQ6PdvslZlSlQgXMc7Mi4R1FB0XDoOTIOMaU0DVnC5Km1lbbmLbU8Hc6zMoAIJ0d2eghu2BCKDeoQQdjTEMK-405WNZTnOTowU6OEqpMGjRj7mnBQ2RQ6XL6ZHW-yF5TFl2S4nS1sUtKKgEIdHwnmJpmaXIaRTJwdHDpAuOowUMxcPAmr0uvKWkuWh3ed2pqYFYqUZ4eBwFTntCNRGGqiJ5EYGiCqBaxPuKRZOmuFa0FWXq1vW3pYQQwbbn81JSPs56qEYfaRnIDJnjIHJjmmk4cH2xyRucOjeLcBD8M28DJAWjw-DuHakQglgHMoZ4aLk7QYgYGJ5PRBqWORWhApiKanBqGLIcu74bsJxHhqpOhSWOskKSUim5CxyaIlJiI6KsvIzjYGp6Y8hL3EZYZ7jIjhmTqBgnLkajZnyHJnvSM4BYYHQBXOnkEq89zrrgHy+T+YkyDsxrBaF4UYheo5KMoOixXkLGphcjTJfaaE1ERfm-jstjhUYia2XCY5FBy2bXlVfJ8rlsl5t0S5ea+5aVh6XpZaJWQKMCegsX2tUeCONQuco8ZKaUCn8poaj1ahJYzbQDDYCgZjUAtJFZE4qgHK5jT8nyW2IEYwLtFVcjnkojQ3BNz4NedBkZdg93hvBZkdWoXWgam576jU575G454yYimoaBUp3KAAYl6uBDJA0N7h0CIHgFEIjXZBr-u1xzrGc-0Mnm3hAA */
  id: "gameClient",
  context: ({ input }) => ({
    gameId: input.gameId,
    userId: input.userId,
    hostUserId: input.hostUserId,
    users: [],
    characters: [],
    actions: []
  }),
  types: {
    // typegen: {} as import('./machine.typegen').Typegen0,
    context: {},
    events: {},
    actors: {}
  },
  initial: "Initial",
  states: {
    Initial: {
      always: [
        {
          target: "Lobby",
          guard: "gameNotStarted"
        },
        {
          target: "Finished",
          guard: "gameFinished"
        },
        {
          target: "Ingame"
        }
      ]
    },
    Ingame: {
      entry: ["consoleLogValueAgain"],
      states: {
        Initial: {}
      },
      initial: "Initial"
    },
    Lobby: {
      states: {
        "As admin": {
          on: {
            "assign side": {
              target: "As admin",
              actions: "forwardToServer"
            },
            "assign admin": {
              target: "As admin",
              actions: "forwardToServer"
            }
          }
        },
        "As player": {},
        Initial: {
          always: [
            {
              target: "As admin",
              guard: "isAdmin"
            },
            "As player"
          ]
        }
      },
      initial: "Initial",
      on: {
        "admin starts game": {
          actions: "consoleLogValue",
          target: "Ingame"
        }
      }
    },
    Finished: {}
  },
  on: {
    "users update": {
      target: "#gameClient",
      actions: "updateUsers"
    },
    "user sends emoji": {
      target: "#gameClient",
      actions: "sendEmoji"
    },
    "show emoji": {
      target: "#gameClient",
      actions: "showEmoji"
    }
  }
});
const getClientGameMachine = ({
  send,
  actions
}) => machine.provide({
  actions: {
    consoleLogValue: ({ event }) => {
      console.log(event);
    },
    consoleLogValueAgain: ({ context }) => {
      console.log("context value 2: ", context);
    },
    updateUsers: assign(({ event: e }) => {
      const event = e;
      return {
        users: event.users
      };
    }),
    sendEmoji: ({ event: e }) => {
      const event = e;
      send({ type: "send emoji", emoji: event.emoji });
    },
    showEmoji: ({ event: e }) => {
      const event = e;
      actions.showEmoji({ userId: event.userId, emoji: event.emoji });
    },
    forwardToServer: ({ event: e }) => {
      const event = e;
      send(event);
    }
  },
  actors: {},
  guards: {
    isHost: ({ context }) => context.hostUserId === context.userId,
    isAdmin: ({ context }) => !!context.users.find((user) => user.id === context.userId && user.isAdmin),
    isPlayer: ({ context }) => context.hostUserId !== context.userId,
    // TODO
    gameNotStarted: () => true,
    // TODO
    gameFinished: () => false
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
const defaultCompare = (a, b) => a === b;
const useSelector = (actor, selector, compare = defaultCompare) => {
  let sub;
  let prevSelected = selector(actor.getSnapshot());
  const selected = readable(prevSelected, (set) => {
    sub = actor.subscribe((state) => {
      const nextSelected = selector(state);
      if (!compare(prevSelected, nextSelected)) {
        prevSelected = nextSelected;
        set(nextSelected);
      }
    });
    return () => {
      sub.unsubscribe();
    };
  });
  return selected;
};
const css$4 = {
  code: ".cursor.svelte-qvny00.svelte-qvny00{height:1px;width:1px}.cursor.svelte-qvny00.svelte-qvny00,.cursor.svelte-qvny00 svg.svelte-qvny00{left:0;position:absolute;top:0}.cursor.svelte-qvny00 svg.svelte-qvny00{height:var(--size-6);translate:-10% -10%;width:var(--size-6)}.cursor.svelte-qvny00 .name.svelte-qvny00{background:#ddd;border-radius:var(--radius-sm);display:inline-block;font-size:var(--scale-000);left:1rem;max-width:var(--size-30);overflow:hidden;padding:var(--size-1) var(--size-2);position:absolute;text-overflow:ellipsis;top:1rem;white-space:nowrap}",
  map: null
};
const Cursor = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { position } = $$props;
  let el;
  if ($$props.position === void 0 && $$bindings.position && position !== void 0)
    $$bindings.position(position);
  $$result.css.add(css$4);
  return `<div class="cursor svelte-qvny00"${add_attribute("this", el, 0)}><svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2c3e50" fill="white" stroke-linecap="round" stroke-linejoin="round" class="svelte-qvny00"><path d="M7.904 17.563a1.2 1.2 0 0 0 2.228 .308l2.09 -3.093l4.907 4.907a1.067 1.067 0 0 0 1.509 0l1.047 -1.047a1.067 1.067 0 0 0 0 -1.509l-4.907 -4.907l3.113 -2.09a1.2 1.2 0 0 0 -.309 -2.228l-13.582 -3.904l3.904 13.563z"></path></svg>

  <span class="name svelte-qvny00">${escape(position.name)}</span>
</div>`;
});
const css$3 = {
  code: ".cursor-overlays.svelte-1n4ax7h{bottom:0;left:0;pointer-events:none;position:absolute;right:0;top:0;z-index:var(--layer-top)}",
  map: null
};
const CursorOverlays = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let userMousePositions;
  let $users, $$unsubscribe_users;
  let { mousePositions = {} } = $$props;
  const context = getGameContext();
  let gameWidth = 1;
  let gameHeight = 1;
  const users = useSelector(context.machine.service, (state) => state.context.users);
  $$unsubscribe_users = subscribe(users, (value) => $users = value);
  const getMousePositions = (users2, mousePositions2) => {
    return users2.filter((user) => user.isConnected && !!mousePositions2[user.id]).map((user) => {
      const percentages = mousePositions2[user.id];
      return {
        id: user.id,
        name: user.name,
        position: [percentages[0] * gameWidth, percentages[1] * gameHeight]
      };
    });
  };
  if ($$props.mousePositions === void 0 && $$bindings.mousePositions && mousePositions !== void 0)
    $$bindings.mousePositions(mousePositions);
  $$result.css.add(css$3);
  userMousePositions = getMousePositions($users, mousePositions);
  $$unsubscribe_users();
  return `<div class="cursor-overlays svelte-1n4ax7h">${each(userMousePositions, (position) => {
    return `${validate_component(Cursor, "Cursor").$$render($$result, { position }, {}, {})}`;
  })}
</div>`;
});
const css$2 = {
  code: ".emojis.svelte-ar5859.svelte-ar5859{grid-gap:var(--size-1);display:grid;gap:var(--size-1);grid-template-columns:repeat(auto-fit,minmax(2rem,1fr));padding:var(--size-2) var(--size-3)}.emoji.svelte-ar5859.svelte-ar5859{align-content:center;aspect-ratio:1;background:#fafafa;border:none;border-radius:var(--radius-sm);display:grid;font-size:var(--scale-2);justify-content:center;padding:0;place-content:center}.emoji.svelte-ar5859.svelte-ar5859:hover{background:#f0f0f0}.displayed-emoji.svelte-ar5859.svelte-ar5859{--_width:15vw;--_height:15vw;align-items:center;background:#fafafa;border:var(--size-px) solid #ccc;border-radius:var(--radius-full);box-shadow:0 0 30px #dd7;display:flex;flex-direction:column;font-size:8vw;height:15vw;height:var(--_height);justify-content:center;left:calc(var(--_x)*(100% - 15vw));left:calc(var(--_x)*(100% - var(--_width)));line-height:1.1;position:fixed;top:calc(var(--_y)*(100% - 15vw));top:calc(var(--_y)*(100% - var(--_height)));width:15vw;width:var(--_width)}.displayed-emoji.svelte-ar5859 .name.svelte-ar5859{background:#fff;bottom:-1em;font-size:.3em;position:absolute}",
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
  $$result.css.add(css$2);
  $$unsubscribe_users();
  return `<div class="emojis svelte-ar5859">${each(Object.entries(emojis), ([i2, emoji]) => {
    return `<div class="displayed-emoji svelte-ar5859"${add_styles({
      "--_x": emoji.position[0],
      "--_y": emoji.position[1]
    })}><span class="emjoi">${escape(emoji.emoji)}</span>
      <span class="name svelte-ar5859">${escape(emoji.userName)}</span>
    </div>`;
  })}
  ${each(validEmojis, (emoji) => {
    return `<button class="emoji svelte-ar5859">${escape(emoji)}</button>`;
  })}
</div>`;
});
const css$1 = {
  code: ".side.svelte-190hwhb{background:#000;border-radius:.5em;color:#fff;display:inline-block;font-size:.875rem;padding:.25rem .5rem}",
  map: null
};
const Lobby = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $users, $$unsubscribe_users;
  let $canAssignSides, $$unsubscribe_canAssignSides;
  let $canAssignAdmin, $$unsubscribe_canAssignAdmin;
  const { userId, machine: machine2 } = getGameContext();
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
  const users = useSelector(machine2.service, (snapshot) => snapshot.context.users.filter((user) => user.id !== snapshot.context.hostUserId));
  $$unsubscribe_users = subscribe(users, (value) => $users = value);
  $$result.css.add(css$1);
  $$unsubscribe_users();
  $$unsubscribe_canAssignSides();
  $$unsubscribe_canAssignAdmin();
  return `<h1>Lobby</h1>

<div class="users">${each($users, (user) => {
    return `<div class="user">${escape(user.name)}
      ${user.isAdmin ? `<span class="admin">admin</span>` : ``}
      <span class="side svelte-190hwhb">${user.side === "attacker" ? `Angriff` : `${user.side === "defender" ? `Verteidigung` : `---`}`}</span>
      ${$canAssignSides ? `<button>Angriff</button>
        <button>Verteidigung</button>` : ``}
      ${$canAssignAdmin && user.id !== userId ? `<button>Toggle Admin</button>` : ``}
    </div>`;
  })}
</div>`;
});
const css = {
  code: '.game-wrapper.svelte-yumm1n{align-content:center;background:#666;display:grid;height:100%;justify-content:center;place-content:center;width:100%}.game.svelte-yumm1n{background:#fff;display:grid;grid-template-areas:"name characters items" "actions content content";grid-template-columns:10% 1fr 1fr;grid-template-rows:10% 1fr;height:50.625rem;overflow:hidden;position:relative;width:90rem}@media(max-width:1439.98px) or (max-height:809.98px){.game.svelte-yumm1n{scale:.8;transform-origin:center}}@media(max-width:1199.98px) or (max-height:674.98px){.game.svelte-yumm1n{scale:.6}}.name.svelte-yumm1n{grid-area:"name"}.characters.svelte-yumm1n{grid-area:"characters"}.items.svelte-yumm1n{grid-area:"items"}.actions.svelte-yumm1n{grid-area:"actions"}.content.svelte-yumm1n{grid-area:"content"}',
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
    }
    return section2;
  });
  $$unsubscribe_section = subscribe(section, (value) => $section = value);
  if ($$props.reportMousePosition === void 0 && $$bindings.reportMousePosition && reportMousePosition !== void 0)
    $$bindings.reportMousePosition(reportMousePosition);
  $$result.css.add(css);
  $$unsubscribe_section();
  return `<div class="game-wrapper svelte-yumm1n"><div class="game svelte-yumm1n"${add_attribute("this", gameContainer, 0)}><div class="name svelte-yumm1n">The Hidden Threat</div>
    <div class="characters svelte-yumm1n"></div>
    <div class="items svelte-yumm1n">${slots.items ? slots.items({}) : ``}</div>
    <div class="actions svelte-yumm1n">${slots.actions ? slots.actions({}) : ``}</div>
    <div class="content svelte-yumm1n">${$section === "Lobby" ? `${validate_component(Lobby, "Lobby").$$render($$result, {}, {}, {})}` : `...`}</div>
    ${slots["cursor-overlays"] ? slots["cursor-overlays"]({}) : ``}</div>
</div>`;
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
  const gameId = data.gameId;
  const userId = data.userId;
  const hostUserId = data.hostUserId;
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
    { input: { gameId, userId, hostUserId } }
  );
  setGameContext({ gameId, userId, hostUserId, machine: machine2 });
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
    })}

<pre>${escape($socketConnection.log.join("\n"))}

${escape(JSON.stringify($state, null, 2))}
</pre>`;
  } while (!$$settled);
  $$unsubscribe_socketConnection();
  $$unsubscribe_state();
  return $$rendered;
});

export { Page as default };
//# sourceMappingURL=_page.svelte-a4cdf789.js.map
