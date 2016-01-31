---
layout: post
categories: resume projects
tags: HaXe C/C++ Muxing Video Processing Audio Processing Image Processing Containers
datetype: year
title: haxe-nme webm, webp and opus
links:
- https://github.com/soywiz/haxe-nme-webm
- https://github.com/soywiz/haxe-nme-webp
- https://github.com/soywiz/haxe-nme-opus
---

I created three projects/libraries for multimedia playing in haxe. Those were:
haxe-nme-webp, haxe-nme-webm and haxe-nme-opus.

Those aimed to be able to:

Decode webp images, that is a pretty efficient image format. Supporting lossy and lossless compression and alpha channel in both cases, as well as a beterr compression rate than jpeg and png. So it is a suitable image format substitute for games, specially on mobile where it is interesting having images in a fraction of the size.

Decode and play webm videos. Webm is a container based on ogg/riff, that uses VP8 as video codec and vorbis as audio codec. So I included both video and audio decoders.

Decode and play opus audio. Opus is a great audio format that allows a huge compression rate and handles pretty fine some use cases including speech and music and it is free to use.
