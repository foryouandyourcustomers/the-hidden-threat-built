import { c as create_ssr_component, a as subscribe, v as validate_component, e as escape, o as onDestroy, s as setContext, g as each, f as add_attribute, h as getContext, i as add_styles } from './ssr-b0d2ddaa.js';
import { r as readable, w as writable } from './index2-31d135d0.js';
import { g as require_root, H as require_baseGetTag, p as requireIsObjectLike, c as requireIsObject, x as createMachine, F as interpret, y as assign, J as not, K as and, z as sharedGuards, G as isEqual, L as getUser, M as guardForGameEventType, C as isDefenderId, N as FACES } from './isEqual-e773ef2f.js';
import { A as Actions, P as Paragraph } from './Paragraph-f2708e5e.js';
import { B as Button } from './Button-26ba6e00.js';
import { H as Heading } from './Heading-bb3c9ecf.js';
import { F as Face } from './Face-f8c1c6c9.js';
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
                    "apply game event": {
                      target: "Ready to move",
                      guard: "userControlsPlayerAndIsMoveEvent",
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
                    "apply game event": {
                      target: "Ready for action",
                      guard: "userControlsPlayerAndIsActionEvent",
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
const getCurrentUser = (context) => getUser(context.userId, context);
const getCurrentGameState = (context) => {
  const events = context.events;
  const playersInOrder = [
    context.attack.attacker,
    context.defense.defenders[0],
    context.defense.defenders[1],
    context.attack.attacker,
    context.defense.defenders[2],
    context.defense.defenders[3]
  ];
  const eventsPerRound = playersInOrder.length * 2;
  const finalizedEvents = events.filter((event) => event.finalized);
  const currentRound = Math.floor(finalizedEvents.length / eventsPerRound);
  const activePlayerId = playersInOrder[Math.floor(finalizedEvents.length / 2) % playersInOrder.length].id;
  const activeSide = Math.floor(finalizedEvents.length / 2) % 3 === 0 ? "attack" : "defense";
  const lastEvent = events[events.length - 1];
  const playerMoved = lastEvent && lastEvent.type === "move" && lastEvent.finalized;
  const playerPositions = getPlayerPositions(context);
  return {
    currentRound,
    activeSide,
    activePlayerId,
    playerMoved,
    playerPositions
  };
};
const getPlayerPositions = (context) => {
  const playerPositions = {
    attacker: context.attack.attacker.originalPosition,
    defender0: context.defense.defenders[0].originalPosition,
    defender1: context.defense.defenders[1].originalPosition,
    defender2: context.defense.defenders[2].originalPosition,
    defender3: context.defense.defenders[3].originalPosition
  };
  context.events.filter(guardForGameEventType("move")).forEach((event) => playerPositions[event.playerId] = event.to);
  return playerPositions;
};
const getPlayer = (playerId, context) => {
  if (isDefenderId(playerId)) {
    const player = context.defense.defenders.find((player2) => player2.id === playerId);
    if (!player)
      throw new Error(`Player ${playerId} not found in context`);
    return player;
  } else {
    return context.attack.attacker;
  }
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
      const editingPlayer = (side === "attack" ? context.attack : context.defense).editingPlayer;
      return editingPlayer !== void 0;
    },
    isNotEditingPlayerOfSide: not("isEditingPlayerOfSide"),
    userControlsPlayer: ({ context }) => {
      const user = getCurrentUser(context);
      return user.isAdmin || user.id === getPlayer(getCurrentGameState(context).activePlayerId, context).userId;
    },
    isMoveEvent: ({ event: e }) => {
      const event = e;
      return event.gameEvent.type === "move";
    },
    isActionEvent: ({ event: e }) => {
      const event = e;
      return event.gameEvent.type !== "move";
    },
    userControlsPlayerAndIsMoveEvent: and(["userControlsPlayer", "isMoveEvent"]),
    userControlsPlayerAndIsActionEvent: and(["userControlsPlayer", "isActionEvent"]),
    userOnActiveSide: ({ context }) => getCurrentUser(context).side === getCurrentGameState(context).activeSide,
    userNotOnActiveSide: not("userOnActiveSide"),
    playerMoved: ({ context }) => getCurrentGameState(context).playerMoved,
    playerPerformedAction: ({ context }) => !getCurrentGameState(context).playerMoved,
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
  code: ".cursor.svelte-7ubvy1.svelte-7ubvy1{height:1px;left:0;position:absolute;top:0;width:1px}.cursor.svelte-7ubvy1 svg.svelte-7ubvy1{display:block;height:1.5rem!important;left:0;max-width:none;position:absolute;top:0;translate:-15% -20%;width:1.5rem!important}.cursor.svelte-7ubvy1 .name.svelte-7ubvy1{background:rgba(0,0,0,.667);border-radius:var(--radius-sm);display:inline-block;font-size:var(--scale-000);left:1.5rem;max-width:7rem;overflow:hidden;padding:.25rem .5rem;position:absolute;text-overflow:ellipsis;top:.5rem;white-space:nowrap}",
  map: null
};
const Cursor = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { position } = $$props;
  let el;
  if ($$props.position === void 0 && $$bindings.position && position !== void 0)
    $$bindings.position(position);
  $$result.css.add(css$c);
  return `<div class="cursor svelte-7ubvy1"${add_attribute("this", el, 0)}><svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2c3e50" fill="white" stroke-linecap="round" stroke-linejoin="round" class="svelte-7ubvy1"><path d="M7.904 17.563a1.2 1.2 0 0 0 2.228 .308l2.09 -3.093l4.907 4.907a1.067 1.067 0 0 0 1.509 0l1.047 -1.047a1.067 1.067 0 0 0 0 -1.509l-4.907 -4.907l3.113 -2.09a1.2 1.2 0 0 0 -.309 -2.228l-13.582 -3.904l3.904 13.563z"></path></svg> <span class="name svelte-7ubvy1">${escape(position.name)}</span> </div>`;
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
const TempActionButton = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $currentRound, $$unsubscribe_currentRound;
  let $canPerformAction, $$unsubscribe_canPerformAction;
  const { machine: machine2 } = getGameContext();
  const currentRound = useSelector(machine2.service, ({ context }) => getCurrentGameState(context).currentRound);
  $$unsubscribe_currentRound = subscribe(currentRound, (value) => $currentRound = value);
  const getActionEvent = (context) => {
    return {
      type: "apply game event",
      gameEvent: {
        type: "collect",
        finalized: true,
        playerId: getCurrentGameState(context).activePlayerId,
        item: "alarm"
      }
    };
  };
  const canPerformAction = useSelector(machine2.service, (state) => state.can(getActionEvent(machine2.service.getSnapshot().context)));
  $$unsubscribe_canPerformAction = subscribe(canPerformAction, (value) => $canPerformAction = value);
  $$unsubscribe_currentRound();
  $$unsubscribe_canPerformAction();
  return `Round: ${escape($currentRound + 1)} ${$canPerformAction ? `<button data-svelte-h="svelte-ef6jao">Perform Action</button>` : ``}`;
});
const Finished = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `Finished`;
});
const css$9 = {
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
  $$result.css.add(css$9);
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
const Close = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M16 30C23.732 30 30 23.732 30 16C30 8.26801 23.732 2 16 2C8.26801 2 2 8.26801 2 16C2 23.732 8.26801 30 16 30ZM16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32Z" fill="white"></path><path d="M20.8002 11.1997L11.2002 20.7997M11.2002 11.1997L20.8002 20.7997" stroke="white" stroke-width="2.66667" stroke-linecap="round" stroke-linejoin="round"></path></svg>`;
});
const css$8 = {
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
  $$result.css.add(css$8);
  return `<dialog class="svelte-m0m887"${add_attribute("this", element, 0)}>${validate_component(Heading, "Heading").$$render($$result, { separator: true }, {}, {
    info: () => {
      return `<button class="unstyled close-button svelte-m0m887" slot="info">${validate_component(Close, "CloseIcon").$$render($$result, {}, {}, {})}</button>`;
    },
    default: () => {
      return `${title ? `${escape(title)}` : ``}`;
    }
  })} ${slots.default ? slots.default({}) : ``} </dialog>`;
});
const css$7 = {
  code: ".configurator.svelte-1c1yr8w.svelte-1c1yr8w{grid-gap:1rem;align-content:center;display:grid;gap:1rem;justify-content:center;place-content:center}.faces.svelte-1c1yr8w.svelte-1c1yr8w{display:flex;gap:1rem}.faces.svelte-1c1yr8w .face.svelte-1c1yr8w{border:1px solid transparent;border-radius:var(--radius-md)}.faces.svelte-1c1yr8w .face.active.svelte-1c1yr8w{border-color:orange}",
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
  const side = isDefenderId(playerId) ? "defense" : "attack";
  const { machine: machine2 } = getGameContext();
  const player = useSelector(machine2.service, ({ context }) => getPlayer(playerId, context));
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
  $$result.css.add(css$7);
  userId = $player.userId;
  faceId = $player.faceId;
  role = $player.role;
  $$unsubscribe_player();
  $$unsubscribe_canUpdate();
  $$unsubscribe_usersOnThisSide();
  return `${validate_component(Dialog, "Dialog").$$render($$result, { title: "Rolle bestimmen", open: true }, {}, {
    default: () => {
      return `<div class="configurator svelte-1c1yr8w"><select ${!$canUpdate ? "disabled" : ""}${add_attribute("value", userId, 0)}><option value="" data-svelte-h="svelte-108q7wa">--PLEASE SELECT--</option>${each($usersOnThisSide, (user) => {
        return `<option${add_attribute("value", user.id, 0)}>${escape(user.name)}</option>`;
      })}</select> <div class="faces svelte-1c1yr8w">${each(FACES, (face) => {
        return `<button ${!$canUpdate ? "disabled" : ""} class="${["unstyled face svelte-1c1yr8w", face.id === faceId ? "active" : ""].join(" ").trim()}">${validate_component(Face, "Face").$$render($$result, { faceId: face.id }, {}, {})} </button>`;
      })}</div> ${validate_component(Actions, "Actions").$$render($$result, {}, {}, {
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
const css$6 = {
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
  const editingPlayerId = useSelector(machine2.service, ({ context }) => ($user.side === "attack" ? context.attack : context.defense).editingPlayer);
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
  $$result.css.add(css$6);
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
      return `${escape($user.side === "attack" ? "Angriff" : "Verteidigung")}`;
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
const css$5 = {
  code: ".player.svelte-a1x2q7{align-items:center;display:flex;flex-direction:column;gap:.5rem;position:relative}.player.playing.svelte-a1x2q7{border:2px solid green}.online-status.svelte-a1x2q7{background:orange;border-radius:var(--radius-full);height:.5rem;position:absolute;right:0;top:0;width:.5rem}.online-status.connected.svelte-a1x2q7{background:green}",
  map: null
};
const Player = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { name } = $$props;
  let { faceId = void 0 } = $$props;
  let { isConnected = false } = $$props;
  let { isPlaying = false } = $$props;
  if ($$props.name === void 0 && $$bindings.name && name !== void 0)
    $$bindings.name(name);
  if ($$props.faceId === void 0 && $$bindings.faceId && faceId !== void 0)
    $$bindings.faceId(faceId);
  if ($$props.isConnected === void 0 && $$bindings.isConnected && isConnected !== void 0)
    $$bindings.isConnected(isConnected);
  if ($$props.isPlaying === void 0 && $$bindings.isPlaying && isPlaying !== void 0)
    $$bindings.isPlaying(isPlaying);
  $$result.css.add(css$5);
  return `<div class="${["player svelte-a1x2q7", isPlaying ? "playing" : ""].join(" ").trim()}">${validate_component(Face, "Face").$$render($$result, { faceId: faceId ?? 0 }, {}, {})} ${escape(name)} <div class="${["online-status svelte-a1x2q7", isConnected ? "connected" : ""].join(" ").trim()}"></div> </div>`;
});
const css$4 = {
  code: "h3.svelte-10q9rv4{margin-bottom:1rem;margin-top:2rem}.players.svelte-10q9rv4{display:flex;flex-wrap:wrap;gap:1rem}",
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
  const activePlayerId = useSelector(machine2.service, ({ context }) => getCurrentGameState(context).activePlayerId);
  $$unsubscribe_activePlayerId = subscribe(activePlayerId, (value) => $activePlayerId = value);
  $$result.css.add(css$4);
  $$unsubscribe_defensePlayers();
  $$unsubscribe_users();
  $$unsubscribe_activePlayerId();
  $$unsubscribe_defenseAdmins();
  $$unsubscribe_attackPlayers();
  $$unsubscribe_attackAdmins();
  return `<h3 class="svelte-10q9rv4" data-svelte-h="svelte-1krh9a0">Verteidiger:innen</h3> <div class="players svelte-10q9rv4">${each($defensePlayers, (player) => {
    let user = getUserForPlayer(player, $users);
    return ` ${validate_component(Player, "Player").$$render(
      $$result,
      {
        faceId: player.faceId,
        name: user.name,
        isConnected: user.isConnected,
        isPlaying: $activePlayerId === player.id
      },
      {},
      {}
    )}`;
  })} ${each($defenseAdmins, (admin) => {
    return `${validate_component(Player, "Player").$$render(
      $$result,
      {
        name: admin.name + " (admin)",
        isConnected: admin.isConnected
      },
      {},
      {}
    )}`;
  })}</div> <h3 class="svelte-10q9rv4" data-svelte-h="svelte-1fki2a7">Angreifer:innen</h3> <div class="players svelte-10q9rv4">${each($attackPlayers, (player) => {
    let user = getUserForPlayer(player, $users);
    return ` ${validate_component(Player, "Player").$$render(
      $$result,
      {
        faceId: player.faceId,
        name: user.name,
        isConnected: user.isConnected,
        isPlaying: $activePlayerId === player.id
      },
      {},
      {}
    )}`;
  })} ${each($attackAdmins, (admin) => {
    return `${validate_component(Player, "Player").$$render(
      $$result,
      {
        name: admin.name + " (admin)",
        isConnected: admin.isConnected
      },
      {},
      {}
    )}`;
  })} </div>`;
});
const css$3 = {
  code: "svg.svelte-1fqtuea{grid-column:1/-1;grid-row:1/-1}",
  map: null
};
const Backdrop = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$3);
  return `<svg width="804" height="715" fill="none" xmlns="http://www.w3.org/2000/svg" class="svelte-1fqtuea"><g clip-path="url(#a)"><path d="M804 0H0v715h804V0Z" fill="#1B253A"></path><mask id="b" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="0" y="0" width="804" height="715"><path d="M804 0H0v715h804V0Z" fill="#fff"></path></mask><g mask="url(#b)"><path d="M291 651 78 822l264 19-51-190Z" fill="#747D4A"></path><path d="m52 154 99 41 13-295L52 154Z" fill="#257A86"></path><path d="m-163 10 113 211L6 28l-169-18Z" fill="#247771"></path><path d="m6 28-56 193 102-67L6 28Z" fill="#297877"></path><path d="m52 154-102 67 201-26-99-41Z" fill="#227776"></path><path d="m-50 221 66 228 135-254-201 26Z" fill="#2C7871"></path><path d="m-50 221-28 271 94-43-66-228Z" fill="#317865"></path><path d="m-78 492 48 148 46-191-94 43Z" fill="#37785E"></path><path d="m6 28 46 126 112-254L6 28Z" fill="#2F7B85"></path><path d="m-30 640-112 90 220 92-108-182Z" fill="#4A7A50"></path><path d="M-163 10 6 28l158-128-327 110Z" fill="#2D7A7E"></path><path d="m-221-59 58 69 327-110-385 41Z" fill="#246E4C"></path><path d="m708 634 141 73 105-178-246 105Z" fill="#934038"></path><path d="m16 449-46 191 265-149-219-42Z" fill="#37785E"></path><path d="M235 491-30 640l321 11-56-160Z" fill="#436D56"></path><path d="M151 195 16 449l219 42-84-296Z" fill="#2D726B"></path><path d="M-30 640 78 822l213-171-321-11Z" fill="#4C764F"></path><path d="m164-100-13 295L300 62 164-100Z" fill="#2B7B8D"></path><path d="m355 309 124 182 16-252-140 70Z" fill="#585E60"></path><path d="m300 62 55 247 140-70L300 62Z" fill="#3C597F"></path><path d="M300 62 151 195l204 114-55-247Z" fill="#336882"></path><path d="m151 195 84 296 120-182-204-114Z" fill="#3C6671"></path><path d="m235 491 56 160 188-160H235Z" fill="#67715B"></path><path d="M355 309 235 491h244L355 309Z" fill="#56655E"></path><path d="m300 62 195 177 26-157-221-20Z" fill="#3A5584"></path><path d="M164-100 300 62l221 20-357-182Z" fill="#34638D"></path><path d="m495 239 178 250 20-306-198 56Z" fill="#856865"></path><path d="m291 651 51 190 210-58-261-132Z" fill="#8B674A"></path><path d="M479 491 291 651l261 132-73-292Z" fill="#8F6E4D"></path><path d="m708 634-44 143 54 34-10-177Z" fill="#853F33"></path><path d="M849 707 718 811l150 94-19-198Z" fill="#8E3D35"></path><path d="m683-20 10 203 53-107-63-96Z" fill="#725981"></path><path d="m495 239-16 252 194-2-178-250Z" fill="#886D5F"></path><path d="M683-20 521 82l172 101-10-203Z" fill="#554C76"></path><path d="M829 378 673 489l281 40-125-151Z" fill="#945050"></path><path d="M164-100 521 82 683-20l-519-80Z" fill="#3F5684"></path><path d="m521 82-26 157 198-56L521 82Z" fill="#524F7F"></path><path d="m552 783 112-6 44-143-156 149Z" fill="#914134"></path><path d="m479 491 73 292 156-149-229-143Z" fill="#9A5C4E"></path><path d="m673 489-194 2 229 143-35-145Z" fill="#9A6556"></path><path d="m693 183 136 195 41-242-177 47Z" fill="#8A5F6E"></path><path d="m693 183-20 306 156-111-136-195Z" fill="#936360"></path><path d="m708 634 10 177 131-104-141-73Z" fill="#994B3A"></path><path d="m746 76 124 60 243-236L746 76Z" fill="#765076"></path><path d="m683-20 63 96 367-176-430 80Z" fill="#644B7B"></path><path d="m746 76-53 107 177-47-124-60Z" fill="#7A5A6F"></path><path d="m673 489 35 145 246-105-281-40Z" fill="#924E4C"></path></g><mask id="c" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="0" y="0" width="804" height="715"><path d="M804 0H0v715h804V0Z" fill="#fff"></path></mask><g opacity=".1" stroke="#272D2E" stroke-width="1.2" stroke-miterlimit="10" mask="url(#c)"><path d="m1145 285-1-1-3 1-2 1-2 2-5 6h-4a122 122 0 0 1-8 0h-9l-3-6-3-4 3-3-1-2v-1l-1-1c-3-1-9-6-9-7h-4l-5-2h-6c-1 0-4 0-5-3l-1-3v-2l-3-3-1-3v-1c1-2 2-4 0-5h-1c-3-1-4-2-4-4v-4l-2-3-1-2v-4l-1-1h-1v-3l1-1-1-1h-2l-1-1v-4l-2-1-3-2c0-2-1-3-2-3h-7a59 59 0 0 0-15-7 253 253 0 0 0-26 8l-5 5v5h1l3 1 1 2v7h1l-1 2-4 4-8 22h-1l1 2 1 1 1 2-3 2-5 3-3 2-4 1-1-1-8-1-2 4-1 1-1 4-4 9-2 3-2 3 1 4 5 3h14l2-1 3-2c2-2 3 0 5 1a22 22 0 0 0 6 4c3 1 5 2 6 4l2 3 2 3-1 2c-3 2-5 3-8 2l-2-1c-1-1-1-2-2-1l-7 2h-4l-2 5h-5c0 1-4 9-6 10l-7 5v1h-8v1c0 2 0 4-2 6l-5 1-8 1-5-1c-1-1-5 0-7 1l-3 5 5 10s-8 5-9 8l-5 6-3 2-7 4-17 2a312 312 0 0 0-28 14l-2-2v-2h-17l-10-5-8-2h-8l-3 1h-6a608 608 0 0 0-12 0h-6l-6-1-2 1h-2l-1 1v1h-1l-2-2-7-10v-3l-2-3-1-2 1-2h-8c-2 0-3-1-5-3-3-2-6-4-11-5h-20c-3 0-4-1-5-4l-1-2v-2l2-5-1-3 1-5-1-2-1-1c-2-4-4-10-6-11l-4-3-1 1-1-1-1-2-2-1h-5l-3-2-4-3-1-1-2-3-5 3h-1l-2 2c0 1-1 2-3 1l-6-1-6-1-5-1-6 23c1 1 3 3 2 4v1l-1 1h-6v-2l-3 1-4 2-6 3h-5c-1-1-1-1-2 1l-1 2v1l1 1 3 2 2 2v6l3 6 1 2 1 2c0 1 1 2-1 3l-2 1v2l1 1-1 1h-1l-1 2v5h-1l2 3v2h-4l-1 1-5 3-7 5-3 2-5 4c-1 2-2 2-3 1l-2-1c-2 0-5 1-7 4l-2 3-4 4-5 1-1-5-1 2-5 1h-1l-1 1-1 1-2 2-4 2-2 1-1 1 1 2v4l-1 1h-3l2 4 1 4 1 2 4 2h2c3 1 4 1 5 3v2l1 2 1 1 1 1v6l-2 2v1l-2-1h-2l-1 1v1l1 1v2h-10l-3 2c-1 1-2 1-2 3l-2 4h-1l-2 1h-1l2 2c2 3 4 4 7 4l2 1h3l2 2-1 4-1 2-1 1-1 2-1 1 1 2 1 3 1 1v10c-1 2-1 3 1 4h2l3 1 5 3v2h6c1 2 3 2 3 2l1 2 2 1 2-1 3-1 4-3 4-3 1-2-1-2c1-2 2-3 5-3l1-1 2-1 6 1 2 1 1 1h2l2-1h2l1 1v1l1 3 2-1 1-1 1 1-1 3 1 2 2 4 1 1 1 1 1 3v5c0 1 0 2 2 2h5l2 1c2 0 3 0 3 2v1c1 2 1 3 3 3l1-1h2l1 2 3 3h1l1 1 1-1v-2l2-1h7l1 2v1l-1 1 1 1h1l3 1 3 2 4 2 1 2 2 3h2l2-1h4v2l1 3 2 1 2 2h1l3-1 1 3v1h3l2-1 3 4 1 1h2v1l1 1h1l1-2 1-1h1l7 3h9v2l-1 4 3-2 2 2 2 1 3-1 2-2 2-2h13l3-1h5l1 1 3 2 1 2 1 1v6h1l1 1-1 1h13l2-1v-1l2-2 1-1 3-1h2l4-4 3-2 3-2c1-2 2-2 3-1l2 1 5 1 1 1 3 1 3 2 1-1v-4l-2-1-3-3-1-2v-1l-1-2-3-3-2-1-3 1-3 1-5 1-3-1-2-1-1 1-1 2-1 1-1 1-2 1-2 2-4 1-2 1-2 1-1 1-2 2-1 3h-4v-1l2 1 1-1 2-2 2-2 1-1 2-2h2l4-1 2-2 2-2 1-2 1-1 2-1 2 1h8l3-1 2-1 1-1 2 2 3 3 1 2h1l1 3 2 3 2 1 3-3 1-1v1l3 2 2 5v3l-1 1h1l1-1 1-1 2 1 1 6a101 101 0 0 0 0 8l-1 2v5l-1 1-2 1h-1l-1 1-1 1-1 1c-2 1-2 1-2 3l-1 2-1 1-1 1v2h2l1 1v2l-2 2v1h4l2-2 3-1h5v1l-1 3c-1 1 0 2 1 3v4h-1l2 1 2-1 2 1h1l-3 9 1-1c2 0 3 1 4 3l3 3c2 4 3 5 4 4l4-1 3-2 2 1v1l1 2 2 1 2-1-1-6v-6h4v1l3-4 3 1 2 2 3 1 1-1v-1l1-3 2 2 1-3 1 1v1l2 2 1-2v-1l1-1v1l-1 1h2l3-3 4-2 2-1h2l2 2 3 3 2-1 4-1 2 1h1l1 1-1 1-1 2-1 2v2c2 2 3 3 5 3h1l1 1c2 0 2-1 3-4 1-2 3-1 4-2 2-1 2 0 4 1 2 2 4 1 7 0 2 0 3 3 2 4-1 2 0 5 1 8s5 3 7 2 1-3-1-4l-2-4c0-1 3-4 4-3l10-2c4-1 2-3 3-3h5c2-1 2-4 5-4s3-1 3-6c1-6 2-4 5-1 2 3 3 4 4 2l2-2 4-1 6-1 6-2c5-1 6-2 7-6l1-3h5l2-3 4-2 1-2-4-1c-1-1 1-2 2-3h6c3 0 0-2 0-3 0-2 1-3 2-3v-4l2-1h3l1-5-2-2v-2l3-1-1-2-3-2 1-4c2-1 2 2 4 2l5-7 3-12c2-3 4-1 5-2 2-2-1-3-1-5s2-2 2-3l-5-2c-1-1 2-1 5-1 2 0 2-1 2-3 0-1-1-3-2-2s-4 3-6 2c-3 0 0-1 2-2 2 0 3-2 3-4 1-2-2-2-3-3l-6-2c-4 0-2 3-4 2-3 0-3-3-1-4l4-1 3-3 4-2c1-1-1-5-3-6-1-2-4-2-7-4-3-1-5-3-4-4l3 2 4-1 6 1c3 0 0 0 0-3l-5-5-6-3c-2-1-1-5-2-6l-5-5c-1-2-1-10-9-12-7-2-8-7-9-9-1-1 0-5 1-8 1-2 3-2 5-3 2 0 1-2 0-4s1-3 4-3 3-3 7-5 8-2 11-1c2 0 2-6 2-9 1-4-3-3-8-3s-8 0-11-2c-4-2-6-3-10 5-4 7-10 4-11 2-2-3-2-7-5-7s-4-1-9-4c-5-4-4-14-1-13 4 0 11-1 11-3l1-9c1-2 9-5 9-8 1-3 1-11 10-10s4 12 3 14v7c2 1 3 2 3 5 1 4-4 2-5 3-2 2 0 4 3 4 2 0 4-1 7-7s10-9 14-10c3 0 4-1 8 1v-1l3-3 1-3v-3l1-1 2-4 3-2 1-1 3-3a98 98 0 0 0 1-6l1-5 3-2 2 4 8-1 1-4-3-4 6-2 2-4 6-2-3-9 5 1 2 2 4 3s1-1 2 1h1c2-1 3-2 3-4 0-1 0-4 2-6l2-2v-2l1-5c-1-3 1-4 2-4l2-1 3-5v-1l3-1h1l2-6 3-2v-2l2-5 1-1 2-1v-8h1l3-2 4-4 2-3 2-3-2-2Z"></path><path d="M559 469h-2l-7 1c-2 0-3 0-3 2l-3 4-2 2-1-1v-1l-3 5 3 4 2 2-1 3-1 1 2 1v1l-6 8-1 2c1 0 2 3 0 5l-5 1-3-1-3 1 1 1 3 5 1 4-5 1-3 4-1 2h1v1c1 0 1 0 0 0l-4 2 1 1 1 1-1 5-1 1-1 1c-1 1-1 2-3 2l-1-2-1-1-4 1-4 2-3 1v1l3 3-1 1h-5l-4 1-3 1-4 4c-1 1 0 2 1 3l1 1v6h-10l-3-1-2-1-3 2-2 2h-3a8 8 0 0 1-3 0l-5-1h-10l2 5c0 2 1 4 4 5h9-1v10l3 2 4 2-1 2-2 5h-2v-1l-2 1c-2 0-4 2-5 3l-3 2h-1v12l11-1 6-1 6 1 9-2c3-1 10-1 13 2l5 4c4 2 4 9 5 11s7 5 10 2l4-1a10 10 0 0 1 4-2l1-2 1-2h3l2 1 3 1 2-1c1-1 2-2 3-1l3-1h1l1 1h4v-4l-3-8v-4h-3c-1-1-4-2-3-3l1-8h-5l-2-1c-1-3-1-9 4-12 4-3 6-4 7-3h1v1c1 1 1 2 3 1l3-1 5-1c3-1 3-2 5-5a423 423 0 0 1 9-13c1-3 2-6 5-8l4-3v-2l2-2 3-3 2-4h1v-6l-2-2h1l-3-1-1-1-3-3h-5l-1-1v-1l-4-3h-3l-3-1-1-4v-4l1-2c0-1 1-2-1-4l-1-1-1-3v-3l1-2 1-2 1-1c1-1 2-2 1-4l-2-1-2-1-3-1c-2 0-5-1-7-4l-1-3h3v-1l2-3 2-3 4-2h-3ZM339 618l4 2h1l1-4-1-10c-1-6-2-5-4-6s-2 2-3 3 0 4 1 6v5h-1l2 3v1Z"></path><path d="m382 645-25-3-8-18v-1l-4-1v-1h-3l-3-3a75 75 0 0 0-4-6l-2-5-2-3-2-7-1-4-2-2-3-4-2-2-4-3-3-2-1-3a17 17 0 0 0-5 1l-2-5-10-2-6 1c-5 0-10 1-12-1-1-2-20-19-30-25l-25-11h-2l-3 2-19 5 4 5 5 8v1c-1 1-3 4-5 4l-3 1c-2-1-3-1-5 2l-1 2c-1 2-2 4-5 4l-15-3-1 8c-1 4-2 5-1 6l6 3 8 11c2 4 3 9 7 12 5 4 5 8 6 11 0 4 4 5 10 8 5 4 8 12 9 23 1 10 8 16 13 18 4 3 7 6 10 13 3 8 6 12 9 15 4 3 3 5 5 8l5 6 2-5h1l1 1 1 1h12l7-3 8-1 4 2 3 2c1-1 3-4 4-9 0-5 16-8 20-8l24-3 30-12 6-21-1-7ZM31 248l-1-1 1-2 2-2v-3l-1-1-1 1h-3l-1 1-4 1 1 1c5 2 0 5-2 6l-16-1 3 2h7l3 1h7l2-1 2-1h1v-1Z"></path><path d="m55 235-2-1-1-1 1-1v-1l1-1-1-1h-1l-2-3-1-2-5-2h-1l-2-2v-1l-2 2h-3c-1 0-4 0-5-2h-2l-1 1h-6c-3-1-4 0-8 3l-4 2-2 2c1 3 6 10 8 11l6 3a22 22 0 0 0 6-1l3-1h2v4l-1 2-1 1v5h7l2-2h2l1-1 1-1v-1l1 1 1 1h1v-1h-1v-5l1-1 1-1v-1l1-1 1-1 1-1 1-1h4-1Zm1346-451c-2-5-5-4-4-7 2-4 1-8-2-10-3-1-8-10-6-13 3-3 7-6 5-11s-5-3-5-8c0-4-1-6-5-7l-15-4c-2-1-9 0-10 1 0 1-4-1-11 8-6 8-7 0-13-4-5-4-14-1-18-2-4 0-11 0-21-2l-18-1c-5 0-9-3-19-6s-15-2-25-3c-10-2-30 7-38 8s-18 1-15 3 4 7 7 12c3 6 8 2 16 14s-7 11-11 8c-3-3-2-5-6-5-3 0-9-1-11-6s2-5 4-10c1-5-8-6-14-6-5 0-1 7-1 14s-6 5-10 6c-3 0-9 5-13 4s-6-2-10 3c-4 4-9 6-19 8s-15 0-20-15-22-13-28-13c-7 0-6 3-10 3l-12 8c-5 3-14 9-19 10s-4-4-5-7c-1-4-12-7-14-6-1 2-5 9-7 7-1-1 2-4-2-6-5-2-5 4-6 3 0-2-6-4-8-4-2-1-2-5 2-6 5-1 1-6-4-9-5-2-17-1-22 2-5 4-9 7-10 6-1-2 4-3 0-3l-31 2h-16c-6-1-7 4 2 5 8 1 1 6-5 7-6 2 0 9 1 11 2 2 3-1 5-1 1 1-1 4 1 5 3 1 1 2 6 5 5 2 3 5 1 7s-3 1-5-2c-3-3-7 2-8 3-1 2-3 4-11 4s-11 1-11 6-4 4-9 4c-4 0-9-2-12-5-4-3-5-5-6-4s2 4 3 8c1 5 1 7 5 13 3 7 1 11-4 11-4 1-3 0-7-3-5-2-9-8-14-10-6-2-10-2-15-5s-7-7 0-5 8-2 7-6-4-5-7-7c-4-1-5-5-11-13-6-7-18-8-24-7-6 0 0 5-3 5-3-1-3-3-16-5-14-2-9 10-3 16s2 7 0 7-4-2-8 1c-3 4-13 5-25 5-11 0-8-6-6-11 1-5-10-1-13 0-2 1-11-1-16 2-5 2-14 12-14 7-1-6-6-2-6-1s-2 3-6 3c-5 1-4 0-6-1s-4-1-3-4c1-2-1-4-2-3s1 6-3 3-8 0-8 1v7c-1 5 4 3 6 1 2-3 4-4 5-3l-1 5-6 8c-3 4-4 5-12 10-7 4-7 0-6-3 0-2 0-8 2-9s4-2 5-5c2-3-1-6 0-9 1-4 3-6 2-8s1-4 3-7l3-7v-7c0-3 4-6 4-9l-2-12c-1-2-4-1-4-2-1-1 1-3 1-5 0-1-3-6-7-8-3-3-4-6-7-7-3 0 1 5 0 6s-5-3-6-6c-2-2-4-4-8-5-5-2-8-1-9-5 0-3-5 0-10 4s-7 4-11 4c-4 1-4 1-3 3 2 2 2 6 0 10-1 4-3 3-7-2-3-6-2-17-7-18-6 0-11 5-13 5-3 0-1-2 0-6 2-4 1-7-1-9s-5-2-10-3c-4-1-7-1-11 2-5 4-2 14-4 18s1 6 1 8c1 3-4 3 4 9 8 7-1 12-4 12-2 1-4 2-4 5 1 3 2 4 0 4l-4 5-4 4c-1 0-1 5-2 4l-2-2c0 1-3 4-3 2v-5c-1-3-6-1-12 1s-11 4-11 7 1 5-2 9c-3 3-19 10-19 13l-4 10c-1 3-3 9-3 14s3 6 5 7c1 1-4 8 4 9 7 0 2 6 1 6l-13 6c-3 0-6 3-10 4l-14 4c-8 3-5 8-2 11 2 3 6 6 7 11 1 4 4 8 10 7 6 0 5 0 10 7s1 10-3 10l-8-5c-2-2-3-4-5-4s-5-1-8-4c-4-3-12-1-14-1-1 1-7 7 1 9 9 2 3 10-3 6-6-3-9-2-10 1-2 2 2 5 9 11s-4 7-5 6c-2-1-6-9-7-10l-3-7c1-3-1-4-1-6 1-3-2-2-2-4 1-3-1-3-4-7-2-3-4-2-2 2 2 3 3 8 3 12 0 5-4 6-6 9-1 3 2 3 0 10-1 7-8 2-9 0v-7c1-2-1-14-2-18-1-3-3-3-6-5s-7-2-10-1h-12c-3-1-3 2-3 5l2 13c2 8-1 17-6 24-4 7 2 13 5 15s1 6 3 9 0 4 1 9 3 4 9 5c5 1 4 1 4 5 1 3 5 4 11 7 5 3 3 11 1 13-3 1-7-2-9-4l-7-7-11-4-9-3-6-6c-4-2-12-2-21-2l-11 1-1 1c-2-4-6-5-10-8l-6-5-2 1c-2 2-3 4 0 8s6 5 8 6l5 2c1 0 5-1 5-3v2l2 7c2 3 6 4 7 7s-1 4-2 6c0 2-3 0-5 0l1 4c1 2-1 5-4 5s-1-7-2-11c0-4-4-2-8 1s-7 7-10 7-10 0-13 2-5 7-7 7c-3 0-3-2-3-3l-1-5c-1-2-4-3-3-4 2-1 5-3 4-4l-7 2c-4 2-4 4-6 5s-1 4-7 5-7 3-9 5l-6 7c-2 2-3 5-4 3-1-1-3 0-2 1 2 2 3 4-1 4-5 0-6 1-5 3l-2 11c-2 3-6 2-9 2-2 0-5-1-7-4l-5-6c-1-1 1-2 2-4 0-2 1-2 2-2l7-2c2-1-2-4-4-6-2-3-3-2-4-5s-2-4-7-3h-12c-6-2-3 2 1 4s5 7 4 14c0 7 0 9 4 11s3 3 4 10c2 7-4 6-7 5l-12-2c-4 0-7 7-12 13-5 5-4 8 0 15 5 7-2 11-5 11s-2-3-4-5l-9-3-6-4c-2-1-4-1-5 1-1 1 0 3-2 5-1 1 0 3 2 5s3 3 7 4c4 2 8 0 6 6-1 6-11 3-15-1-5-4-10-4-12-6-2-3 0-7-2-9-1-2-3-6-2-13s-9-9-11-10c-3-2-2-5-2-7 1-2 4-2 5 0s1 3 4 3 4-1 7 1l7 3 15 2c9 1 14-2 21-11 8-8 2-16 1-18l-6-6c-2-1-8-3-21-12-12-9-27-14-30-14L88-4c-2 1-3-1-7-3-4-1-4-3-7-4-3 0-6 2-7 1l-2-1-1 2-1 4v3c-1 1-4-2-5-2v-1 2l-2 4c-2 0-3 2-4 3l-1 1-1 2-1 2V8l-1 1-1 2v3l-1 2c-1 2-1 2 1 4l1 4 3 4 5 9-6 13a734 734 0 0 1 6 24l-2 4c-1 3 0 5 1 7v2l1 2 1 3 1 1 1 4 1 2v1c1 1 2 2 0 4l-1 1c-2 2-2 2-1 4l3 3c2 1 5 4 6 7 2 5 1 7-10 21a248 248 0 0 1-17 21l5-1c2 0 2-3 5-2l13-2c2 1 3 0 5-2h2c1 1-1 3-1 5-1 1 1 3 2 2s1-3 7-1c5 3-1 4-3 6l-5 1c-2 1-4 1-4 3l-2 3a60 60 0 0 1 0 4c1 1 0 3-2 5h-1l-1 6v5l1 2 1 3v1l-1 1-2 1-1 1 1 1v1h2v2c2 0 2 3 1 3v5l2-1h1l-1 1v2l1 2v4l1 1h1l2 1v1h4l1 1v2h2c2-1 4-2 5-1h1l3 3v8l-1 1v1l3 1 1 1-1 1v1l1 3c2 0 3 1 3 2l2 3h2l2 1 2 2h1l4 2v1c0 1 0 2-2 3v5l3 2 3 3 6 7 1-1 1-1v-1l2 1h2l1-1h3l1 1c1 0 0 0 0 0h3l1-1v-4l1 1 4 1 2-1v-1h3l1 1 2-1 3 4 2 3 1 1 1 1v1h-3l-1 1 2 2h1l-1 2 1 1-1 1h4l1 1h1l2-1 1 3v1l1-1h1v3l1 2v1h-1v2l1 1a11 11 0 0 1 1 2h1v-1h4l1 2h1l1-1 1 1v1l1-1h1l3-1c2 0 3-2 3-2h1v2l1 1v2h1l2 2 1 1 1-1v-2h1l1 2h3l1 1 1 2 2-2 2 1v1l1 1h1l1 1 1 1v1l1-1 1-1h1v1a7 7 0 0 0 1 3l1 2-1 1h-1l-1 1-2 1v1h3v3h-4l1 1v1h1v3l1 2h1v1l-1 2-1 3h-10c1 1-2 2-4 3v1h-1l-1 2 1 1 1 1h-1v1l1 2c1 1-3 3-6 6-4 3 1 3 1 4v5c0 1-1 5-5 5-5 1-2 3-1 6s2 3 6 5c4 3 6 3 13 5s6 5 12 9l5-4c4-2 17 6 19 6a324 324 0 0 0 6 0c2 0 2 0 5 3 2 3 4 3 4 3h1v2l4-1 5-1 2 1 2-1h2l1 2 2 1h2l1 1v1l-2 2v1l2 1h1l4 2 2 1h3l6 6 2 3h2l3-4 2-3 1-1 3-3-1-1c-3-6-8-7-12-11s-3-10-3-13c-1-3-6-7-7-14-2-6 4-9 7-11l10-6 7-6-2-1-2-2-4-2v-2l2-1h1v-1l-2-3-1-2-2-3-3-4-4-3h-4l-1 3-2-3v-6l-3-2-6-2 6-11-2-2-1-1v-8l3-2 2-5 3-4h1l9 11 4-4-4-9h-1 1l4-3c2 0 4-2 5-3v-4l-1-1h3l1-1c6-1 7-4 7-6 1-2 2-1 3-1v-1l-1-1 1-1h6l1 3v1h3l1 1v-1l1-1c0-2 0-3 2-3h1l1-1c2 1 3 2 3 4h7c3 0 4 1 4 2l1 1 3 2 3 3 2 1 1 1 1 2-1 2v1h1l2-1v-4l-1-1h-1l1-1h2l2 1c1 0 2 0 2 2l1 1 2 1 3 1h1c1 1 2 1 3-1l-1-2 1-2 3-1 1-1 1-1h1v1l1-1 2-1h1l3 1 2 2h1l1-1v-2l1-1h4v-1l2 1 2 1v1l1 1c2 2 4 2 5 2l1 1 4 2v1h1l2-1 2-2v-1l1-2h1c0 1 1 2 4 2l8-1 1-3 1-1v-2c1-1 2-2 0-3l-3-2h-1l-2-2-1-1h-6 1v-2l-1-1h-2l-1-1-1-1-1-1 1-1 3-1 2-2c2 0 3-1 3-2v-3l-1-3v-1c-1-2 1-3 2-4l2-2h8l1 1v-2l-1-2s-8 0-9-2l1-2 1-1 3-1h-6v-5h1l-1-2 2-1v-1h1l2-1 3 1h2l1-1h3v1l1 1 1-1v-1l3-1 3-1h-1l1-1h1l7-1 1-1 1-1 2-1h2a4 4 0 0 0 3 0l2-1 1 1v-2l-1-1h5v-2l1-1h3v-2l1 1 3 1 12-4 8-4h1v-3h3l1-2 1-1h2v-3l2 1 6 1 5 1h3l2-1h1l1 1 1 3 2 3 1 2 2 2v4l-2 2v1l-1 2v1h5l1 1 2-2v-1l3 1v-3h1l3 1 1 4-1 2h4-1v-3l1-1 2 1h1l4 1h3l2 2-1 1h-1l-2 2h-1v5c1-1 3-3 5-3 3-1 3 0 4 1v1l3-2c0-2 1-3 3-3l3-1 2-1 1-2v-1c0-1 0-2 2-3l4-1h1l1-1 3-2h1l6-3v1l-2 3-2 2-2 2h1v1l1 2 2 3 11 9 26 41a19 19 0 0 1 3-3v-4l3-2 2-1 1-1 1 2v4h3l1 3v1h12l3-3 8-2h1c1 0 2 0 4 5l3 5 1 1c0 1 1 3 3 3 3 1 5 3 5 4v1l2 2c4 2 6 2 9 2h1l2-3 1-2h1l1 3 2 2 4 3 1 1 1 1 2 2-2 1-2-1-2 1-2 4-1 2c-1 2-3 4-6 5h-2c-1 0-2 0-2 2v5h8l3-2 3-2v-1c1-1 0-1-1-2l-1-1 3-2h2l7-2 1-2 3-3 2 1h2l1-1 2-3 2-3 1-1 2-2h1c1 2 1 2 4 2v-1l2 1c3 2 6 2 9 2h1l3-1 2-1 1 2v2c0 2 1 4 3 4l8 1 3 1 3 1h8l4 1c1 1 1 1 2-1l1-2h1c2 0 4-3 4-5l1-3c1-1 1-2-1-3l-3-1-1-4h-1v-2l2-3a23 23 0 0 1 2-4l3-6v-2l1-4 2 1 8 5h2l4 1 5-1 6 1 5 1c2 0 3 0 4 2l-1 4v4l4 3 4 3 2 1 3 1 3 1c3 2 3 2 6 1l5-2c1-2 2-3 4-3l6 2c4 1 8 2 10 1l3 1 4 1 2 1c4 0 6 1 8 3l1 2c1 2 2 2 5 3h2l8 1h4c8 1 11 1 15-1l4-2 9-6 5-5c2-2 3-4 5-4l9 1 10 1 6-1h3v3l8 1h5l2-2 6-4 2-1-1-2-1-1v-3l9-22 3-3 2-2h-1v-5l-1-2-1-2-2-1h-2v-5l6-6 7-2 2-1a256 256 0 0 1 17-4c4 0 14 6 15 6h2l2 1h3c2 0 2 1 2 3l3 1 2 2v4l1 1h2l1 1v1l-1 1v1h2l1 1-1 2v3a54 54 0 0 1 3 5l1 3v1c0 2 1 2 3 3l1 1c2 1 1 3 1 5l-1 1 1 2 3 4 1 2v3c2 3 3 3 5 2h6l5 2h4s6 7 9 7l2 2v3l-2 3 2 4c2 1 3 5 4 6h16l3-1h1l5-5 2-3 1-1h5l2 3-1 3-3 4-4 3-3 2v8l-3 2-1 1-1 4-1 2-3 2c0 1 0 5-2 6l-1 1h-2v1h-1c0 2-1 4-3 5l-2 1c-1 1-3 1-2 4v5l-1 2h3c2 1 2 6 9 7 6 1 8-4 13-9 5-4 4-8 6-12l5-13 4-12 5-10c1-2-1-4 1-6l1-6 1-9 4-16c2-3 1-12 0-14l-2-11c0-2 0-11-4-15-4-3-4-2-3-13 1-10 2-11 7-4l12 17c6 8 3 10 3 20 0 9 1 7 6 14s4 7 1 12c-4 5-4 9 0 10s6 6 8 9 0 8 3 10c2 1 3-4 3-7 0-2 1-4 3-5s6 0 6 2c1 2 4 6 4 4l-1-7-4-4c-2 0-4-2-4-3 0-2 0-4-4-7s-3-3-5-7c-1-4-2-7-2-17 0-9-1-6 2-8 2-2 5 1 8 4 2 3 5 6 5 4s-2-3-3-5l-5-6-7-19c-4-14-17-28-22-31-5-4-1-5-1-8s-2-3-4-5c-2-1-2-4-1-3l4 4-5-8-5-5-3-4-1-4c-1-1-2 0-3-2-1-1-1-2-3-2s0 3-1 3c0 0-2-2-3-1l3 4 4 3 2 5c0 2 2 2 1 3-1 2-3 0-6 0s-1 3-4 3-13-6-15-8c-2-3-5-4-9-4-4 1-3 2-5 1-1-2-3-1-3 0v6c0 3-4 7-6 6-2 0 0-4 0-6 1-2-4 0-6 1-2 2-4 2-5-2l-2-8c-1-3-3-4-6-2-4 2-5 4-9 3-5-1-3-4 0-9l7-14c3-9 3-12 3-17s2-9 4-12c3-4 3-8 5-11s1-10 2-15c0-5 4-7 4-12 1-5 6-12 13-15 7-2 10-4 13-2 3 3 7 3 8 1s-4-5 2-5c6-1 22-4 21-9-2-6 4-5 9-5 6 0 13 1 17 3 4 3 8 7 12 7 4 1 6-6 6-8s8 0 10 0 4-5 1-7c-3-3-8-2-10-4s-1-7 0-11c0-5 2-5 2-23 0-19 6-16 9-17 2-1 7-6 10-5s6 5 7 3c1-3 1-5 4-3 3 3 0 9 0 12-1 2 2 3 6 3 4 1 3 4 5 7 3 2 4-3 5-7s2-15 4-18c1-3 4-4-1-16-5-11-1-12 5-13s8 5 6 5c-3 1-4 3-3 9 0 6 6 8 6 9 0 2-3 6 0 8 2 2 2 3 2 7s3 6 1 8c-1 2-6 5-7 11-2 6 3 11 1 14s-3 9-3 17l-1 19c-1 8-3 3-5 9s-3 5-7 6c-5 0 0 3 3 5s1 8 1 12c-1 5-5 11-3 18l4 14c1 6 18 28 19 32s8 8 9 13c0 5 8 8 11 10 3 3 4 10 4 14 1 4 3 11 6 11 4 1 3 8 4 8l3-6 5-8c2-3 2-14-2-18-4-3-1-9 0-12s10-3 8-5l-6-12c-3-5 1-14 7-16 7-2 6-6 4-10-3-5-9-11-10-16s0-12 4-10c4 1 4-2 4-6 1-5-3-5-4-9-1-5-4-1-7 0-2 1-2-3-4-7-1-4 1-6 1-10s-7-7-10-8c-4-1 2 8 0 8-3-1-5-5-8-11-3-7-1-25-3-30-2-4-3-6-2-10 1-5 3-2 7-1 3 1 3-2 3-6 1-5 3-7 6-6 3 0 2 10 6 11 3 1 2-7 1-14-1-8 8-7 13-9 6-2 8 1 10 3 2 3 9 6 13 7 4 0-1-6-2-15s4-18 5-25 6-13 10-23c4-11 11-14 19-14 7 0 11 0 12-4 0-4-1-8-3-10l-6-8c-2-4-4-3-9-4-5-2-7-5-7-10 0-4-3-2-6-2-2 0-3-3-2-6 0-3-7-6-7-4s-1 4-7 1c-7-4-5-7 4-8 8 0 6-9 5-13v-18c-1-3-4-7 0-11 4-3 4-6 4-10s11-8 15-1c5 6 5 7 12 5s4-2 13-2c8 0 5-6 3-10Z"></path><path d="M48 6V2l2-2v-4l-3-3-3-2-3-6-1 1c0 1-1 2-4 2h-4l-2 1-2 5-1 4c-2 3-3 8-3 10l-2 3-1 1-1 1-1 4h-1l-2-2c-1-1-2-3-4-3l-3 2-4 2H2c-1 0-3 1-4-3l-1-4c-1-2-1-5-3-6-3-1-3 0-5 3v1l-2 1 1 2 6 6c5 3 10 5 10 7l2 3 1 1v7c0 3 0 4 2 6v6l1 9a76 76 0 0 0 0 11l10 1c3 0 7 2 10 5 2 4-2 9-3 10l-9 12-7 8-3 5c-1 3-2 4-4 5s-5 5-5 10c0 4 2 4 2 5l1 7 1 16c0 7 3 6 6 6s3 2 4 3l6 1c2 2 4 7 6 7 1 0 4 0 8-4l6-2 7-9 10-12c12-15 12-17 10-21-1-3-3-5-6-7l-3-2c-1-3 0-4 2-6h1v-4l-1-1v-2a14 14 0 0 1-2-5c0-2 0-2-2-3l-1-2v-2l-1-7 3-4 1-2-8-22 7-13c0-1-3-6-6-8l-2-5-2-4-1-4 2-2v-3l1-3V6ZM16 406h-3c0 1 0 0 0 0v3l1 1 1 1v1h1l1 1 1 2v2h2v-1l1-1 1-1 1-1 1 1 1 1v-1l2-1v-2h1v-4h-2l-1-2-2-1v-2h-1l-1-1-1-1-2 2 1 1-3 3v-1 1Zm0-1Z"></path><path d="m40 400-1-1-1-2-2-3-1-1v-3l1-1 1-1 1-1-2-1v-2l1-1h1l-1-1h-2l-1 1-1 1-2-2h-2l-2-1v-1l-2-1v-1h1l-1-1v-1h1v-2h-2v-1l-3-1-1-1-1-1 1-1v-2h-2v-2h-1l-1-2-1-1h-1l-1-1-1 1H8l-1 1-2 1-1-1-1 1-1 1v2h1v1H2v1l1 1v1l1 1 1 1 2 2H5l-1 1v2h2v3l-1 1v1l-1 3h1l4 4v1H6l-1-1 1 1 2 4v1l-1 1v-1H6l1 2 1 1 1 2 3 1 1 1 2 1 1 1c2 0 2-1 2-2v-2l2-1 1 1h1l1 1 1 1 1 2 2 1 1 1h1v2l-1 2v1l-1 1 3-1h2l2-1 1 1 1-1v-2l-1-1v-2l1-2h1l2-1 2-2-1-1Z"></path><path d="m-10 403-1-1-2-3v-1l-1-1-10-9v-3l-1-1v-2l-1-1-1-1h-1v-6h3l2 3h1l1-3h3l1-1 2 1 1 1v-1l1 1h4l1 1 1-1h2v1h2v-1l1 1h3v2l1 1h2a6 6 0 0 1-1-2v-1l2-2h1-1l-1-1H3v-3l-1-1v-1h1-1v-3H1l-2 1-2 1h-6l-2-2h-2l-1-3-1-1h-2l-1-2-1-1-1-1h-1 1l-2-1-1 1v1h1-3v1l-1 1h-1v1h-2v1h1v4h-3v1a25 25 0 0 1-1 0l1 1-1 1 1 1v1h-3l-1-1h-1l-1 1-1-1-1-1v-1 1l-2 2h-2l-1-1v1h-2l-3 1-3 1v4c0 4 4 5 6 4 2-2 1-5 3-6 1-1 3 2 4 5l3 7c1 2 0 5 2 7 2 1 6 4 10 4 5 1 6 1 9 4l2 2h3v-1Zm27-217 7-1c1 0 3-2 0-3l-6-1c-3 2-2 2-3 4-1 1 0 2 2 1Zm60 313-9-3c-6-2-4 2-7 1-2 0-3-2-7 0-2 2 0 5 1 5h7c2 0 4 4 6 4l6-2c4-1 7-1 8-3 2-2-2-2-5-2Zm71 8c3 0 5-2 7-3 2 0 5 1 5-1 0-1 0-4 2-5l3-4-6 3c-2 1-4 2-5 1l-3-1c-4 1-4 3-7 4-3 0-5 2-3 4 2 1 4 3 7 2Zm69-528c-7 0-10-2-12 2-4 8 0 12 3 15 3 2 1 5 5 4 5-2 7-5 9-6 3 0 7-5 5-8s-3-6-10-7Zm-40 538c2 0 2-1 3-2l1-1 1-3 3-2h1l1-1v-3l1-2-1-1c0-2-1-2-3-2h-7c1 1 2 2 1 3a119 119 0 0 1-5 15h2l2-1Zm0 1h-2l-2 1-3 5c-2 2-1 5-2 9l-2 4 6 23c2-3 7-22 7-43l-2 1ZM50 295l1-1h-1v-2l-2-2-1-1-6-6 1-1 1-3 1-1v-2c1-1 0-2-1-3l-2-3c0-2-2-3-4-5l-2-3-4-10a59 59 0 0 0-1-3l-1 1-3 1H16l-7-1-4-2-5 1c-4 0-5 2-7 3-1 0-5-1-5-4-1-4-4-4-6-3l-9 1c-2 0-1 2-2 3-2 1-4 0-5 2 0 1-1 3-4 3l-3 1v7l-2 2 2 2 2 2v4l2 2v3l-1 3 1 2-1 1v1l2 1 1 1 1 1-1 2-1 3v2h1v-2h2a221 221 0 0 0 2 3h2l1 1h1l1 1h1v1-1h2l1 1h1v1l-1 1h-1v1l1 1 1 1 1 2h2l1-1 1-1h-1v-1l-1-1 2-1 1 1 1 1 2 1h2l1-1 1 1-1 1a7 7 0 0 1-1 1l2 2h1l1-1 2 2h1c2 0 2 1 2 2l1 1 1 2 1 1h1v1h1l1-2h1l1-1 2 3 2 1v2h1l1 1v-1l1-1 1-1h5l1 1 1-1h1l4-1h2c2 0 3 2 3 3l4 1v1l3 1v-1l-1-1-1-5 5-6 3-5 4-1 1-2v-5Z"></path><path d="m-38 295-1-1v-2h-2v2h-1l-2 1h-1v1h-3l-1 1-1 1h-1l-1 1-1 1h-1l-1 1h-2l-2 1v1l-1 2-1-1-1-1v2l3 2 1 1-1 2v2l1 1 1 2 1 2h2l2 3h1l1 1 1 1h1l2 3 2 1v1l2 1 1-1h3l1-2h1l1-3h3l3 1h1l2 1h1l1 1h2l2-1 1 1h1l1 1v1l2-4 3 1h2l1-1h1v-1l1-1h1v-1l1-2 1-1 2-3h3v-1l-1-2-1-1-2-2h-1l-2-1h-3l-1-2s-1 0 0 0v-1h1v-1h-4l-1-1-2-1h-1v1h1v2h-1l-1 1-1 1h-1v-1l-1-1-1-2h-1v-2l1-1h1l-1-1h-3l-1-1-1-1h-4l-1-1-1-3-2 1v2h-3Zm20 63v1l1 1h2v1l1 1 2 2h2l1 2h3l2 1 3-1 2-1h1v-1l2-1h2l2-2a56 56 0 0 1 4 0h7v-1h2l2-1 1-2h1v-1h-1 1v-2h1v-1l2-3v-1l1-1 1-1 1-3 1-2 1-1 2-2h1l1-1 2-1v-1h1v-1h-3v-1l-1-1-1-1-1-1-2-1-1 1h-2l-1-1-1-1-2-1-3 1-2-1-3 1-1 3-2 1H7v1l-2 1-2-1-2 1v1l1 2v1l-3 1h-1l-8-1-3-3h-2v1l-1 1 1 1s1 0 0 0l-1 1h-3l-1-1-1 1 1 1 1 1v1l-2 1a20 20 0 0 1 0 3l1 1v1l-1 1h-2l-1 2h2v2l1 1 1 1v1l2 1Zm110 12 1-1v-2l1-1h1v-3h1l1-1 1-1h-1v-2l-1-1v-1l1-1h1l2 1 1-1v1h1l1 1 1-1 2 1h2v-1l-2-1h-1l1-2v-2h-1l-1-1h-1v-3h-1v-1l1-1-1-1h-1l-1-1-1-1-1-1 1-1v-4h-2l-2-3h-2l-1 1v-1h-2l1-1h-2v-1l-3-2h-4l-1 1-1-1h-4v1h1l-1 1 2 1 1 1a14 14 0 0 1 2 5l1 2v1l1 1h1l1 2h-1 1l1 1v1l1 1 2 1 1 4v6l-1 1v10h3Zm135 50h3l4-1 1-1 3 1 1 1 1 1 1 2 2 1 13-2h3v-1l1-2 3 1 6 3 4 1h2v-2l-2-2-1-2h-1v-2l2-2-1-1-4-1-1-1-2-1v-1l1-2 1-1h-3l-3-2-1-1v-1h-1l-2 1-2-1-5 2h-4v-2h-1s-2 0-5-3l-4-2h-7s-14-8-18-6l-5 3h1c6 4 9 5 15 12 6 6 4 9 2 13l3 1Z"></path><path d="M103 372h-3l-1 1-2 1-1-1-1 1h-2l-2-1-1-1-1-1-1-2 1-2v-9l1-2v-2l-1-1-1-3-1-1v-1l-1-1v-1h-1l-1-1v-1l-1-1h-1v-2h-1l-1-2v-2l-1-2-2-2-1-1h-2l-1 1-1 1-1 2-8 1c-1 1-2 3-4 3l-1-1-1-1-2-1h-7l-2-1v1h-1l-3-3-1 2h-1l-1 1-1 2h-2l-1 1-2 1-1 1-1 2-1 3-1 1-1 1v1l-1 3v1h-1l-1 2a4 4 0 0 1 0 1l-1 2-1 1h-2l-1 1h-1v1h-3a11 11 0 0 0-1 0l1 1 2 2 1 1 1 1v4l2 1 2 1h1l1 1 1 1v1l-1 1 1 1v1h-1l-1-1 1 1 1 1h1v1h1l3 1 1 2v-1l2-2h2l1 1v1l-2 1v1l2 2h1l2 2h1l-1 1-2 1 1 1h6l2 1 2 1h12l2 1h1l2-1 4-3 4-2 4-1 2 1 2 1h3l1-1 1 1 1 3h1l6 1 2-8c2-4-1-4 0-6l6-3v-3l-1-2Zm582-56 1 2 4 3 3 1h5l2 2 1 1 1 1v-1l6 3a93 93 0 0 1 7 16l-1 3 1 4v1l-2 4 1 2 1 2c1 3 1 3 4 4h20c5 1 8 3 11 5l5 3h3l4-1 2 1-1 1-1 1 1 2c2 0 2 1 2 3l1 3a43 43 0 0 0 8 11v-1h2l2-1h9l5 1h12l6-1 3-1h5l3 1 8 1c1 1 4 4 10 5l3 1v-1h13l2 1-1 1v1c1 1 2 2 6 0l24-12 17-3c3 0 4-1 6-3l3-3 6-5c1-3 7-7 8-8l-5-10 4-6h20l5-2 1-5v-2h8l8-6 6-10h5l2-4h4l6-3 3 1 3 2 7-3 1-1-2-3-3-2-5-5-3-1-3-2c-2-2-3-3-5-2l-3 2-2 1h-14l-5-2v-1l-1-4 2-4 1-2 4-9 2-4 1-2c1-2 3-5 2-6h-3l-6 1-10-1h-9l-5 3-5 5-9 6-4 2c-4 3-7 2-15 2l-4-1h-8l-2-1c-4 0-4-1-5-3l-1-1c-2-3-4-3-8-4h-2l-4-2h-3l-10-2-6-1-4 2c-1 1-2 3-5 3l-6-1-3-1-3-1-3-2-3-3-4-3v-8l-2-1-6-1c-3-2-4-2-6-1h-9l-2-1c-4-1-4-2-8-5l-2-1-1 4v2l-2 6-2 2v2l-2 3-1 2h2l1 3 3 2c2 1 1 2 1 3l-1 3c0 2-2 5-5 5h-1v3l-3 1-4-1h-8l-3-1-2-1-9-1c-3-1-3-3-3-5v-2l-1-1h-1l-4 1h-1c-3 0-6 0-9-2h-2l-4-1-1-1-2 3-1 1-1 2-2 3-2 2-2-1h-2l-2 2-2 2a170 170 0 0 0-11 4l1 1 1 2v2h-1l-2 2-4 1c-2 2-4 1-5 1l-3-1 1 1v10l2 3Z"></path><path d="M203 316h-1v-3h-1l-2 1-1-2-1-1h-2l-1-1-1-1-2 1-1-1-2-1h-1l-1-1-1-1h-1v1l-1 2-1-1v-1l-2-1-1-1v-2l-1-1-1-1-3 1-3 1-2 1-1-1h-2l-1-2h-3v1h-2l-1-1-1-1v-4l-1-1v-3h-1v-1l-1-2h-2l-1 1-1-1h-4v-5l-2-2 1-1h2v-1l-1-2-2-3-3-3h-3l-1-1-2 1c0 1 0 2-2 1l-4-1-1 3-1 1-1 1-2-1h-2l-2-1-1 1h-4v2l-3 3h-1v3l1 2-1 2h-1v-1h-1l-1-1-1-1h-1l-1 1h-1l-1-1v-1l-1 1-2 2-2-4-3 1-1 2-1-1v-1h-3v-1l-1-1v1l-2 1-1-1-1 1-1 1v-1l-1-1-1 1-3-1v-2h-2l-3-1-1 1v-1l-3-1h-1l-1-1h-2l-2 1v-1h-4l-4 1h-3l-1 1-2 3h-1v1l-2-2-1 1v5h1v1l2 3 1 1v2h-1l1 1v3l-1 1-1 2-3 1a123 123 0 0 1-8 11v5h1l1 1v1l-1 1h-1l-2-1v1l-1 2-1 2-1 2v2h1l1 2 1 1 2 1v1h2v1l1-1 1-1 3 2v-1l3 1h2l3 1 1-1 2 1 1 1 1 1 1 1 3-3 8-2 2-1 1-1 1-1h1l1-1v-1h3l1-1 1 1 1-1 1 1v-1h3l3 3h2v2l1-1v1h4l1 2h3v5l-1 1v1h1l1 1v1h1l1 1v1l-1 1h1v2h1l1 1h1v5l2 1v1h-1l-1 1-2-2v1l-1 1-1-1v-1l-1 1v-1l-2 1-1-2h-1v3l1 1v1l-1 1v2h-1v1l-1 1-1 1v1l-1 1v1l-1 1h-2v1h2l1 1h2l1-1v1h1l1-1 1-1c2-1 3 0 4 1l1 2 1 2c2-3 0-4 0-6l4-2c2-1 3-6 6-10 4-4 4-2 9 0 4 3 2 3 5 3 4 0 9 2 9 4 0 3-2 2-5 4s-2 4 0 4c1 0 6 3 5 6-2 3 4 4 9 4 5 1 4-3 5-4l6-1 4-4h9c4-1 0-3 0-4s-2-2-5-1h-7c-3-1-3-4-4-6-2-2-2-2 0-3 1 0 0-6 2-5 7 1 11-2 15-5 5-3 5-4 8-4l4 1 1-1-1-1v-2l1-1a2 2 0 0 1 0-1l1-1c3 0 4-1 4-2h-1l1-1h6l1 1 2-1 1-2 1-2v-1c-1 0-2-1-1-2l-1-2v-1c-1-1-2-1-1-2l2-1h1l1-1h-3l-1-1v-1l2-1 2-2 1 1v-3Z"></path><path d="m34 325 1-2 1-1v-2l-5-2c0-1 0-2-2-2l-1-1-2 1h-3l-1 1h-1l-1-1h-4l-1 1-1 1v2l-2-1h-2v-3l-2-1-1-2H6l-1 1v1l-2 1v-1h-4l-2 2h-1l-1 1v2l-1 1-1 1-1 1-1 1h-1l-2 1-3-1-1 4-1 2v1l1 2 1 3v-1l2 1 3 2 8 1h3v-4l2-1h3l1-1h7l1-1 2-4 3-1 2 1h3l3 1 1 2 2-1h1l1-2 1-3ZM14 222c4-3 5-3 8-3h1l4 1h1l1-1h3l4 2h3v-1l2-2 1 1v1l1 1 1 1 5 2 1 2 2 2h2l2-1h4l2-1v-2l3-2v-4l-1-2-1-1v-1h-2l1-4v-1l-1-3-1-1v-1h-5l-3-1c-1-1-3-2-3-4-1-1-6-3-7-2l-2 1-4 2v8c-1 6-5 5-7 4l-1-2-4-5c-1-2-3-3-6-3-2 0-6 4-8 6-3 2-2 3-1 4l-1 4-1 11a98 98 0 0 0 7-5Z"></path><path d="M42 196c1 0 6 1 7 3l3 3 3 1h2l2 1-1-1v-1l1-1 2-1 1-1-1-1-1-3v-2l-1-5c0-2 0-4 2-6l1-1 2-4v-2l-1-2-2 1-5-1-6-2c-3 0-5-2-6-1l-3 3-9 2-5 4v9l-3-2-5 2-2 1-2 1-2 2 1 3v5l2 1c2 1 1-2 1-2l1-2 2-2 2-1 1-1v-4h2l2 1 2 2 4 3 3 2v2l3-2 3-1Zm735 465c0-3-1-6 1-7l1-1 1-3v-3l2-1h1l1 1 1 1v-1l1-3v-1l-1-2-1-4-1-2v-3l-2-3-1-3-1-6h-2l-2 3v5l-1 1v1l-1-1-1-3h-1l-1 1v1-4l-1-2v-5h1v-1l2-1h1l1-1 1-2h1l1-2v-1h-6a12 12 0 0 1-2 1l-2 1h-2l-2-1-4 1h-4v-1l-3-3-1-2-1-3v-3l-1 1-2 1-3-2-1-2-1-1h-2l-4-3v4l-2 2v8l1-2h1l6 5v1h-6l1 1 1 2-1 1 2 4 1 2-1 1-2 1v1l1 2 2 3 1 2 2 3 2 6 1-2c2-1 1-3 1-5 1-3 3-1 5 1 1 1 2 2 4 1 1-2 3 2 4 5 1 2 2 4 2 9 0 4 4 8 8 13 2 3 6 4 9 4l-2-4v-1ZM267 446l-1-1h-3l-3-1-1-1h-2l-1 1v3h2l4 3 3 2 3 1 1 1a110 110 0 0 0-2-8Zm261-20-2-2v-2l3-4-2-3-2 1-2 1-2 2-2 1-1 1-1-1-1-1-1-1-1 2v1l1 4v1l-2 1h-7l1 1 2 2-1 1-1 3-1 1h-8l-3 1h1l-1 3-1 1 1 1 1 1h2v1l2 1h3l1 2-1 1 1 5v1l1 1v3l-3 7-1 3-1 1s1 3 3 3h1l1-1 2-1 4-3h2c1 0 0 0 0 0l1 1 2 1h1v-4l2-1h3l2 1h1v-2l1-2v-1l1-1a53 53 0 0 1 1-3l1-2 1-2 1-1 1-1h2l1-1 1 1 1 1v2l1 2v2l1 2v3c-1 2 0 4 1 8l1 2h3v-1l1-1 4-1h2l1-1 1-1 1-1 1-1 3-2c3-2 5-1 6-1l-1 3 3-1 6-2c2 0 3 1 3 2h1l1-2v-6l-1-1-1-2-1-2c0-2-2-2-4-3h-2c-2 0-4 0-5-2v-2l-1-4-2-4h-4l-7 1-2 2-1 1-1-1-1-1h-1l-2-1v-1l-2-1h-3l-1 1c-2 1-4 2-5 1l-2-1v-1l-2 1-2 1h-5l-3-1c-2-1-2-2-2-4l1-3 1-1 1-1v1a20 20 0 0 1 6-2l2 2 1 1h2l2-1 1-1 1 1 2 2h1l-1-2-1-1v-1a44 44 0 0 0-5 1Z"></path><path d="M382 414v-5l1-2 1-1h2l3-1 1-1h1v-1l1-2h3l1 1-2-3 4-2v-2l2 1 2 2 3 3h5l3 3 1 2c-1 0-1 1 1 1l2 1h1l-1 2-2 3-1 1v1l5 2h9l2-1h2c1 0 2 0 3 2l1 2 1 3 5 11 35 21h3l2 1 3 1 2 3v6l5 1 6 1h1l1-1 1-4 3-6v-4l-1-1v-8h-3l-2-1-1-1h-2l-2-2 2-2v-3h11l1-2 1-2v-1l-2-2v-1l2-1h6v-1l-1-4 1-1 1-2h1l2 2h1l1-2 3-1 1-2h3c2 1 3 2 2 3l-3 4v1l1 1 1 1h5v-1h3c2-1 2 0 2 1l1 1 1-1 1-2 2-2h3l1-1 2-1 2-1 1-1 1-2h-4l-3-1h-2v-2h-3l-1-2a4 4 0 0 0-1-2c0 2-3 4-5 4l-2 1-2-1c-2 0-2-1-2-2v-2l-2 2-1 1-2-4c-1-1 0-2 1-2l1-1 3-1h1v-1l1-2 3-2-3-2-4 5-1-1v-1s-8 11-11 11h-3l-1 1-1 3h-1l-2 2v6h-2l-1-1c-2 0-3-1-3-2v-1l-1-2v-3h-2l-12 1h-1 1s0-9-3-10h-4l-1-2v-3l1-9h-4s-4-10-8-10h-2c-1 1-2 2-4 1h-1a63 63 0 0 0-22 2l-3 1-2-3c-2-4-5-9-10-10l-13-8c-5-4-10-8-13-8l-27 10 3 53 10-1v-3Zm-293-9c0-6 3-5 5-8l2-2-6-1-1-1-2-2v-1l-2 1-1-1h-2l-2-1h-5l-4 2-3 3-3 2h-1l-2-1h-5l-2-1h-5l-2-1h-8l-1-1v-1l1-1 1-1-2-2h-1v1l-2 1-1 2 1 2v1l2 3 2 2v1l1 1c1 1 0 2-1 2l-1 1h-2l-1 1v6l-1 1 2 2 3 2v2l1 1-1 1v2l1 1v1l2 1 1-1h2l1-1h4-1v-1h3l2-1 1 2v1h2v-1l1 1 4 1h4v-1h4l-1-2v-1l1-2h1v-1h2v-1l1-1h1l3-1h3l1 1 1 1 1-1h1v1-1h6l-1-2c-2-4-2-4-2-9Zm185 45h1l-1-2v-2h-1l-1-1-2-1-3-2-1-1-1-1v-1h3l1-1v-1l-2-1-2-1-1-3v-5l-2-1-2-1v-2l-1-1h-3l-13 3h1v7l1 2v2l3 2a50 50 0 0 0 5 1l3 3v1h1l2-1 1 1 3 2h3l1 1 1 1a121 121 0 0 1 3 7l3-2v-2Z"></path><path d="M499 469h-1l-6-2a71 71 0 0 1-15-3l-2 2-2 2-2 1c-1 0-2 0-2 2l-1 3-1 4c-1 4-4 6-6 6h-4l-1-1v1l-2 2h-6v2l-1 2-4 3c-2 2 0 4 0 4v3l-1 1-2-1-1 9h5l-4 3 1 6v10c0 4-1 5 2 7s8 0 9 0l2 1-2 3c-3 2-4 5-5 7l-1 3c-2 1-3 4-3 7l2 4 2 2 8 1h3a14 14 0 0 1 6 0h4l3-1c1-2 2-3 3-2l2 1 3 1 1-1 4 1h4v-7c-1-1-2-2-1-4l3-4 4-1h4l2-1h2l1 1v-1l-2-3v-1l2-1 5-2c2-1 4-2 5-1v1l1 1 3-1 1-1 1-1v-4l-1-2-1-2h1l4-1-1-1v-2c1-3 2-4 4-4l4-1-1-4-2-5-1-2h11v-5l1-2 5-8-1-1v-2c1-2 2-2 1-3l-1-2-3-4h-1l4-5 1 1v1l2-2 2-4c1-2 1-3 4-2l7-1 2-1 3 1a48 48 0 0 1 5 0h5v-1l-1-2v-2h4v-1l-3-1c-2-1-5 0-6 1l-4 2-1 1 1-1 2-3h-5a41 41 0 0 0-5 3l-1 1-1 1v1l-3 1-4 1v1h-2l-1 1h-1v-1l-1-2c-2-3-2-6-2-8v-1l1-2-2-2v-4l-1-2v-1h-3l-2 2-2 2v2l-1 2-1 1v1l-1 1v3l-1 1h-1l-2-1h-3l-2 1v5h-1l-2-1h-1v-2l-2 1-4 2-2 2h-1l-2 1-2-4-1 1ZM27 430l5-4 1 1h4l1-1 1-1 1-1v-6l-1-2-2-2c-2 0-2-1-3-2h-4l-2 1-2 1-1 1-2-1h-1l-1 1-1 1v2h-2v3l-1 1v1l1 1-1 1v1l1 1 1 1v1h1v1h7Zm714 158h1-1l-1 3 5 3 2 1h4l2-1 1-1 3-1h1l5 2 2 1 3-1h1l5-1 2-1h-1l-1-1v-6l-1-1-2-2-2-1-2-1-2-1-2 1h-16l-2 2-2 2-3 1v2l1 1ZM346 406a456 456 0 0 0 9-1l3 3c6 3 8 9 9 11l5-1-3-53v-1l27-10 14 8c5 4 9 7 13 8 4 2 7 7 9 10l3 3h2l9-2h14l3-1 3-1c4 1 8 9 8 11l4-1v15h4c3 1 3 8 3 10a147 147 0 0 0 14-1v1l1 1v4l3 2a77 77 0 0 1 3 0v-2l-1-3 3-2 2-3v-1l2-1h2c2 0 9-8 10-10h1l1 1 3-5 3-5c2-2 4-2 8-2h3c4 0 7 1 9 3l3 1h1v-5l2-4 3-2c1-2 2-2 3-2l1 1 2 1 3 1 6 2 5-1h31c4 0 5 2 5 2l5 3h1l6 2v-3l-1-2 1-2 2-1h1-1l-1-1 1-2 2-1v-3l-1-2-1-2-2-6-1-5 1-1-2-2-3-2-2-2h1l1-2c1-2 1-2 3-2h4c3 0 4-1 5-2l5-2 3-1v1l1 1h4l2-1v-2l-3-3 7-24 5 2h6l6 2h1l2-1 1-2 2-1 4-3v-2l1-6-1-2-1-6c1-3 1-3 3-3h2a10 10 0 0 0 7-7l2-3 2-1h4l-2-2h-1l-2-2c0-1-1-2-3-2-2-1-2-2-2-3l-1-2-1-1-1 2-2 4h-1c-3 0-5 0-9-2l-3-3 1-1c-1-1-3-3-5-3-3-1-3-3-3-4l-1-1-3-5c-2-4-3-4-4-4h-1l-7 1-4 3-9 1h-1l-2-1v-1l-1-2h-3v-5l-1-1-1 1-2 1-2 2-1 1v2l-3 4h-1l-25-42a155 155 0 0 1-13-12l-1-2h-1v-2l2-2 2-1 2-3-6 2-1 1-2 1-2 1-4 2c-2 0-2 1-3 2v1l-1 2-2 1-2 1-4 3c0 2-1 2-3 2l-1-1-2-1-6 4-1-5 1-1c0-1 0 0 0 0l1-1 2-1h1v-1l-1-2h-2l-1 1-4-1h-1l-2-1v3l-3 1-2-1 1-1v-4l-3-1h-1l1 2v1h-1v-1h-3l-1 2h-3v-1h-4v-3l1-1 1-2v-4l-1-2-2-2-1-3-1-3-1-1-1 1h-2l-1 1h-2l-5-1c-2 0-4 0-7-2h-1l1 1v1h-3l-1 2v1h-3v3l-1 1-9 3-12 5-3-2v1l-1 1h-4l1 2h-5v1l1 2-1 1-1-1h-2l-1 1h-4l-2 1-2 1-6 1-1 1-4 1-2 1-1 1-1 1h-1v-1h-12v1l-1 1v1l1 1-2 1v3h4l2 1v1l-2 1h-2v2l8 2 1 2 1 1v1h-10l-2 1v1l-2 2 1 2 1 3v3l-4 3-2 1-3 1-1 1 1 1 1 1h1l2 1 2 1-1 2h5l2 1 1 1 1 1 3 1c2 1 2 3 1 5a19 19 0 0 0-1 2l-2 3c-1 1-3 2-8 2-3 0-4-1-5-3v3l-3 3h-3l-1-1-3-2-2-1-4-1c-2-1-2-2-1-2v-1l-2-1a89 89 0 0 0-1 0l-1 1h-5l1 2-2 2h-1l-2-2-1-1-2-1h-1l-2 1v1h-2v-1l-1 1v1h-1l-3 1v5c-1 2-2 1-4 1s-2-1-3-2h-1l-1-1-2-1-1-2-3-1-1 1h1v6l-2 1h-1v-5l-2-2-1-1-3-3-3-2-1-1-4-1h-7v-1c0-2-2-3-3-3h-2c-1 1-2 1-2 3v1l-1 1h-1l-2-1-1 1-1-1 1-1-1-2h-6v1l1 1h-1l-2 1c-1 3-2 6-8 7h-3v6l-4 3-5 2a74 74 0 0 0 5 9l-5 5-10-12-3 4-2 5-3 3v1l1 3-1 3h1v1l2 2-6 11 6 2 3 1v7l2 2v-2h5l5 3 2 3 3 4 1 1 2 4v1l-2 1h-1v2l4 2 1 1 2 2 6-4c2-2 9-2 11-1s5-2 8-3c4-1 6 7 7 12 1 4-1 9-5 9-3 0-9 2-12 5-2 2 3 8-1 8s-7 3-5 4c2 0 5 5 7 7l4 8c1 2 8 3 13 4 4 1 2 6 0 13v5l4-4c5-5 5-5 12-7Zm309 145-3 3c-2 1-2 1-2 3v5l-1 2-2 3 3 2 2-1h1l7 4v1l1 2 1 1a42 42 0 0 1 10 4h3l1 1-1 1 2 1h1l3 1 1-1a163 163 0 0 0 6 1l1-1 3 1h1l3 2v3h1l1 1 4 1h4l2-1v1l1 2c1 1 1 0 2-1h2l4 2h3a23 23 0 0 1 1 0l1-1h1l-1 1 2 2c1 1 1 0 2-1l2-1h3l1-1 1-1v-1h1v-1l-1-2v-10h-2l-6 1-7-3-1-1-1 1-1 2h-2v-2l-2 1-2-2-2-3h-2l-1 1-2-1v-1l-2-2h-3l-3-2-1-1c-2-1-2-2-2-3l1-1h-5l-3 1c-2 0-2-2-3-4l-1-2-3-2-3-1-3-1-1-1-1-1v-1l1-1-1-1-1-1h-6l-1 1v1l-1 1-1 1h-1l-1-1-1 1h-1ZM271 416l1 1v1l1 2 2 2 1 2-1 1-2-1-4-1-6-2-1-1-1-1-1 2v2l1 1v1l1 1 2 1v5l2 2 1 1 2 1 1 2h-1l-1 1-2 1v1l2 1 2 2h2l1 1h1v2l1 1v2l-1 2 5-3 3-2 4-3h3l2 1v1l2 1v1l-1 2v2l-1 1v2c1 1 2 3 5 4 2 2 3 1 4 1h1v-1c-2-3 0-8 0-11s3 3 3 3l1-6 1-9c1-2 6-3 8-4 1-1-4-4-7-5-3-2-8-9-11-15l-2 3-2 2-1 2c-1 2-2 4-4 4h-2l-2-2-6-6h-3l-1-1-2 2Z"></path><path d="m361 458 5 2c2 1 3 1 6-2 3-2 4-4 4-6 1-2 1-3 3-3l3-1h8c1 0 4-4 6-3h6l4 4 4 2 3 1 3 2 3 2 2-1c1 0 3-1 5 1l2 2 1 3 6 3 5 2h7v18l1 2 4-1 1 1 1-1 1-2h6c2 0 5-1 5-5l1-4 1-3c1-3 2-3 3-3h2l1-2c1-1 1-2 3-2l6 1 4 1-1-3v-2l1-1-2-2-3-1-3-2h-3l-34-21-5-11-2-3-1-2-2-1h-4v1h-1l-2-1h-2l-2 1h-2c-2 0-4-2-5-3l-1-1 2-2 2-2 1-2h-4l-1-2v-1c0-2-2-3-3-3h-6l-3-3a72 72 0 0 0-2-3l-1 1-3 2 1 3v1l-2-1-2-1-1 2v1l-1 1h-1l-3 1-1 1-2 1-1 1v3l1 1v1l-1 3-10 2h-6s-2-7-8-10l-3-4c-1-1-1-1-6 1h-3c-6 3-7 3-11 7l-4 5 5 4c3 4 1 4-1 7-1 4 3 10 5 10 1 0 2-3 5-1 3 1 1 3 0 6-1 2 1 3 4 5 2 3 3 5 2 10v1l3-1 7-1Zm382 177-2-3-2-3-1-3-1-2v-1l2-2 1-1-1-1-2-4h-1 1v-2l-1-2 1-1h4l-5-5v1l-2 1v-8l2-3v-4l5 3 1 1c1-1 1 0 1 1l2 2 2 2 2-2 1-1 1 1v3l1 3 1 2 3 3 3 1 3-1h4v1l2-1h1l2-1h6l-1 3v1l-2 1-1 1v1l-2 1h-2v4l1 3v3l1-2h1v1l2 2v1-3l1-1v-2l2-3 1-1 1 1c1 0 2 2 2 6l1 3 1 3v1l1 2v2h2v-12h1s1 2 3 2v-1l2 1 2 1 6-14-2-1s0-3 2-4l1-1 1-1 2-9v-1l8-6c3-2 6-3 8-2l2 1 1 1-1-2-1-1 1-1 2-3-3-1-2-1-2-1-4-2-3-1-2 1a261 261 0 0 1-12 9l-2 1-2 1-1 1-1 1-2 1h-9l-4 1h-1l-5 1h-6l-6-2-2 1h-1l-3 1h-4l-2-1-6-3a144 144 0 0 1 1-3v-3l-2-1-2-1-3 2 1 3v4a34 34 0 0 0-1 1v1h-5l-1 2-2 1h-1l-2-3v-1 1l-1 1h-2l-2-1-4-1-1-1-3 2-1-3-2 1h-4l-4-2h-1l-1-1v-3l-3-2h-1l-3-1-1 1h-3l-3-1-1 1h-3l-1-1-2-1v-1h-2l-1-1c-1 1-1 0-2-1l-8-3h-1l-2-3v-1l-7-4-2 2a28 28 0 0 0-4-3l1-1 2-2v-2l1-5c-1-2-1-2 1-3l3-3 1-1h1l-2-3-1-2-1 1-2 1h-1l-2-4-1-1c0-2-1-2-2-2l-2-1h-3l-2 1c-2 0-2-2-3-3v-5l-1-3-1-1v-1l-3-4v-5c-1 1-2 2-3 1-2 0-2-1-2-3v-2l-2 1-2 1-2-1-2-1h-1l-6-2-2 1-1 1c-2 0-3 1-4 3v4c-1 2-4 3-5 3l-4 3-3 1-2 1v1l1 1v7l-3 4-2 3a37 37 0 0 1-3 3l-4 4c-2 1-3 4-4 7l-2 5-4 5-2 3-1 1-6 4-4 1-4 1c-2 1-3 1-3-1l-1-1-7 3c-6 4-3 12-3 12l1 1 5-1h1l-2 9 3 2h3v4l4 9v4h-10l-3 1-2 1-3-1-2-1h-3v2l-2 2a9 9 0 0 0-4 2v1c0 1-3 3-1 6s8 4 13 3c6-1 5 1 2 3-3 1-10 1-5 10s16 11 17 11l9-2c3-1 3-5 4-7s0-4-1-7c-2-3 1-3 2-3h4c1 1-1 1-2 2v5l3 2c-1 1-2 1-2 3 0 3 2 4 2 10s-1 7 1 10l3 13c0 5 3 10 5 14 1 4 0 8 3 13s9 13 11 21 5 15 9 18c5 4 11 20 12 24s1 12 9 19c7 7 10-2 10-4s2-3 6-4c5-1 3-3 4-7 1-3 4-4 7-6s1-6 0-11l1-9c2-3 4-9 4-13s-3-5-4-12c-2-8 2-10 8-17 7-7 11-5 13-7l3-8c1-2 5-3 7-5l8-8c3-1 2-3 4-6l5-7c2-3 5 0 11-5 7-5 5-8 5-11s2-5 4-6l8-4c3 0 5 1 5 2l7 1 6-3 3-4v-1l-2-5Zm-437-91h-3v-5c0-3 1-3-1-9-2-5-5-6-8-8h-2l-3-1-3-2-1-2 2-1a71 71 0 0 1-7-9l-1-1h1v-3l-1-1v-1l1-1h1l1-1v-2l2-3h1l1-1 1-1-1-2v-3l1-2-5-1-3-2-1-1v-3l-2-1-2-2v-3l-1-3v-2l-1-1-2 1-2 1-1-1-3-1h-9l-3-1v1l-4 2c0 1-4 5-8 7l-3 1v2l1 1v10c0 6-2 11-3 12l-23 14c0 2 3 10 5 12l2 2 2 2v4h2c4 0 15 5 25 11s29 23 31 25h17l10 2 2 4h5v-2l-4-4-2-5v-7l1-4c1-1 2 1 3 2h2l-7-8v-5ZM72 427v-1l1-1 1-1v-3h-1v-1h-2l-1 1 1 1v2l-1 1-2-1h-1v1h-3l-2 1-3-2h-1v1l1 1-1-1-2-1-1-1v-1h-4v2l-1-1h-1l-1 1h-4l-1 1h-4l-1 2h-6l-5 4-2-1-3 1v4l-2 1v1l-1 3h-2l-1 1v2s1 0 0 0v1a3 3 0 0 1-1 0v1h-5l2 5c2 2 6 1 9 4 2 3 1 5 3 6 3 1 4 2 5 5 0 4-2 3-2 5 1 3 5 4 6 8s6 7 7 9c2 2 3-1 3-4 1-3 3 2 5 2 3-1 1-3 0-4s-2-2-1-4c2-1 5-2 2-3-2-1-2-2-2-4 1-2 5 1 8 2 3 2 0-2 0-4-1-2 1-3 1-2 1 2 4 5 6 4 3 0 1-3-1-4s-4-2-4-7c-1-4-4-3-7-3-2 0-3 2-4-3 0-4-4-7-5-10-2-3 0-5 4-4 5 1 2 4 5 4 2 0 0-3 1-3 0 0 2 3 4 2 2-2-2-4-2-4h4c0-2-4-3-3-5l3-3c1-1 4 2 5 0 1-1 4 0 8 1l2-2v-2Z"></path><path d="M179 487h1c3-1 5-1 6-3v-2l1-2 2-1v-5l1-3h1l1 1c1 1 1 2 3 2l6-2 1-1c2-1 4-2 5 0l1 2 1 1 5-1 7-2 9-3 4-1 6 1 5-2 1-1h1v2l1 1 4-3v-1l1 1h2l4 1h5l-5-4-2-3-1-2-1-3-1-1v-3h1l2-1-1-2v-2l-1-2-2-3-3-1h-2c-1-1-3-1-3-3l-1-2v-8h-1c0-2-1-3-2-3l-1-2-1-1h-1l-3-1h-1l-4 1h-6l-1 1c-1 5-7 5-12 6-6 1-13-1-23-2-10-2-11-4-14-6-2-2-5-2-10-4s-8-1-21-1c-12 1-12 4-15 7s-6 5-9 5c-4 1-5-1-10-1l-10-2c-4-1-5-4-6-7h-6v2l-1-1-1-1v1h-1c-1 1-1 0-1-1l-1-1h-3l-3 1h-1v2h-2v2l2 1v4h-2l-1 1v3l-1 2 3 1c6 1 5 4 3 8s1 8 4 8c3 1 4 9 1 11-2 1-3 5-2 6s4 1 5 3c2 2 2 10 5 11 4 2 12 2 15 7 2 4 13 6 17 2s3-8 6-7c4 0 8 2 11 5 4 4 10 3 15 2s5-2 6-5c2-3 4-3 6-3 2 1 3 3 8 1 5-1 2 2 1 3v3h4Z"></path><path d="m452 610 1-6-1-2 1-3h1l2-2 6-4h2c1 0 0 0 0 0v1h2l2-6v-1l-3-2-3-1v-11h-9c-3-1-3-3-4-5l-1-4-2-2-1-2c-2-1-3-2-3-4 0-3 2-6 3-8l1-2c1-2 2-5 5-7l2-3-1-1c-1 0-6 2-9 0s-3-3-2-7v-9l-1-7 2-3h-3l1-9h2l1-3c-1 0-2-2-1-4l5-4v-1c1-2-1-4-1-4v-17l-6-1-5-1s-4-1-6-4l-1-3-2-2h-7l-3-1-4-3h-2l-5-3-3-4h-6c-2 0-5 3-6 4l-4-1-4 1h-3c-1 0-2 1-2 3l-4 7c-3 3-5 2-7 1l-5-1h-7l-3 1c1 5 5 11 5 11 2 6-2 5-5 5l-17 2c-4 0-12-4-16-7-5-4-7-2-13-4-5-2-3-4-4-7h-1l-2 1-2-1-6-5v-2h1v-2l1-2 1-1-1-1-1-1-2-1h-3l-4 3-3 2-8 4v1l-4-2-3-1-3-1-3-3-1-1v3h-3l1 2v2l1 3 1 2 2 3 5 4c3-1 3 0 3 1l1 1 2-1 3-1v1l1 2v6l2 1c1 0 2 0 2 2v3l1 1 3 1 5 2h1l-1 1-1 1 1 3 1 3-2 1h-1v1l-2 2v2l-2 2h-1v6l1 1 7 8-2 2 1 1 3 1a64 64 0 0 1 4 2c3 1 6 2 8 7 2 7 2 7 1 10l1 5h2v5l7 8 2-1c2-1 4 0 8 1 3 0 3 0 5 3 1 2 3 8 7 12 3 5 2 8 4 9l12 2c5 2 3 4 5 6l8 4 8 1c5 1 4 3 9-1s12-5 15-3c4 3 5 11 6 14s8 3 10 2h5c1 2 7 2 12 3 5 0 12 6 18 4l5-2v-1ZM-84 180v1l1 3h1l2-5v-9l3-2v-1c3-2 4-3 3-7l-4-8h1s3 0 3-2c1-2 1-5-3-8h-1v-21c0-1-4-11 4-17 5-3 6-2 7-1h2c2-2 2-5 2-6v-2l-2-1h-1l-1-1 2-3 2-4 1-3 2-18s6 0 7-3v-2l2-5 5-8v-4l-1-2-1-2 1-1 1-1a54 54 0 0 0 5-9c1-2 3-1 3-1l3 2v-2c1-5 1-9 3-9 1-1 5 1 10 2l3 1 2-2-1-1v-2l1-3V7l2-1 2 2 1-2 1-1c1-2 2-3 5-2 2 1 3 3 3 6l1 4c2 3 3 3 4 3l3-1 3-2c2-1 3-2 4-1 2 0 3 2 4 3l2 1 2-3 1-1 1-1 2-3 2-10 2-5 2-4 2-2 4 1c3 0 3-2 4-2l1-1 4 5v1l2 1 3 4c2 3 2 3 0 4l-1 2c-2 2-2 3-1 3l1 2v1l1-1 1-2 1-1 3-4c2 0 2-2 2-3l1-2c2 1 4 3 5 2v-2c-1-2 0-3 1-5l1-2h-5c-2 2-4 1-5 1-1-1 2-3-1-4l-5-3h8c2 0 4-3 5-4 2-1 5-1 5-3 1-2-2-2-4-3-2 0-6-1-10-4-5-2-6-3-8 0s-4 4-5 3c-2-1-7-3-8-1s-3 5-6 3-7-2-10-1-10 3-12 5c-2 3-6 5-13 3-6-2-5 3-2 5 3 3 1 5-3 4-4 0-3 0-5 4s-5 5-7 4c-1-1-3-4-4-3-2 1-1 4-1 4h-3l-1 4-3-1c-1 1 1 3-1 4-1 1-3 1-3 3l-2 4c-1 1-3 1-4 4 0 3 0 6-2 7l-10 4c-4 2-5 5-4 7v9c0 3-3 4-5 4s-1 3-2 5c0 2-2 3-3 5v4l-3-1c-2 1-1 3 0 4s3 1 2 4-3 2-3 6-2 7-3 8l-4 6c-2 2-1 4-2 5s-2-2-4-1l-3 5-5 10-7 6c-3 2-5 7-7 10l-7 4c-2 1-4-2-5-1-1 2 1 3-4 6-4 3-5 8-6 14-1 7-3 5-4 7-1 3 2 7 3 6s3-1 3 1v5c0 1 3 1 4 8s-1 11-2 12-4 1-4 4 2 4 6 6c3 1 3 5 9 7 7 2 10-3 12-3 2-1 7-5 13-13l9-5 2-1Zm931 579v-1l2-2h1v-1l-1-1-1-1-1-4-1-1v-1l-2-4v-1l1-5c1-2-2-4-6-7-3-2-4-7-3-9v-1c2-1 2-2 2-5v-3l2-2 1-1-1-1-2-1v-5l-2-2-2-2-3-4-1-3-4-6v-2l1 1h3l1-1-1-1v-1c2-1 1-1 1-2v-2l1-2v-1l2-2h8v-2c0-2 1-2 3-2h3l-1-1v-1h1l2-1h4v-1s0-2 2-3l1-1 2-1 1-1 1-3 3-2h1l1-1h-2l-3 1-3 2c-3 0-4-1-6-4l-2-4-4-2-1 1h-1l3-10h-6v-5l-1-3 1-3h-4l-2 1-3 1-4 1v-1h-1l1-1 2-3v-1h-1l-2-1h-1l1-2v-1l1-1 2-2 1-4h2v-1l2-2h2l1-2 1-2-1-1 1-2v-1l1-5-1-3-1-6h-1l-2 1h-1v-2l1-2c0-3-1-4-2-4l-3-3-4 3v4l-2 2-2 2v1l1 1v2h-2l-2-1c-1-1-4 0-6 1l-9 7-1 9-2 2h-1l-2 4 2 1-6 14-2-1h-2l-3-1v9l-1 2h-1l1 4v7h-1l-1-1-1-1-1 1-1 1-1 1v4l-1 1-1 1v7l2 5h2l5 9 6 13 1 7c0 1-2 3-2 10-1 6 2 5 6 6 4 0 10-1 16-8 6-6 7-3 8-2 1 2 4 4 5 8 0 3 2 4 2 9 0 4 4 7 4 10s0 6 3 8 2 3 4 8l1 9c1 5 1 9-1 11v3l3-4 4-5Z"></path><path d="M9 55v-9c-2-2-1-3 0-4v-2c-2-2-3-3-2-6v-6l-1-2-2-2c0-3-8-6-10-7-3-1-5-4-6-7l-2-2-1-1h-1l-1 2v4l-1 3v1l1 1v1l-2 2-4-1-9-2-2 9-1 3-4-3-1 1-2 3-3 6-2 2v2l1 1v5c0 3-3 6-4 8h-1l-1 5-1 2c-1 3-5 3-7 3l-2 18v3l-3 5-1 2v1h1l2 1 1 2-3 6h-2c-1-1-2-2-7 2-8 5-3 15-3 15v21c5 4 4 7 4 9-1 2-3 2-4 2l3 8c2 4 0 5-2 8a54 54 0 0 0-3 3l-1 3v5l-2 5h-1l1 1c2 3 0 6 1 10s2 9 5 12 5 12 8 13c2 2 3 3 2 4-1 2-3 3-1 4s2 4 3 8c1 5 7 3 11 0 3-4 7-7 14-8 6 0 4-6 4-9l2-16 1-9c0-3 1-7 9-10 7-3 6-11 6-16s-9-9-13-12c-4-4-3-8-3-11l2-7v-10c1-6 4-6 5-7l3-2c0-1-1-5 3-5 3-1 3-3 4-4l5-1c2-1 5-3 6-8 1-6 3-6 4-7v-5l-2-4c-1-2 0-4 1-6l2-6 4-6 5-1a56 56 0 0 1 0-11Zm525 343-1 1-3 1v2l-1 1h-1l-2 1-1 1-2 2c0 2 1 3 2 3l3-2 1 1v1c-1 1-1 2 1 2h4l5-4v-1h1v1l1 2v1h2l1 1v1h2l3 2h4v3l-2 1-2 1-2 1-2 1h-2l-2 1v2l-2 1-1-1-2-1h-3l1 2v1l1 2-1 1-2-2-1-1-1 1a4 4 0 0 1-2 1l-2-1-1-1-2-1-4 1h-3v1l-1 1v2l1 3 1 1h9l2-1 3 1 4-1h4l3 1v1l1 1h1l1 1h2c0-1 0-2 2-2l7-1h1l3-1h3l1-1-1-3v-2l1-2 2-1 4-2 1-1 2-2 2-1c2 1 3 1 4-1l1-1v-1l1 1 1 4 5-1c2 0 3-2 4-4l2-3c3-3 5-4 7-3h5l4-5 4-2 7-4 4-3 2-1h3v-2l-1-3-5-1-1-1c-4-1-5-3-5-3s-1-2-5-2h-11l-20 1-5 1-7-2-2-1-2-2-1-1-3 2-3 2-2 3 1 3v3l-2 1-3-2c-2-1-5-3-9-3h-3c-4 0-6 0-7 2l-3 5 4 3Zm-536 9v-3l1-1 1-1v-2l1-1 1-1 1 1v1-2H2v-2h3l1-1h1v1a326 326 0 0 0-1-5l-1-1h2l1 1v-1l-4-3v-4l1-1 1-2v-2l-1 1H1v-1l-1-1-1-1h-6l-1 1-1-1h-2l-2-1h-2l-2-1h-1v1l-2-1-2 3h-1l-2-3h-2a4 4 0 0 1-1 2v1l1 1v1h-1l1 1 1 1 1 1v2h1v1h1v3a108 108 0 0 0 10 10v1l2 2 1 1 1 1v1h-1l-3 1h1l3-1 2 1 2 2 1 1 2 2 1 1v-4h-1Z"></path><path d="m6 416 1-1H6v-1l-1-1 5-6v1l1 2 1-1h1v-1l-1-1v-1h4v-1h-1v-1h-1l-1-1-2-1-2-1-2-2-1-1-1-1H3v-1H2l1 1v1l1 1-1 1H2v-1l-1 1H0v3h-1l-1 1v2l1 1v4l5 5 2 3v-3Zm341 270-24 3c-5 0-19 2-20 7 0 5-3 8-4 9l-3-1-4-2c-2-1-5 0-8 1a52 52 0 0 1-8 2h-4l-4 1h-3l-1-2-1-1-2 5c1 4-1 8-1 11s3 2 4 4v8c0 2 4 3 3 6 0 4 0 3 2 6s-1 5 8 5c9 1 9-4 13-8 3-3 3-1 8 1 4 2 9-1 11-3 3-1 2-4 5-4 4 0 8 0 10-3 3-3 6-3 10-5l15-4c5-2 6-2 9-8s8-7 11-8l-9-26-13 6Z"></path><path d="M13 445a12 12 0 0 1 2 0v-1l1-1-1-1v-1l1-1h2l1-3 1-1 2-1v-2l-1-2v-1h-1l-1-1v-1h-1l-1-1v-8l1-2-1-2v-2h-2l-1-2v-1l-1-1-1 1h-1l-1-2-4 5v1h1v3l-1 2 1 5c0 3 0 13 2 16 1 3 3 4 2 5h-1 3Zm377 171-1 1 1 2 1 4-2 3-3 2-2 1v3l-2 12 1 8-6 21-16 7 8 26c3 0 5-1 8-3s5-1 9-1c3 0 2-3 2-5 1-3 3-4 5-4 3 0 5-1 9-4 3-2 2-6 4-8s5 0 9 0c5-1-1-6-2-9-2-3 0-3 2-7 1-3 2-4 3-2 2 2 2 1 3-1l4-7c4-4 4-5 6-11s-1-4-3-5l-5-7c-2-2-2-5-4-5h-11c-6-1-7-5-9-7l-3-5-1-4-3 1-2 4Z"></path><path d="m381 644 3-12v-3l2-2 3-2 1-2-1-3v-4l2-4h1l3-1-2-4c-2-6-8-2-9 0l-3 5c-2 1-4 1-4 3 0 1-1 5-3 6-1 2-4 1-7 2l-8-1c-2-1-5 1-6 2h-3l8 18 23 2ZM47 286l-1-1 1-1-1-1v-1h2l2 1 1-1 2-2v-1h4l4-1 1-1 3 1h4l1 1h1l3 1 1-1 3 2 2-1 1 3h3s0-1 0 0h1v1h1v-2 1h2l2-1 1 1 1 1 1-1 1 1 1 1 1-1 3-2 2 4 1-1 2-1 1 1h1l2-1 2 2 1 1v1l1-1v-3l-1-2 1-1h1l1-3c-2 0-5-5-6-7l-3-2-3-3v-5l2-3-1-1-3-2h-1l-2-2-2-1h-2l-3-3-2-2-1-3v-2l-4-2 1-1 1-2v-1l-1-2 1-1v-3l-3-2-1-1-5 1h-2v-2l-1-1h-4v-1h-2l-1-1-1-1-2 3-1 1-2 1h-4l-2 1v2l-1 1v2l3 2-2 1h-3l-1 1-1 2-1 1s-1 0 0 0l-1 2v1l-1 2v1l1 1 1 1h-2l-1-1h-1l-1 1-1 1h-2l-2 2-2 1-3-1h-1v1l3 10 3 3c1 1 3 3 3 5l2 3 2 3-1 3-2 3v2l5 4v-2Zm-96 83h2v-2h-1v-3h-1v-1l1-1v-1h-2v-2l1-1h1v-1l-8-2-3-1-2-1v-1l-1-1v-2l-3 1h-6v1h-1v1l-2 1h-1l-1-1h-2v1l-1 1h1v3l-1-1-1-1h-1v4l1 1h-1v1h-1v-1l-1-1h-2l-1 1-1-2-1-2v2l-1 2-1 2-2 1 1 1v2h-2v-2h-1l1-1h-1l-1-1-2-1v-3l-3 2v2l-1 1-1 1v1h-2l-2-1-2 1-1 1-1-1-1 1h-1v2h1l1 1c-1 1-1 1 1 2v1c1 1 0 2-1 2l-2 1-1 1v1l1 1v1l2 2v1h-1l-1 2h1v1l1 2 3 1v1l2-1h1v3l-1 1-1 2 4-2c1-2 3-3 10-3 8 0 9 6 12 13 4 7 8 8 10 11s7 10 13 11c6 0 14 9 15 10 2 1 4-1 6 2l5 6c2 1 4 1 5 4l3 8c1 3 0 4-2 9-3 5-1 6 1 7 1 1 8-1 8-4l3-11c2-4 0-5-2-7-2-3-1-2 0-8 0-6 5-2 6-1l6 6c2 1 3-2 3-4s-1-6-3-7l-7-3-9-6c-3 0-6 0-6-2v-5c-2 0-7 0-11-2-4-1-5-4-7-6-2-3-3-7-6-10l-9-8c-3-2-4-7-5-10s1-8 6-11c2-2 4-1 5-1h1l2-1Zm268 161-3-3-5-11a1190 1190 0 0 1-20 11h-2l-2-1-4-2-4-1v-1c-1 20-5 36-7 39l1 4 1-1v2l15 3 5-5 1-2c2-2 3-2 5-2h3c2 0 3-3 4-5l1-1-6-7-4-5h1s14-3 19-6l3-1v-4l-2-1Z"></path><path d="M247 467v-1h-1l-1 1-5 1h-10l-9 3a257 257 0 0 0-13 3v-1l-1-2c-1-1-2-1-5 1h-1l-6 2-4-1-1-1v-1 3l-1 2v3l-2 1v2l-1 2c0 3-2 3-6 3h-4v10l1 2h7c2 0 3 1 4 3v4l-1 2-1 1-1 1-2 1-2 4-1 1-1 1v5l4 2 4 2h7a1235 1235 0 0 0 40-25c2-1 4-7 4-12a358 358 0 0 1 0-10l-1-1-1-2 3-2c5-1 8-5 9-6l-1-1Zm84 121 1 6v3c0 2-2 0 0 2 1 2 0 3 1 2 1 0 1 1 2-1v-2l1-3 1-1v-5l-2-1-2-1-1 1h-1ZM79 671h-9v45H60s-2 2-1 4-1 4-3 6l-1 1-1 5c1 1-1 2-2 3l-1 1v3c1 2 2 3-1 5l-3 4 1 1 3-1h2l1 3v3l1 2c1 2 1 4 3 5v5l2 2 2 2 4 6 1 3c3 1 7 0 10-1l2-2 2-3c2-2 4-2 6-2l3 3 2 3c0 2 1 4 5 4h14c3 2 5 2 8 0l5-2h1v-2l1-3h1c0-1 1-2 3 0l8 4 6 1 11-14-1-5-1-2-1-1v-1l5-1v-2h6l-1 5v3c0 4 0 7 2 9l3 2c2 2 4 4 4 6v2l1-1 1-4 1-2 1-5v-1h1l1-1 1 1c1 0 1 1 2-1 2-1 1-6 0-8 0-2 7-9 7-10h5l4-16-1-3c-1-1 1-10 2-13l2-2 1-3v-8h4l1-2c0-2 1-2 3-2 2-1 4-1 5-3l2-3 3-3c-3-3-14-5-15-13l-1-12-2-8-1-8H79v22Zm119-24c-1-2-6-7-9-8s-7-6-6-9c0-4-1-8-3-11-3-2-14-15-14-23-1-8-5-9-5-12l-4-6-7-8-3-7c1-1 1-1 4 3l8 11 6 5c2 0 4 2 5-5l2-10 1-2-7-28-3 5-8 2-8 1c-3-1-5 0-7-2s-7-3-11-2-3-1-8 2c-5 4-9 5-21 1-11-3-15-2-19-3h-2v3l-1 8v2c-1 3-2 7 2 14v81h119l-1-2Z"></path><path d="M259 751c2 0 3-2 4-4v-1l-10-14-13-9c-3-2-12-7-14-12-2-4-2-7-2-10-1-3-3-8-6-11l-2 4-3 2c-1 2-3 3-5 3l-3 2v2h-5v8l-1 3-2 3c-1 2-2 11-1 12l1 3h4l3-2 1 1 2 1 2-6 1-1 5 5v1l4-2 2-1h2l1 1v-1h3l5 1 7 4 3 2 4 5 10 11h3ZM-21 639v1l2 9 1 9 1 3 4 4 1 2-1 3-1 3v16l-1 8-1 7-6 7-9 11c-1 4-3 5-5 6l-1 2 1 3 1 4 1 2 4 5 3-1 3 4 2 5 2 8c0 7 1 11 3 13l4 4h1l-17-1-2 4 1 1 2 2c3 2 8 5 10 10l1 8c4 0 7-1 9-3h2l2 2 1 1 1-1c1-1 3-3 9-3 8 0 12-2 12-5l-1-3v-2l4-1c6-1 10-2 17-7 6-5 8-6 8-8v-4l6-1h5c0-1 1-2-1-4l-2-6-1-2v-3l-1-3h-2c-1 1-2 2-3 1h-1c-1-2 2-4 3-5 2-2 2-3 1-5v-1h-1l1-3h1l2-3c-1-1 0-4 1-6l1-1c1-1 3-3 2-5l2-4h9v-39l-81-43-9 5Z"></path><path d="m-56 531-5 4-5 3c-2 2-4 5-4 8 1 4-2 9-4 10l-1 1c-2 0-3 0-3 2l3 6 1 1v9h1l1 1-1 10v1l-1 1v12l-4 4 2 2 5 7 1 3c0 4 1 6 3 6l4 2a11 11 0 0 0 5 1c2 1 4 1 5 3v3l1 2h3c3 0 8 1 12 4l3 2c3 3 4 4 9 1l13-7h1l80 43v-6h10v-21h1l-1-81c-4-7-3-11-2-14l1-2v-8l1-3-8-4c-1-3-14-1-17-4-2-3 0-4-4-5s-24-4-26 2c-3 7-5 10-3 13 1 4 2 11-4 13-5 2-13 0-18-7-6-7-20-3-21-5s1-7-4-11c-5-3-17-6-21-6h-9v4Z"></path></g><path d="M96 394v1l-2 2c-2 3-5 2-5 7 0 6 0 5 2 10l1 2c2 3 3 6 7 7l10 2c5 0 6 2 10 1 3 0 6-2 9-5s3-6 15-7c13-1 16-1 20 1 5 2 9 1 11 4 2 2 4 4 14 5 10 2 17 3 23 2 5-1 11 0 12-5l1-1v-1c2-4 3-7-2-13-6-7-9-8-15-12h-1c-6-4-5-7-12-9s-9-2-13-5-5-2-6-5-4-6 0-6c5-1 6-4 6-5v-5c0-1-5-1-2-4 4-3 8-5 7-6l-1-2h-1l-4-1c-3 0-3 1-8 4-4 3-8 6-15 5-2-1-1 5-3 5v3c2 2 2 5 5 6h7c3-1 5 0 5 1s4 3 0 4h-9l-4 4-6 1c-1 1 0 5-5 4-5 0-11-1-9-4 1-3-4-6-5-6-2 0-3-2 0-4 2-2 5-1 5-4 0-2-5-4-9-4-3 0-1 0-6-3-5-2-4-4-8 0-3 4-4 9-6 10s-4 0-4 2 2 3 0 6l-1 1-6 3c-1 1 2 2 0 6l-2 8Zm210 42-1 8-1 6s-3-5-3-2c-1 3-2 7-1 11l1 1c1 3-1 5 4 7 6 2 8 0 13 4 4 3 12 7 16 7l17-2c3 0 7 1 5-5 0 0-5-6-5-11v-1c1-5 0-7-3-10-2-2-4-3-3-5 1-3 3-5 0-6-3-2-4 0-5 0-2 0-6-6-5-9 2-3 4-3 1-7l-5-4-1-1v-5c2-7 4-12 0-13-5-1-12-2-13-4l-4-8-7-7c-2-1 1-4 5-4s-1-6 1-8c3-3 9-5 12-5 4 0 6-5 5-10-1-4-3-12-7-11-3 1-6 4-8 3s-9-1-11 1l-6 4-7 6-10 6c-3 2-9 5-7 11 1 7 6 11 7 14 0 3-1 8 3 13 4 4 9 5 12 11l1 1c3 6 8 13 11 14 3 2 8 5 6 6-1 1-6 2-7 4Zm499 274c-2 2-5 2-7 2-4-1-7 0-7-6 1-7 3-9 3-10l-1-7-6-13c-1-2-4-8-6-9l-2-1c-3 0-7-1-10-4-4-5-7-9-7-13l-2-9c-1-3-3-7-4-6-2 2-3 1-4 0-2-2-5-4-5-1 0 2 1 4-1 5l-1 2v1l-3 4c-1 1-4 3-6 2h-7c-1-1-2-3-5-2l-8 4c-2 1-4 3-4 6s2 6-5 11c-6 4-9 2-11 5l-5 7c-2 3-1 5-4 6l-8 8c-3 2-6 2-7 5l-4 7c-1 2-6 1-12 8l-4 4h153v-6ZM261-1c0 1 0 3 3 3l3-3h-6Zm-46 0-2 1c-2 1-3 0-3-1h-95l15 9c13 9 18 11 21 12l6 6c1 2 7 10-1 18-7 9-12 12-21 11l-15-2c-4-1-5-1-7-3-3-2-4-1-7-1s-3-2-4-3c-1-2-5-3-5 0 0 2-1 5 2 7 2 1 12 3 11 10s1 11 2 12c2 2 0 7 2 10 2 2 7 2 12 6 4 4 14 7 15 1 2-6-2-5-6-6s-5-2-7-4-3-4-2-5c2-2 1-4 2-6h5l6 4c3 1 6 0 9 3 2 2 1 5 4 5s10-4 5-11-5-10 0-15c5-6 8-13 12-13l12 2c3 1 8 2 7-5s0-8-4-10c-4-3-4-4-4-11s0-13-4-14c-4-2-7-6-1-4h12c5-1 6 0 7 3s2 2 4 5c2 2 6 4 3 6l-6 2c-1 0-2 0-3 2 0 2-2 2-1 4l5 6c2 3 5 4 7 4 3 0 7 1 9-2l2-11c-1-2 0-4 5-3 4 0 3-2 1-4-1-2 1-2 2-1 1 2 2-1 4-3l6-7c1-1 2-3 5-4h-22Zm-38 501v-1l-1-2v-8l-1-2v-3c0-1 4-4-1-3-5 2-6 0-8-1-2 0-4 0-6 3-1 3-1 4-6 5s-11 2-15-2c-3-3-7-5-11-6-3 0-2 4-6 8s-15 2-17-2c-3-5-11-6-15-7-3-1-3-9-5-11-1-2-4-2-5-3s-1-5 2-6c3-2 2-10-1-11s-6-4-4-8 2-7-3-8l-3-1h-1c-4-1-7-2-8-1-1 2-4-1-5 0l-4 3c0 2 4 3 4 4 1 2-3 1-4 1 0 0 4 2 2 3-3 2-4-1-5-1 0 0 2 3-1 3-2 0 0-3-4-4s-6 1-4 4c1 3 5 6 5 10 1 5 2 3 4 3 3 0 6-1 7 3 0 5 2 5 4 7 1 1 4 4 1 4s-5-2-6-4c-1-1-2 0-1 2 0 2 3 5 0 4s-8-4-8-2c-1 2 0 3 2 4 3 1 0 2-2 3-1 1 0 3 1 4s2 3 0 4c-2 0-5-6-5-2 0 3-1 6-3 4s-6-5-7-9-5-5-6-8c0-2 2-1 1-5 0-3-1-4-4-5-2-1-1-3-3-6-3-3-7-2-9-5l-2-4 1-1c1-1-1-1-2-4-2-3-2-13-2-16l-1-5v-1l-2-2-5-5v25l1 5-1 4v104c5 7 13 9 18 7 5-3 5-10 3-13-1-3 1-6 3-13 3-6 23-4 27-3 3 2 2 3 4 6s16 1 17 3 4 4 7 5h3c4 1 8 0 19 3 11 4 16 3 21-1 5-3 4-2 8-2 4-1 9 0 11 2s3 1 7 1h8c4 0 7-3 8-3v1l3-5 2-4c1-4 0-7 2-9l3-5v-1l1-2 4-13-1-3Zm-95 1c-1 2-4 2-8 2l-6 3c-2 0-4-4-6-4h-7c-1 0-3-4-1-5 4-2 5-1 7 0s1-3 7-1l9 3c3 0 7 0 5 2Zm80-3c-2 1-2 4-2 5 0 2-3 1-5 1-2 1-4 3-7 3l-7-2c-2-2 0-4 3-5 3 0 3-2 7-3l2 1c2 1 3 0 6-1l5-3c1 1-1 2-2 4Z" fill="#1B253A"></path></g><defs><clipPath id="a"><path fill="#fff" d="M0 0h804v715H0z"></path></clipPath></defs></svg>`;
});
const Item = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { itemId } = $$props;
  if ($$props.itemId === void 0 && $$bindings.itemId && itemId !== void 0)
    $$bindings.itemId(itemId);
  return `${itemId === "certificate" ? `<svg viewBox="0 0 40 40" width="40" height="40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M24 29.6h-7.8a412.3 412.3 0 0 1-14-.3c-.2 0-.2-.2-.2-.3.2-1.8.5-6.1.4-8l-.1-10.5V9.2c0-.2.2-.4.4-.4 0 0 0 0 0 0h2l14.5.2c5.6 0 11-.5 16.4-.9L37 8l.3.1.2.3V18a160.1 160.1 0 0 0 .5 11l-.3.2c-2.6 0-7.6.3-7.6.3" stroke="currentColor" stroke-width=".8" stroke-linecap="round" stroke-linejoin="round"></path><path d="M24.1 26v6.5c.8-.6 2-1.4 3-1.3.8 0 1.8.7 2.7 1.3l.2-6.9m-5.7-1.2-.4-.2v-.4c0-.3.2-.7.4-1l.2-.3c0-.3.2-.5.3-.7l-.4-.3-.9-.7a.4.4 0 0 1-.2-.4c0-.2.2-.3.4-.4l2.1-.4a16 16 0 0 1 1.5-2c.2 0 .5 0 .6.3.3.4.5 1 .7 1.5a14.2 14.2 0 0 1 2 0c.3 0 .4.3.4.5s0 .3-.2.4a137.7 137.7 0 0 1-1.6 1.3 102 102 0 0 1 .5 2.2l-.4.2a6 6 0 0 1-2.6-1l-1.2.9s-.9.5-1.2.5Z" stroke="currentColor" stroke-width=".8" stroke-linecap="round" stroke-linejoin="round"></path><path d="M26.6 26.6c-1.9 0-3.5-.8-4.5-2.3A5 5 0 0 1 22 19a7.4 7.4 0 0 1 6.2-3.6c1.3 0 2.5.4 3.5 1.2 1.2 1 2 2.9 1.7 4.3a7 7 0 0 1-6.7 5.7v0Zm-22-12c0-.7-.2-2 0-2.8 0-.2.1-.3.3-.4h2.6m24.5-.7h2.5c.2 0 .3.1.3.3v.2l.2 2M8 27.4a46.4 46.4 0 0 1-2.7-.1.4.4 0 0 1-.3-.4v-.5L4.9 25m30.6-.1.3 1.6a45.1 45.1 0 0 0 0 .6l-.3.2h-2.1M10 13.8h5.6l7-.1M9.1 17.4h4a30 30 0 0 1 6 0m-8.3 7.2H14l2.6-.2M9 21s0 0 0 0h8.5m11.3 6.5v2.7" stroke="currentColor" stroke-width=".8" stroke-linecap="round" stroke-linejoin="round"></path></svg>` : `${itemId === "insurance" ? `<svg viewBox="0 0 40 40" width="40" height="40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19.7 3s7 4.5 13.6 4.2l.9 10.9S35.7 32.6 20.5 37c0 0-13-2.3-14.2-17.7L6 8.3s7-.6 13.7-5.3Z" stroke="currentColor" stroke-width=".8" stroke-linecap="round" stroke-linejoin="round"></path><path d="M19.7 3s2 15.8.8 34" stroke="currentColor" stroke-width=".8" stroke-linecap="round" stroke-linejoin="round"></path><path d="M6.4 20.6s21-.6 27.8-2.5m-13-14.2-1 2.5m2.5-1.8-2.2 6.7m4.3-5.8-4.1 10m.3 3.1 5.5-12.4m1.2.3-5.2 13.2m6.3-12.9-4 12.7m1.6-.2 4.4-12.2m1.5.1-3.7 11.9m4.9-9L30.2 19m3.6-5.4-1.5 5M19.4 20l-7.5 12.3m9-9.3-7.5 10.6m7.6-8.3-6 9.5m1.9.9 4-7.4m-.2 3.7L18 36.2m2.7-1.4-1.3 1.9M17.2 20l-6.7 10.7m-1.3-1.9 4.6-8.5m-1.9.1-4 6m-.6-1.7 2.6-4.2m-1.9 0-1.3 2" stroke="currentColor" stroke-width=".8" stroke-linecap="round" stroke-linejoin="round"></path></svg>` : `${itemId === "camera" ? `<svg viewBox="0 0 40 40" width="40" height="40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17.1 24.8c0-.9-.8-1.5-2-1.6-1.2 0-2 .7-2 1.7s.9 1.8 2 1.8c1.2 0 2-.7 2-1.9Z" stroke="currentColor" stroke-width=".8" stroke-linecap="round" stroke-linejoin="round"></path><path d="M5.4 26.7s6.3-.5 8.5-.4m-8.5 4.6 8 .3s1.5.2 2-1.4c.6-1.6.3-3.1.3-3.1m1.1-8.6 12.5 1.5s1.7.1 2.7-.8l4.5-4.7s1.2-.8 0-1.1c-1.2-.3-18.3-2.3-23.8-3.2 0 0-1.5-.5-1.8 1.5l-.5 4.5s-.2 1.5 1 1.7l2.4.4M2 23.7v10.6h2s.9 0 1.2-1.4c.4-1.3 0-8 0-8s0-1-1-1.2c-1.2-.2-2.1 0-2.1 0Zm6.4-12.1s-.6-4 4.3-4.2m-6.9 4.2S4.6 4.7 12.7 5" stroke="currentColor" stroke-width=".8" stroke-linecap="round" stroke-linejoin="round"></path><path d="M11.4 17.5s-.6 2.3.9 2.6l19.5 2.6s2.5.7 2.9-1.4l1-6.5m-21.5 8.6-.3-3m2.9 3.5v-3" stroke="currentColor" stroke-width=".8" stroke-linecap="round" stroke-linejoin="round"></path><path d="M34.2 16.5s-2.6 2.7-1 6m1-8.5-9.4-1.3m-1.8-.3-4.3-.5m-6 6.6s-.2.7 1.2.8l4.2.5" stroke="currentColor" stroke-width=".8" stroke-linecap="round" stroke-linejoin="round"></path></svg>` : `${itemId === "alarm" ? `<svg viewBox="0 0 40 40" width="40" height="40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M25.1 24s0 0 0 0l-.2-.1v-.4c.2 0 .4 0 .4.2 0 .1 0 .2-.2.2Z" fill="currentColor" stroke="currentColor" stroke-width=".8" stroke-linecap="round" stroke-linejoin="round"></path><path d="M27.3 31.8H13.2a1 1 0 0 1-1.1-1l.3-14.7s0-3 4.6-3.9c4.6-.8 8-.3 8-.3s2.2.3 2.3 2.5c0 2 .8 13.3.9 16.5 0 .5-.4.9-.9.9v0Zm-2.3-10v-5.3M5 12.2l3.5 2m5.1-9.3L15.3 8m8-1.1.2-3.9m6.7 5.4 2.3-1.7M32 17.4l2.1-.6" stroke="currentColor" stroke-width=".8" stroke-linecap="round" stroke-linejoin="round"></path><path d="M12.2 31.2s-.4 0-1 1.2l-1.4 2.5s-.6.6.4.6a96.1 96.1 0 0 0 20.7.2c.2-.1.3-.3.3-.5a9.7 9.7 0 0 0-3-4" stroke="currentColor" stroke-width=".8" stroke-linecap="round" stroke-linejoin="round"></path><path d="M27.3 31.8s1.2 2 1.8 4m-2.7-4s.3 2.5.9 4m-2.7-4s.6 3.7.5 4.2m-1.7-4.2v4m-1.4-4-.4 4m-1.1-4-.2 2.5" stroke="currentColor" stroke-width=".8" stroke-linecap="round" stroke-linejoin="round"></path></svg>` : `${itemId === "lock" ? `<svg viewBox="0 0 40 40" width="40" height="40" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#a)" stroke="currentColor" stroke-width=".8" stroke-linecap="round" stroke-linejoin="round"><path d="M30.3 34.8c-.1-2.9-.3-13-.5-14.7-.1-2-3.2-2.3-3.2-2.3s-4.7-.4-11.3.3c-6.5.8-6.5 3.5-6.5 3.5v13s-.4 2.2 2 2.3c2.5 0 14.6.3 16.7-.2 2.2-.6 2.8-1.3 2.8-1.9h0Z"></path><path d="M22.5 23.9a3 3 0 0 0-3.1-3.2c-1.9 0-3.1 1.2-3.2 3.3 0 1.1.6 2 1.8 2.5-.2 1.2-.5 3.4-.9 4.8-.5 1.8 1.1 1.7 2.1 1.8 1.6 0 2.7.1 2.7-1.7 0-1.2-.6-3.6-1-5 1-.4 1.6-1.3 1.6-2.5v0Zm4.1-6.1c.1-4.5-.3-8.2-.3-8.2A7.2 7.2 0 0 0 19.5 3c-3.3-.3-6 1.8-7.1 5.2 0 0-1 3-1 10.8"></path><path d="M23.9 17.4c.2-4.2 0-7.1 0-7.1-.3-2.4-2-4-4.6-4.3-2.3-.2-4 1.3-4.7 3.6 0 0-1 2.2-.5 8.4m13.6 1.4s.6.2.6 1.9m0 1 .4 10M18 4s2.3-.1 3.9 1m1.5 1.2a5 5 0 0 0 1.5 3m.2 1.3.1 2m-5.8 8.2L16.2 24m.4 1.5s3.3-3.7 3.6-4.7m-2.4 5.4 4-4.3m-4 5.8 4.6-4.5M21 26.5l-3.5 3m3.8-1.8L17 31.6m.3 1s3.5-2.5 4.3-3.3M19.2 33s2-1.7 2.6-2"></path></g><defs><clipPath id="a"><path fill="#fff" transform="translate(8 2)" d="M0 0h23v36H0z"></path></clipPath></defs></svg>` : `${itemId === "location" ? `<svg viewBox="0 0 40 40" width="40" height="40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="m23.6 31.7 3.6.8c1.7.6 2.8 1.6 2.3 2.3-.8 1.2-3.3 2-6.8 2.2H19a19 19 0 0 1-6.7-1.7c-1.7-1-1.7-2-.2-2.7 1-.4 2.6-.8 4.4-1" stroke="currentColor" stroke-width=".8" stroke-linecap="round" stroke-linejoin="round"></path><path d="M28.7 11.2A8.8 8.8 0 0 0 20.5 3c-4-.3-7.3 2.2-8.5 6.5a16 16 0 0 0-.6 4.8c0 7.2 3.4 13 7.4 18.6 1.4 2 2.4 1.7 3.6-.3 2.5-4.4 4.4-9 5.7-14 .6-2.4.8-4.8.6-7.3h0Z" stroke="currentColor" stroke-width=".8" stroke-linecap="round" stroke-linejoin="round"></path><path d="M20 8.1c-2.2 0-3.7 1.8-3.8 4.9-.1 2.8 1.5 4.7 3.9 4.7s4.2-2 4.3-4.8c.1-2.7-1.6-4.6-4.4-4.8Zm6 25.3c1.4.4 2.2 1 1.9 1.4-.7.7-2.5 1-5.2 1.1M18 4.5s3.3-1.2 6.4 1.5m1.1 1.1s1.2 1.2 1.5 3.4M15.6 16s.3 1.6 2.4 2.6m1.2.4s1.4.4 2.4-.4" stroke="currentColor" stroke-width=".8" stroke-linecap="round" stroke-linejoin="round"></path></svg>` : `${itemId === "license" ? `<svg viewBox="0 0 40 40" width="40" height="40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="m13.2 3.3-6.7.2c-.3 0-.5.2-.5.5 0 1 .2 3.4.1 4v14.7l.5 12.7.1 2.2c0 .2.3.4.5.4h5.5c4 0 7.9-.1 11.8-.3l5.3-.2c.3 0 .5-.2.5-.4v-4.2m-.5-11.6-.2-8-.2-7.5V3.4c0-.3-.3-.5-.5-.5l-6.4.2" stroke="currentColor" stroke-width=".8" stroke-linecap="round" stroke-linejoin="round"></path><path d="M34.5 26.7c.2-3.2-2.3-5.4-6.2-5.5-3.5-.2-6 2.1-6 5.6 0 3.4 2.6 6.2 6 6.3 3.6.1 6-2.4 6.2-6.4v0ZM13.8 2.1c-.2 0-.3 0-.4.4-.1.3 0 3 0 3.2 0 .9 1.1.7 1.4.7.3 0 4.6-.2 6.6 0 .7 0 1-.1.9-.6V2.3c0-.5-8.1-.2-8.5-.2h0Z" stroke="currentColor" stroke-width=".8" stroke-linecap="round" stroke-linejoin="round"></path><path d="M27.3 21.2V5.8c0-.3-.2-.4-.5-.5h-3.5l-1 .1m-9 0-5 .1h-.1v.1l.2 8.6c.2 7 1 19.7 1 20.1.1.5.2.7.6.8l8.7-.1 2.2-.2 6.1-.4h.3c.1 0 .2 0 .2-.2V34l.1-.5v-.4m-2.1-6.3 1.4 2.8s.3.8.9 0l3.6-5.3m-20.7-14 10.5-.3m-10.5 5.4h10.1m-9.7 4.8 9.7-.4" stroke="currentColor" stroke-width=".8" stroke-linecap="round" stroke-linejoin="round"></path><path d="m22.5 9.2.7 1.4s.1.4.4 0L25.4 8m-3.2 6.3.7 1.4s.2.4.4 0l1.8-2.6m-2.9 6.3.7 1.4s.2.4.4 0l1.8-2.6M14.4 5h4m1.2 0H21" stroke="currentColor" stroke-width=".8" stroke-linecap="round" stroke-linejoin="round"></path></svg>` : `${itemId === "data" ? `<svg viewBox="0 0 40 40" width="40" height="40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M34.6 16v-6l-.2-.3-.3-.1-1.4.1c-4.8.5-9.3.1-14.4.1 0 0-1 .2-1.4-.8-.2-.5-.7-1.7-1.6-1.8-1 0-9.5-.6-11.4 0 0 0-1.6.4-1.6 1.4v14.5c.1 1.9-.1 6.5-.3 8.4" stroke="currentColor" stroke-width=".8" stroke-linecap="round" stroke-linejoin="round"></path><path d="m2 31.6.1.2.3.1a451.9 451.9 0 0 0 32.5-.5c-.1-1.2 2.3-13.1 2-14.8v-.3h-.3L20.8 16s-12.6-.1-14.4.1c0 0-1.5 0-1.7 1L2 31.6h0Z" stroke="currentColor" stroke-width=".8" stroke-linecap="round" stroke-linejoin="round"></path><path d="M5 16.7C4.8 16 5 14 5 14h3.1l10.7.3 13.5-.3s-.2 1.7 0 2.2" stroke="currentColor" stroke-width=".8" stroke-linecap="round" stroke-linejoin="round"></path><path d="m3.7 22.7-.2-8.2v-2.2h3l10.7.2 13.5-.2s0 1 .2 1.7M14 9s0 0 0 0l-.1.2h-.2c-.1.1-.3 0-.4 0 0-.2.1-.4.3-.4.1 0 .3 0 .3.2h0Zm-2.9 0H4.6M23 29.5l.1-5c0-.8-1-1-1-1h-3.8c-2.2.1-2.3 1-2.3 1l-.2 4.5s-.2.7.6.8c.8 0 4.9.4 5.6.3.7-.2 1-.4 1-.6Z" stroke="currentColor" stroke-width=".8" stroke-linecap="round" stroke-linejoin="round"></path><path d="M20.6 25.6a1 1 0 0 0-1-1.2c-.6 0-1 .4-1.1 1 0 .5.1.8.5 1l-.3 1.6c-.3.6.3.6.6.7.5 0 1 0 1-.5l-.3-1.8c.4 0 .6-.4.6-.8h0Zm1.4-2c.2-1.6.1-2.8.1-2.8 0-1.3-.9-2.2-2.1-2.4-1-.2-2 .5-2.5 1.6 0 0-.4 1-.5 3.7" stroke="currentColor" stroke-width=".8" stroke-linecap="round" stroke-linejoin="round"></path><path d="M21 23.2v-2.1c0-.8-.4-1.3-1.1-1.4-.7 0-1.2.3-1.4 1 0 0-.3.7-.3 2.5M4.2 28l-.5 2.2s-.3.5.2.5h3m1.7 0 3.6.2" stroke="currentColor" stroke-width=".8" stroke-linecap="round" stroke-linejoin="round"></path></svg>` : `${itemId === "extinguisher" ? `<svg viewBox="0 0 40 40" width="40" height="40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21.6 14.7a3.7 3.7 0 0 0-2.8-2.4M21.7 25v-8.2m-.2 14.7V27m6.4-5.7-1.4-5.1m2.3 8.6-.5-2.1m-2.5-7.5-.5.4s0 0 0 0 0 0 0 0 0 0 0 0v.1s0 0 0 0 0 0 0 0l2.3 11s0 0 0 0l.1.2a3.6 3.6 0 0 0 1.6.1c.5 0 1.4-.4 1.7-.6.3-.2 1-.8 1-1.2l-.6-1.6s0 0 0 0 0 0 0 0l-3.8-8.5s0 0 0 0V15a2 2 0 0 0-.7-.2c-.9.1-1.2.4-1.2.4h0Z" stroke="currentColor" stroke-width=".8" stroke-linecap="round" stroke-linejoin="round"></path><path d="M14 11.2s0 0 0 0c-1.3.7-2 2-2 2.9 0 0 0 0 0 0s0 0 0 0l-.7 22.4s0 0 0 0 0 0 0 0v.1s0 0 0 0c.5 1.2 3.3 1.6 6 1.6a12 12 0 0 0 4.7-.8c.9-.4 1.6-1 1.6-1.5v-.1l-.3-21.5c0-1.3-1-2.5-2.3-3.2 0 0 0 0 0 0a8.3 8.3 0 0 0-7 0h0Zm1.6-5.6v-.9c0-.2-.2-.2-.3-.3 0 0-5-1.2-8.1-1.7-.2 0-.3-.4 0-.4a19.7 19.7 0 0 1 8.9.5c1.5.5 2.2 1 3 1.7l.2.8.2 1.2m-.1.8v-.8l-3.8-.8h-3.5c-1 0-2.1.1-3 .4l-1.4.6c-.5.2-.2 1 .3.8 1.7-.5 3.4-.7 5.1-.6.9 0 1.6.2 2.3.4.7.2 1 .9 1.2 1.5" stroke="currentColor" stroke-width=".8" stroke-linecap="round" stroke-linejoin="round"></path><path d="M15.8 10.5c.5-.6.8-1.2.8-1.7h2.8c0 .5.3 1.4.6 2" stroke="currentColor" stroke-width=".8" stroke-linecap="round" stroke-linejoin="round"></path><path d="M25.7 15c-.7-2-.7-2.7-1.5-4-.5-.7-4.7-2.4-5.4-2.8a.5.5 0 0 1-.3-.6s.2-.4.6-.2c0 0 5.3 1.9 6 3.1.9 1.3 1.3 2.2 1.9 4.2M12 17s1.4 1 3.5.7m-3.8 4.9s1.7 1.2 3.8.9M11.7 28a6 6 0 0 0 4 1m-4.3 4.5s2.1 1.7 4.7 1.4" stroke="currentColor" stroke-width=".8" stroke-linecap="round" stroke-linejoin="round"></path></svg>` : `${itemId === "firewall" ? `<svg viewBox="0 0 40 40" width="40" height="40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.5 5.2c-.2 0-.3 0-.4.3v3.4c-.1 1 1.2.7 1.5.7h7c.8 0 1 0 1-.6V5.3c0-.5-8.7-.2-9-.1Zm19.7 4.3c.2 0 .4 0 .5-.3V5.7c0-.9-1.2-.7-1.6-.7-.2 0-4.8.2-6.9 0-.8 0-1 .1-1 .6v3.7c0 .6 8.7.3 9 .2Zm2.5-4.3c-.2 0-.4 0-.5.3v3.4c0 1 1.2.7 1.6.7h6.9c.8 0 1 0 1-.6V5.3c0-.5-8.6-.2-9-.1Zm11.5 10c.2 0 .3 0 .4-.3.2-.4.1-3.2.1-3.4 0-1-1.3-.7-1.6-.7h-7c-.7 0-1 0-.9.6v2.1c0 .5-.1 1.1 0 1.6 0 .5 8.6.2 9 .1ZM16.6 11c-.2 0-.3 0-.4.2v3.5c-.1.9 1.2.7 1.5.7.3 0 4.8-.2 7 0 .8 0 1-.1 1-.6v-3.7c0-.6-8.7-.2-9-.2ZM14 15.2c.2 0 .4 0 .5-.3v-3.4c0-1-1.2-.7-1.5-.7H6c-.8 0-1 0-1 .6V15c0 .5 8.7.2 9 .1ZM2.6 16.8c-.2 0-.3.1-.4.4-.2.4-.1 3.2-.1 3.4 0 1 1.3.7 1.6.7h7c.7 0 1 0 .9-.6v-2.1c0-.5.1-1.1 0-1.6 0-.6-8.6-.2-9-.2Zm19.7 4.4c.2 0 .3 0 .4-.3.2-.4.1-3.3.1-3.5 0-.9-1.3-.7-1.6-.7h-7c-.7 0-1 .1-.9.6v2.1c0 .5-.1 1.2 0 1.6 0 .6 8.6.2 9 .2Zm11.5-2.1v-2c0-.7-8.7-.3-9-.3-.3 0-.4.1-.5.4v3.4m-.4 1.7a67 67 0 0 0-7.8.1c-.2 0-.3 0-.4.3v3.5c0 .9 1.2.7 1.5.7.3 0 4.3-.2 6.4 0m-10-.2c.1 0 .3 0 .4-.3V23c0-1-1.2-.7-1.5-.7h-7c-.8 0-1 0-1 .5v3.8c0 .5 8.7.2 9 .1Z" stroke="currentColor" stroke-width=".8" stroke-linecap="round" stroke-linejoin="round"></path><path d="M31.3 18.5s-3.2 2.2-6.1 2.1l-.3 5s-1 6.4 6.4 8.4c0 0 5.9-1.5 6.3-7.5v-4.8s-4.1-.6-6.3-3.2v0ZM2.6 28.2c-.2 0-.3 0-.4.3C2 29 2 31.7 2 32c0 .9 1.3.7 1.6.7.2 0 4.8-.2 7 0 .7 0 1-.1.9-.6v-3.7c0-.6-8.6-.3-9-.2Zm19.7 4.3c.2 0 .3 0 .4-.3.2-.4.1-3.2.1-3.4 0-1-1.3-.7-1.6-.7h-7c-.7 0-1 0-.9.5v2.2c0 .4-.1 1.1 0 1.6 0 .5 8.6.2 9 .1Z" stroke="currentColor" stroke-width=".8" stroke-linecap="round" stroke-linejoin="round"></path><path d="M24.3 28.5V32c0 .9 1.2.7 1.5.7h1m8.7-6.7c.1-2.3-1.6-3.8-4.3-4-2.5 0-4.3 1.6-4.3 4 0 2.5 1.9 4.4 4.3 4.5 2.5 0 4.2-1.7 4.3-4.5Z" stroke="currentColor" stroke-width=".8" stroke-linecap="round" stroke-linejoin="round"></path><path d="m29.2 26 1 2s.2.6.6 0l2.5-3.7M6.8 5.9l3.4.1m8 0h1.5M21 6h.8m-12 6h1.5m1.2 0h.9M18 29.3h1.5m1.1 0h1m9-23.4h2.2M17.3 17.7l4.4.2m-.6 5.5 2.3.2M13 23.2h-1.4m-1.4 0H8.3" stroke="currentColor" stroke-width=".8" stroke-linecap="round" stroke-linejoin="round"></path></svg>` : `${itemId === "identity-card" ? `<svg viewBox="0 0 40 40" width="40" height="40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15.4 7.2H9s0 0 0 0l.3 9c.2 7.2 1.1 20.5 1.2 21 0 .5.1.6.6.8l9.6-.2h2.4l6.8-.6h.4l.2-.1v-.3l.1-.5a190 190 0 0 0-.3-8.6l-.2-2.3-.2-4.3-1-13.6c0-.3-.1-.4-.5-.5h-3.9l-5.6.2h-1.7m-.2 2c-.4.6-.4 1.7.4 2.4 1 .8 2.3.7 3.1-.2.4-.5.5-1 .5-1.6a2 2 0 0 0-.4-1c-.2-.1-.4-.5-1.5-.7-.5 0-.9 0-1.2.2" stroke="currentColor" stroke-width=".8" stroke-linecap="round" stroke-linejoin="round"></path><path d="M19.5 13.7h1.7c.4.1.5.3.6.7a194.9 194.9 0 0 0 .5 8.9c0 .3-.3.5-.6.5h-.5l-2.4.3h-1.5c-.6 0-3.4.2-4.3.1h-1c-.4-.1-.6-.4-.7-.9v-.5l-.5-8.1c0-.3.2-.6.5-.6l8.2-.3v0ZM12 28l15.7-.8m-15.3 5 15.7-1.1M23.9 15h3.9M24 18.2h3.7M24 21.9l3.8-.1" stroke="currentColor" stroke-width=".8" stroke-linecap="round" stroke-linejoin="round"></path><path d="M13.1 24.2c.1-1.3.8-2.5 2-3.1l-.4-.7c-.2-.5-.4-1-.4-1.6a4 4 0 0 1 0-1.6c.2-.5.4-.9.8-1.2a2.3 2.3 0 0 1 3 .4c.6.6.8 1.4.8 2.3 0 .8-.2 1.6-.4 2.3v.1l.4.2c.5.2 1 .6 1.2 1.2l.2.8v.6l-3.7.2-3.5.1Z" fill="currentColor"></path><path d="m20.5 6.9 3-4.9M13 2l5.5 7c.2.3.5.3.7 0l.5-.8M21.8 7 25 2.3" stroke="currentColor" stroke-width=".8" stroke-linecap="round" stroke-linejoin="round"></path><path d="m11.4 2 6.4 8c.5.6 1.6.6 2-.1l.8-1.1" stroke="currentColor" stroke-width=".8" stroke-linecap="round" stroke-linejoin="round"></path></svg>` : `${itemId === "usb-stick" ? `<svg viewBox="0 0 40 40" width="40" height="40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.4 7.5v.1l.4 1c.1.3.4 0 .5 0l1.6-.8c.2 0 .2-.1.1-.2l-.3-.7-.2-.4c0-.2-2 .9-2.1 1h0Zm4.4-2.1v.2l.5 1c0 .3.3 0 .4 0l1.6-.8c.2 0 .2-.1.2-.2l-.3-.7-.2-.4c-.1-.2-2 .9-2.2 1h0Z" stroke="currentColor" stroke-width=".8" stroke-linecap="round" stroke-linejoin="round"></path><path d="M9.5 13.8 6 7.1 16.9 2l3.4 6.5M8.8 14.2l12.1-5.8c.6-.3 1.3 0 1.6.5l10.3 20.9c.4.8.1 1.8-.7 2.2l-10.3 5.6c-.6.3-1.4 0-1.8-.6L8.3 15.5a1 1 0 0 1 .5-1.3ZM7.7 7.8l2.1 3.7" stroke="currentColor" stroke-width=".8" stroke-linecap="round" stroke-linejoin="round"></path><path d="m11.5 14.6-1 .5s-.3.2 0 .8l1 2.2m.9 1.5 3.8 7m1.5 2.6s1.6 3.5 2 4" stroke="currentColor" stroke-width=".8" stroke-linecap="round" stroke-linejoin="round"></path></svg>` : `${itemId === "blueprint" ? `<svg viewBox="0 0 40 40" width="40" height="40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.5 35.3a2 2 0 0 1 0-3.4c1.8-1.2 3.5.3 3.5.3.3-3.5 1-27.9 1-27.9C7.6 3 5.5 3 5.5 3S2.3 3 2 4.3c0 1.4 0 24.7.3 30 0 0 0 3 4.8 3l14.5-.6 12.7-.3h2.2c.2-.2.4-.4.4-.7v-6a309.8 309.8 0 0 0-.6-22h-4.2L9 8.6" stroke="currentColor" stroke-width=".8" stroke-linecap="round" stroke-linejoin="round"></path><path d="M33.4 14.7v-2.3c0-.5-.4-.8-1.6-.7H13.1c-.9 0-1 .4-1 2 0 1.5.3 16.1 0 18.4 0 .6 0 1 1 1 .9 0 16.1-.2 18.5-.1 1.8 0 1.8-1 1.8-1V18" stroke="currentColor" stroke-width=".8" stroke-linecap="round" stroke-linejoin="round"></path><path d="m12.4 21.6 6.7-.2s1 0 1-.5v-1.5m-.1-2.9.2-4.8m6.6 0a47.5 47.5 0 0 0-.2 7.3m0 2.8 6.8.3m-21.2 4.4 2.7.1m2.5 0h9.2m3.7 0h3m-9.7.1L24 33M4.9 4.5s.8-.2 1.9.2c.8.2.7.4.7.4l-.1 2.7m-.1 2.4-.6 15.4m7.7-1.8h5.4m-.6-1.3s1 .8 1 1.3-1 1.1-1 1.1" stroke="currentColor" stroke-width=".8" stroke-linecap="round" stroke-linejoin="round"></path></svg>` : `${itemId === "cloud" ? `<svg viewBox="0 0 40 40" width="40" height="40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M27 15.5c.3 0 .5 0 .7-.3.2-.4.1-3 .1-3.2 0-.9-2-.7-2.5-.7-.4 0-7.4.2-10.7 0-1.3 0-1.6.1-1.5.6l-.1 2v1.5c0 .5 13.4.2 14 .1h0ZM13.7 17c-.3.1-.5.1-.6.4-.2.4-.1 3-.2 3.2 0 .9 2 .7 2.5.7h10.8c1.2 0 1.5-.1 1.5-.6v-2c0-.4.2-1 .1-1.5 0-.5-13.5-.2-14-.1h0ZM27 26.5c.3 0 .5 0 .7-.3.2-.3.1-3 .1-3.2 0-.9-2-.7-2.5-.6H14.6c-1.3 0-1.6 0-1.5.5l-.1 2v1.5c0 .5 13.4.2 14 .1h0Z" stroke="currentColor" stroke-width=".8" stroke-linecap="round" stroke-linejoin="round"></path><path d="M11.8 21.4s-1.3.3-3.1.1C8 21.5 3 21.4 3 16s3.1-7.5 6.7-7.4c0 0 1.7-7.8 10-6.3 8.4 1.5 10.3 8 10.3 8s4-.8 6.4 1.7c2.4 2.5 2 9.1-3.7 9.9 0 0-2 .3-3.8-.3" stroke="currentColor" stroke-width=".8" stroke-linecap="round" stroke-linejoin="round"></path><path d="M23.5 13.7s0 0 0 0v.2H23c0-.2 0-.4.2-.4.1 0 .2 0 .3.2Zm-2.4 0h-5.5m10.1 0s0 0 0 0v.2h-.5c0-.2 0-.4.2-.4.1 0 .3 0 .3.2ZM23.5 19v.4h-.2c-.1.1-.3 0-.3-.1s0-.3.2-.3c.1 0 .2 0 .3.2Zm-2.4 0-5.7.1m10.3-.1v.4h-.2c-.1.1-.3 0-.3-.1s0-.3.2-.3c.1 0 .3 0 .3.2Zm-2.2 5.5s0 0 0 0v.2h-.2c-.1.1-.3 0-.3-.1 0-.2 0-.3.2-.3.1 0 .2 0 .3.2Zm-2.4 0h-5.4m10 0s0 0 0 0v.2h-.2c-.1.1-.3 0-.3-.1 0-.2 0-.3.2-.3.1 0 .3 0 .3.2ZM22 35.1c0-.9-.7-1.5-1.8-1.6-1 0-1.7.7-1.7 1.7s.7 1.8 1.7 1.8 1.8-.7 1.8-1.9h0Zm9.8-1.9c0-.9-.6-1.5-1.8-1.6-1 0-1.7.6-1.7 1.6S29 35 30 35.1c1 0 1.8-.7 1.8-1.9h0Zm-11.6-6.5v6.8m3.3-6.8-.1 2.3 5.6-.2.7 2.8m-13.4-4.9-.4 4.7-5 .2-.4 1.1m1.7 1.8c0-1-.7-1.6-1.8-1.6-1 0-1.8.6-1.8 1.6s.8 1.8 1.8 1.8 1.7-.7 1.8-1.8h0ZM11.9 7s-.7 1.2-1 3.1c0 0-3-.8-4.9 1.7m-1 1.7s-.7 1.8-.2 3.7m7.7-11.3s.5-1 1.2-1.3m7.6-.5s2.8 1 3.9 2.3" stroke="currentColor" stroke-width=".8" stroke-linecap="round" stroke-linejoin="round"></path></svg>` : `${itemId === "virus" ? `<svg viewBox="0 0 40 40" width="40" height="40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="m35.7 28.4.5-10.7V7.6l-.2-.2-.2-.1-.5-.1a172.4 172.4 0 0 0-8.8-.2H20l-13.7.3c-.4 0-.5.1-.6.5L5.5 9l-1 19.4M35 32.2c.7 0 1.5 0 1.9-.2.5-.3 1-2.6 1.1-2.8 0-.7-4.8-.6-6-.6H5.7c-3.1 0-3.7.1-3.7.5 0 1 0 1.4.3 2 .2.4 1 1 1.7 1 .6 0 29.5.2 31 .1v0Z" stroke="currentColor" stroke-width=".8" stroke-linecap="round" stroke-linejoin="round"></path><path d="m6.2 28.4.5-18.8s0-.7 1-.8C9 8.7 30 8.3 32 8.4c2 0 2.6-.1 2.7 1 .2 5.3-.4 19-.4 19M15 29.5s-.1.6.5.6 7.8.3 8.8 0c0 0 .5-.1.6-.6m-21.8.3s6.6-.3 10.4-.2m12.5 0s9-.3 10.6 0" stroke="currentColor" stroke-width=".8" stroke-linecap="round" stroke-linejoin="round"></path><path d="M18.2 21.5s-3.6-3.4-.2-6c3.5-2.6 6.4.8 6.4.8s1.8 2.3-1 5.4v1s0 1-1.2 1c-1 0-2.4.2-2.9 0-.5-.1-.8-.4-.7-1 0-.8-.4-1.2-.4-1.2h0Zm1.4.7v1.6m1.4-1.6v1.4m1.2-1.2v1.3" stroke="currentColor" stroke-width=".8" stroke-linecap="round" stroke-linejoin="round"></path><path d="M18.3 17.4s.5 0 1.7 1c.5.4 0 .9-.3 1-.3.2-1.2.1-1.6-.4-.4-.5-.5-1.5.2-1.5v0Zm5.1 0s-.5 0-1.6 1c-.6.4 0 .9.3 1 .3.2 1.1.1 1.5-.4.4-.5.5-1.5-.2-1.5v0Zm-10.3-4.2c0-.8-.6-1.4-1.6-1.4s-1.6.6-1.6 1.5.7 1.6 1.6 1.6c1 0 1.6-.6 1.6-1.7Zm-.9 10.3c0-.8-.6-1.4-1.6-1.4S9 22.6 9 23.5c0 1 .6 1.7 1.6 1.7.9 0 1.5-.6 1.6-1.7Zm4.4-5.8-5 .4v-3.2m20-.9c0-.7-.6-1.3-1.6-1.3s-1.6.5-1.6 1.4c0 1 .7 1.6 1.6 1.7 1 0 1.6-.7 1.6-1.7ZM25 17.4l5.4-.2-.4-1.4m-12.8 4.4-5.7.2L11 22m13.4-1.6 5.1.1v2" stroke="currentColor" stroke-width=".8" stroke-linecap="round" stroke-linejoin="round"></path><path d="M30.8 23.8c0-.8-.6-1.4-1.6-1.4-.9 0-1.5.6-1.6 1.5 0 .9.7 1.6 1.6 1.6 1 0 1.6-.6 1.6-1.7ZM9.2 9.9s-1.1-.1-1.3.3c-.2.3 0 3.4 0 3.4m-.1 2.1v5.7M23.3 9.7l5 .1m1.7-.1 2.6-.1s.5-.1.6.9" stroke="currentColor" stroke-width=".8" stroke-linecap="round" stroke-linejoin="round"></path></svg>` : `${itemId === "tools" ? `<svg viewBox="0 0 40 40" width="40" height="40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.7 23.7 9 7.3s1.5-.4 1.2-2.4L10 3.5s-.2-1.2-.5-1.2L7.7 2s-.4 0-.6.7l-.6 1.8s-.8 2.1 1 2.7l-.1 16.5m1 .3-2.5-.1s-.6 0-.6 1.4c0 0 0 .6.6.7 0 0-.5 0-.6.7L5 35.9s-.1 1 .8 1c1.1.1 3.7.5 4.4.4 0 0 1.4 0 1.4-1.4l-.4-9.1s0-.8-.8-.8c0 0 1.2-.1 1.2-.5 0 0 0-1.1-.2-1.4-.2-.3-1.7 0-3-.1h0Z" stroke="currentColor" stroke-width=".8" stroke-linecap="round" stroke-linejoin="round"></path><path d="M5.8 26s3.4.2 4.7 0m-3.8.1L6 37m1.7-11 .1 11M9 26.2V37m1-10.8.5 10.8m12-34.2s2.4-.5 2 .3l-.9.9c-.3.4-.8 1.2.3 2.3 0 0 .5.5 1.6.6 1.1.1 2.5.7 2.8 3.3v1.5c0 .5-.5 2.1.8 3.2 0 0-2 .3-3.3.3 0 0-.5-2-1-2.3-.4-.2-3.2-1.4-2.4-4.7 0 0 .2-.7-.7-1-.3 0-1-.5-1.2-1.3-.4-1.9.4-2.7 2-3.1h0Z" stroke="currentColor" stroke-width=".8" stroke-linecap="round" stroke-linejoin="round"></path><path d="M25.8 15.2s2.6 4.8 3.3 6.7a25 25 0 0 1 1 8c0 3.2-1.1 7 2 7.7 3.2.7 2.9-2.5 2.9-2.5s-.5-3.4-.5-4.3c0-.8-.4-8-1.4-10-.9-2-2.6-4.3-4-5.9m-1.1-6s0-1.1 1.1-1.4c.3-.1 1.1-.5 1.3-1.3.4-1.9-.3-2.7-1.9-3.2 0 0-2.4-.6-2 .2l.8.9c.4.4.8 1.3-.4 2.3 0 0-.3.4-1.1.5m-3.4 3.7v1.5c0 .5 0 1.7-1.3 2.8 0 0 2 .3 3.3.3 0 0 .6-1.1 1-1.5" stroke="currentColor" stroke-width=".8" stroke-linecap="round" stroke-linejoin="round"></path><path d="M24.4 15.2s-2.2 4.4-2.8 6.6c-.7 2.7-.7 4-.8 7.2 0 3.2.9 7.2-2.3 7.7-3.2.5-2.8-2.6-2.8-2.6l.7-4.2c0-.9.9-7.2 1.6-9.3 1.2-3.2 1.6-4.2 3-5.7" stroke="currentColor" stroke-width=".8" stroke-linecap="round" stroke-linejoin="round"></path><path d="M23.1 18s2.2 1.6 4.2 0m-4.9 1.6s4 1.7 5.5-.4m2.1-1.6s2.2 2.7 2.5 5m.3 1.6.3 3.2M31.8 36s2.2.6 2.1-1M22.2 17.1s-1.9 3-2.1 6.9M18 35.3s1.6 0 1.6-1.9" stroke="currentColor" stroke-width=".8" stroke-linecap="round" stroke-linejoin="round"></path></svg>` : `${itemId === "gun" ? `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="m9.6 15.9-.3.1v1.3c0 .3.7.2.9.2a101.3 101.3 0 0 1 4.6-.2v-1.4c0-.2-5 0-5.2 0h0ZM33 9.2l.7-1s.6-.7 1 .2c.3 1 .6 1 .6 1" stroke="currentColor" stroke-width=".8" stroke-linecap="round" stroke-linejoin="round"></path><path d="M37.8 14.4s1-.7 1-2.5c.2-1.9.4-2-.5-2.4-.8-.3-32-.6-32-.6s-2.2-.2-2.4 2l-.2 1.9S3.3 15 5 15.2c1.8.2 1.9 1.2 2 1.9 0 1.7-.4 2.8-.4 2.8s-1.5 3.9-4.6 8c0 0-2.4 2.4.3 3.5 2.9 1 10.9.9 10.9.9s1.1 0 1.4-2.6c.2-2.7.8-7.9 2-10.2 1-2.3 1.2-3.7 5.9-4 4.7-.3 14 0 15.3-1h0Z" stroke="currentColor" stroke-width=".8" stroke-linecap="round" stroke-linejoin="round"></path><path d="M3.7 12.8s25 .6 35-.2m-21 4.6s.4 2.6 3 2.8c2.2.1 2.1-.4 1.6-1-.5-.5-2.5-1-1.3-3.3" stroke="currentColor" stroke-width=".8" stroke-linecap="round" stroke-linejoin="round"></path><path d="M16.5 19.5s1 2.3 4.7 2.3c3.8 0 3.4-2.3 3.4-2.3s-.6-2.8 0-4.1" stroke="currentColor" stroke-width=".8" stroke-linecap="round" stroke-linejoin="round"></path><path d="M15.7 22s3.6 2.3 7.2 1c3.6-1.2 2.8-3.7 2.8-3.7s-.5-1.9-.2-3.6M5.2 11.5l4.3.2m1.5 0h2.8M5.8 25s-1.1 2.7-2.1 3.6c-1 1-.9 1.7.4 2m1.7.2 2.7.2" stroke="currentColor" stroke-width=".8" stroke-linecap="round" stroke-linejoin="round"></path></svg>` : `${itemId === "binoculars" ? `<svg viewBox="0 0 40 40" width="40" height="40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M38 30c.2-2.4-2.6-4.1-7-4.2-4-.1-6.9 1.7-6.9 4.4s3 4.8 7 4.9c4 .1 6.7-1.9 6.9-5v0Zm-22.4 0c.1-2.4-2.6-4.1-6.9-4.2-4-.1-6.7 1.7-6.7 4.4S4.9 35 8.7 35c4 .1 6.7-1.9 6.9-5v0Z" stroke="currentColor" stroke-width=".8" stroke-linecap="round" stroke-linejoin="round"></path><path d="m16.7 14.8.3-5s.3-3.3-2.4-4c-6.4-1.8-7 2-7 2L2 29.4m13.6.6.7-10.3m4.7-5-1-5s-1-3.4 2.7-4.3c3.2-.8 4.7-.6 6.7 2.6s8.4 21 8.4 21m-13.6 1.7-2.3-11" stroke="currentColor" stroke-width=".8" stroke-linecap="round" stroke-linejoin="round"></path><path d="M15.7 15.3c1-.5 3.4-1.3 6.5-.2.4 0 .7.4.8.9l.7 3.9s-7.3-1.7-9.1.5l.3-4c0-.5.3-.9.8-1h0Zm-12 8.5s9.2-4.4 12 1.8m7.5.4s2.6-7 12.6-2.6m-32 7.3c0 1.8 2 3 5 3.1 3 .1 5-1.2 5-3.2s-2.2-3.5-5-3.6c-2.8 0-4.8 1.4-5 3.7h0Zm22.2 0c-.1 1.8 2 3 5.1 3.1 3 .1 5-1.2 5-3.2s-2.1-3.5-5-3.6c-3 0-5 1.4-5 3.7v0Z" stroke="currentColor" stroke-width=".8" stroke-linecap="round" stroke-linejoin="round"></path><path d="M34.5 29.8s1 1.9-1.1 2.5m-1.4.4s-2.1 0-3.3-.4m-17-3.3s1.2 1 .5 2.4m-.5.9s-1.3.7-3 .4m15-11.9.4 2M22 13.5 21 10m-5.4 4 .1-2.7m-1.1 10.1-.2 1m.3-3.7s4.6-2.2 8.8-.2m-8.6-1.3s4.8-1.7 8.3.3m-8.1-1.7s4.7-1.1 8 .2" stroke="currentColor" stroke-width=".8" stroke-linecap="round" stroke-linejoin="round"></path></svg>` : `${itemId === "dynamite" ? `<svg viewBox="0 0 40 40" width="40" height="40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.2 28.1c.8.1 1.3-1.4 1.4-3.7 0-2.2-.5-3.8-1.4-3.8-.8 0-1.5 1.6-1.5 3.8 0 2.1.6 3.6 1.5 3.7v0Z" stroke="currentColor" stroke-width=".7" stroke-linecap="round" stroke-linejoin="round"></path><path d="M26.3 20.4c1.3 0 2.3 0 3.3.2 0 0 2.7.1 3.3 1.6 0 0 1 2 0 4 0 0-.5 1.7-2.6 2 0 0-19 .3-24 0m7-7.8h10.8m-17.9.2 5-.1M5 19.4c.8 0 1.4-1.5 1.4-3.8 0-2.2-.5-3.8-1.4-3.8-.8 0-1.5 1.6-1.5 3.8 0 2.2.6 3.6 1.6 3.8v0Zm6 .1-6-.1m19 0-10.9.1" stroke="currentColor" stroke-width=".7" stroke-linecap="round" stroke-linejoin="round"></path><path d="M5 11.8s16.4-.5 22.9 0c0 0 1.3 0 2 1 .5.6 1.8 3.4 0 6 0 0-.4.5-1.3.6h-2.4M2.6 27c.7.1 1.3-1.4 1.3-3.8 0-2.2-.5-3.7-1.4-3.7-.8 0-1.5 1.6-1.5 3.7 0 2.2.6 3.7 1.6 3.8v0Z" stroke="currentColor" stroke-width=".7" stroke-linecap="round" stroke-linejoin="round"></path><path d="M5 27.2c-1.4 0-1.6-.1-2.4-.2m-.1-7.5 2.6-.1m23.2 0s.7.2.7 1.1M9.5 11.7s3.3 11.9 1.4 16.5m.4-16.5s3.4 10.7 2 16.5M23 11.7s2 10.1.6 16.5m1.3-16.5s2.6 10.7 1.1 16.5" stroke="currentColor" stroke-width=".7" stroke-linecap="round" stroke-linejoin="round"></path><path d="M10.4 11.8a47 47 0 0 0 2 16.4m11.5-16.5s2 6.6 1 16.5m5.9-12.3s1.3-1 2-.6c.8.4.7 1 .8 1.3.2.8 1.2 1 2.2-.1" stroke="currentColor" stroke-width=".7" stroke-linecap="round" stroke-linejoin="round"></path><path d="m34.7 15.7-.6-1.7c0-.5 1.2.5 1.2.5l.4-1.5c0-.3 1 .4.8 1.6l1.6-.2c.2 0-.6 1.3-.6 1.3S38.8 17 39 17c.2 0-2.6-.1-2.7.2m-.7.9 1.1 1c.2.3.2-1.2.2-1.2M7 17.6s-.2.7.3.6h2.4m5.1 0 7.6-.3m4.8.3s1.5.2 2-.6c.5-.9.5-1.5.5-1.5m-21.3 11H10m8.7 0 4-.1m4.4-.2h1.2m1.3 0s1.8.4 2.7-2" stroke="currentColor" stroke-width=".7" stroke-linecap="round" stroke-linejoin="round"></path></svg>` : `${itemId === "server" ? `<svg viewBox="0 0 40 40" width="40" height="40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M26 10c-.6.1-9 .2-13.2 0-1.5 0-1.9.2-1.8.7l-.1 2.6V15c0 .7 16.7.3 17.4.2m-16.5 2c-.4 0-.7 0-.8.4-.3.5-.2 3.8-.2 4 0 1.1 2.5.9 3.1.8h13.4c1.6.1 1.9 0 1.9-.6v-2.5c0-.6.2-1.4.1-1.9 0-.6-16.8-.2-17.5-.2h0ZM14 29.1c4.8.2 13.8 0 14.3-.1.4 0 .7 0 .9-.4.2-.5.1-3.7.1-4 0-1-2.5-.8-3-.8h-14" stroke="currentColor" stroke-width=".8" stroke-linecap="round" stroke-linejoin="round"></path><path d="M24 13s0 0 0 0l-.1.3h-.2c-.2.1-.3 0-.4-.1 0-.2 0-.4.3-.4.1 0 .3 0 .3.2h0Zm-3 0h-7m12.7 0s0 0 0 0v.3h-.2c-.2.1-.4 0-.4-.1-.1-.2 0-.4.2-.4s.3 0 .4.2h0ZM24 19.7s0 0 0 0l-.1.3h-.2c-.2.1-.3 0-.4-.1 0-.2 0-.4.3-.4.1 0 .3 0 .3.2h0Zm-3 0h-7.2m12.9 0s0 0 0 0v.3h-.2c-.2.1-.4 0-.4-.1-.1-.2 0-.4.2-.4s.3 0 .4.2h0ZM24 26.4v.1l-.1.2h-.2c-.2.1-.3 0-.4-.1 0-.2 0-.4.3-.4.1 0 .3 0 .3.2h0Zm-3 .1-6.8-.1m12.5 0v.3h-.2c-.2.1-.4 0-.4-.1-.1-.2 0-.4.2-.4s.3 0 .4.2h0Zm8.4-15.9c0-1.3-1-2.2-2.5-2.2-1.4 0-2.4.9-2.4 2.3s1 2.5 2.4 2.5c1.5 0 2.4-1 2.5-2.6h0Z" stroke="currentColor" stroke-width=".8" stroke-linecap="round" stroke-linejoin="round"></path><path d="M30.5 6.8s.5-.5 1.1-.6l.3-1h.1l1.2-.2.2.1.2.8s1.2.4 1.5.7l.7-.3.4.1.6.7c.1.1.2.3 0 .5l-.3.6s.4.9.4 1.4l.9.2c.1 0 .3.2.3.4v.7l-.2.3-.9.5s.1.7-.4 1.4l.2.4v.6l-.6.5h-.5l-.3-.1s-.9.5-1.4.5l-.2.6c0 .2-.2.3-.3.3h-1s-.2 0-.2-.2l-.5-.6s-1.2-.3-1.6-.7l-.6.3H29l-.6-.6a.5.5 0 0 1-.1-.5l.4-.8-.4-1.1-1-.2a.4.4 0 0 1-.2-.4v-1l.3-.3.7-.3.6-1.4-.3-.5V7l.8-.8h.5l.7.5h0ZM5 28.3c-.1 1.3.9 2.2 2.4 2.2s2.5-.8 2.5-2.2c0-1.4-1-2.5-2.5-2.6-1.4 0-2.4 1-2.5 2.6h0Z" stroke="currentColor" stroke-width=".8" stroke-linecap="round" stroke-linejoin="round"></path><path d="M9.6 32s-.5.5-1.2.6l-.2 1-.2.1-1.2.1-.2-.1-.2-.8s-1.1-.3-1.5-.7l-.6.3-.5-.1-.6-.7a.4.4 0 0 1 0-.4l.3-.6-.4-1.4-.8-.3a.4.4 0 0 1-.3-.4V28s0-.2.2-.3l.8-.5s0-.6.4-1.4l-.2-.4a.5.5 0 0 1 0-.5l.6-.6h.6l.3.1 1.3-.5.2-.6c0-.2.2-.2.4-.2h.9l.3.1.4.6s1.3.3 1.7.7l.5-.3h.6l.6.6c.2.1.2.4.2.5l-.4.9.4 1 .9.2.2.4v1l-.2.3-.8.3-.6 1.4.3.5v.5l-.8.8h-.5l-.7-.5h0ZM5.4 21.2s-3.9-8.8 3-13.6c6.8-4.7 16.9-1 16.9-1m8.2 11s4.5 10-2.8 14.4-16.2.8-16.2.8" stroke="currentColor" stroke-width=".8" stroke-linecap="round" stroke-linejoin="round"></path><path d="M15.8 31.9s-1.3-.3-2.2.1c-.2.1-.3.3-.2.6L14 34M24 7.4s1.3.3 2.2-.1c.2-.1.3-.3.2-.6 0-.2-.3-.8-.8-1.4M31 7.7s1.1-.9 2.7-.2m1 .5s.6.3.9 1m-5.9 3.2s.3 1 1.6 1.4M4.6 26.3s.6-1.6 2.4-1.5m3.7 3.3s.2.8-.2 1.5m-.5.7s-.5 1-1.7 1" stroke="currentColor" stroke-width=".8" stroke-linecap="round" stroke-linejoin="round"></path></svg>` : ``}`}`}`}`}`}`}`}`}`}`}`}`}`}`}`}`}`}`}`}`;
});
const css$2 = {
  code: '.square.svelte-4u67jd.svelte-4u67jd{display:grid;grid-column:var(--_column);grid-row:var(--_row);grid-template-columns:repeat(3,1fr);grid-template-rows:repeat(3,1fr);position:relative}.square.svelte-4u67jd.svelte-4u67jd,.square.svelte-4u67jd>.svelte-4u67jd{min-height:0;min-width:0}.square.possible-move.svelte-4u67jd.svelte-4u67jd{border:2px solid red}.square.svelte-4u67jd.svelte-4u67jd:after{border:1px solid hsla(0,0%,100%,.133);bottom:calc((0px - var(--px))/2);content:"";left:calc((0px - var(--px))/2);pointer-events:none;position:absolute;right:calc((0px - var(--px))/2);top:calc((0px - var(--px))/2)}.player.svelte-4u67jd.svelte-4u67jd{grid-column:2;grid-row:2}.item.svelte-4u67jd.svelte-4u67jd:first-child{grid-column:1;grid-row:1}.item.svelte-4u67jd.svelte-4u67jd:nth-child(2){grid-column:3;grid-row:3}.item.svelte-4u67jd svg,.player.svelte-4u67jd svg{height:100%;width:100%}',
  map: null
};
const Square = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $isPossibleMove, $$unsubscribe_isPossibleMove;
  let $items, $$unsubscribe_items;
  let $players, $$unsubscribe_players;
  let $canMove, $$unsubscribe_canMove;
  let { columnIndex } = $$props;
  let { rowIndex } = $$props;
  const coordinate = [columnIndex, rowIndex];
  const { machine: machine2 } = getGameContext();
  const items = useSelector(machine2.service, ({ context }) => context.items.filter((item) => isEqual(item.position, coordinate)), isEqual);
  $$unsubscribe_items = subscribe(items, (value) => $items = value);
  const players = useSelector(
    machine2.service,
    ({ context }) => {
      const { playerPositions } = getCurrentGameState(context);
      return Object.entries(playerPositions).filter(([_, position]) => isEqual(position, coordinate)).map(([playerId]) => getPlayer(playerId, context));
    },
    isEqual
  );
  $$unsubscribe_players = subscribe(players, (value) => $players = value);
  const isPossibleMove = useSelector(machine2.service, (state) => {
    const readyToMove = state.matches("Playing.Gameloop.Playing.Ready to move");
    if (!readyToMove)
      return false;
    const { context } = state;
    const gameState = getCurrentGameState(context);
    const currentPosition = gameState.playerPositions[gameState.activePlayerId];
    const xDiff = Math.abs(currentPosition[0] - columnIndex);
    const yDiff = Math.abs(currentPosition[1] - rowIndex);
    return xDiff + yDiff <= 2 && xDiff + yDiff != 0;
  });
  $$unsubscribe_isPossibleMove = subscribe(isPossibleMove, (value) => $isPossibleMove = value);
  const getMoveEvent = (to, context) => {
    return {
      type: "apply game event",
      gameEvent: {
        type: "move",
        finalized: true,
        playerId: getCurrentGameState(context).activePlayerId,
        to
      }
    };
  };
  const canMove = useSelector(machine2.service, (state) => state.can(getMoveEvent(coordinate, machine2.service.getSnapshot().context)));
  $$unsubscribe_canMove = subscribe(canMove, (value) => $canMove = value);
  if ($$props.columnIndex === void 0 && $$bindings.columnIndex && columnIndex !== void 0)
    $$bindings.columnIndex(columnIndex);
  if ($$props.rowIndex === void 0 && $$bindings.rowIndex && rowIndex !== void 0)
    $$bindings.rowIndex(rowIndex);
  $$result.css.add(css$2);
  $$unsubscribe_isPossibleMove();
  $$unsubscribe_items();
  $$unsubscribe_players();
  $$unsubscribe_canMove();
  return `<div class="${["square svelte-4u67jd", $isPossibleMove ? "possible-move" : ""].join(" ").trim()}"${add_styles({
    "--_row": rowIndex + 1,
    "--_column": columnIndex + 1
  })}>${each($items, (item) => {
    return `<div class="item svelte-4u67jd">${validate_component(Item, "Item").$$render($$result, { itemId: item.item }, {}, {})} </div>`;
  })} ${each($players, (player) => {
    return `<div class="player svelte-4u67jd">${validate_component(Face, "Face").$$render($$result, { faceId: player.faceId }, {}, {})} </div>`;
  })} ${$canMove && $isPossibleMove ? `<button class="svelte-4u67jd" data-svelte-h="svelte-bnsqhg">MOVE</button>` : ``} </div>`;
});
const css$1 = {
  code: ".board.svelte-1hmvwcc{grid-gap:0;aspect-ratio:var(--column-count) /var(--row-count);display:grid;gap:0;grid-template-columns:repeat(var(--column-count),1fr);grid-template-rows:repeat(var(--row-count),1fr);margin:0 auto;max-height:100%;max-width:80%}",
  map: null
};
const columnCount = 9;
const rowCount = 8;
const Board = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$1);
  return `<div class="board svelte-1hmvwcc"${add_styles({
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
const css = {
  code: '.game-wrapper.svelte-1ulre0l{align-content:center;background:#000;display:grid;height:100%;justify-content:center;place-content:center;width:100%}.game.svelte-1ulre0l{grid-gap:1rem;background:var(--color-bg);display:grid;gap:1rem;grid-template-areas:"name characters items" "actions content content";grid-template-columns:30rem 1fr 1fr;grid-template-rows:10% 1fr;height:50.625rem;overflow:hidden;position:relative;width:90rem}@media(max-width:1439.98px) or (max-height:809.98px){.game.svelte-1ulre0l{scale:.8;transform-origin:center}}@media(max-width:1199.98px) or (max-height:674.98px){.game.svelte-1ulre0l{scale:.6}}.name.svelte-1ulre0l{grid-area:name}.characters.svelte-1ulre0l{grid-area:characters}.items.svelte-1ulre0l{grid-area:items}.actions.svelte-1ulre0l{grid-area:actions}.content.svelte-1ulre0l{grid-area:content;padding-right:3rem}',
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
  return `<div class="game-wrapper svelte-1ulre0l"> <div class="game svelte-1ulre0l"${add_attribute("this", gameContainer, 0)}><div class="name svelte-1ulre0l" data-svelte-h="svelte-iqe0dn">The Hidden Threat</div> <div class="characters svelte-1ulre0l"></div> <div class="items svelte-1ulre0l">${slots.items ? slots.items({}) : ``}</div> <div class="actions svelte-1ulre0l">${slots.actions ? slots.actions({}) : ``} ${$section === "Playing" ? `${validate_component(Players, "Players").$$render($$result, {}, {}, {})}` : ``} ${validate_component(TempActionButton, "TempActionButton").$$render($$result, {}, {}, {})}</div> <div class="content svelte-1ulre0l">${$section === "Lobby" ? `${validate_component(Lobby, "Lobby").$$render($$result, {}, {}, {})}` : `${$section === "Playing" ? `${validate_component(Playing, "Playing").$$render($$result, {}, {}, {})}` : `${$section === "Finished" ? `${validate_component(Finished, "Finished").$$render($$result, {}, {}, {})}` : `Unkown state`}`}`}</div> ${slots["cursor-overlays"] ? slots["cursor-overlays"]({}) : ``}</div> </div>`;
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
//# sourceMappingURL=_page.svelte-79f69eb5.js.map
