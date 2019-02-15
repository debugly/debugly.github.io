---
layout: post
title: 解决集成 FFmpeg 时编译报错问题
date: 2019-02-15 17:04:23
tags: FFmpeg
---

## 解决集成 FFmpeg 时编译报错问题

> 由于 FFmpeg 依赖了很多个系统框架，所以在集成过程中很可能会遇到以下问题，只需要加上缺少的库就行了。下面列举的是集成 FFmpeg 3.1.11 版本时可能遇到的。


1、缺少 Security.framework

```
Undefined symbols for architecture x86_64:
  "_SSLClose", referenced from:
      _tls_open in libavformat.a(tls_securetransport.o)
      _tls_close in libavformat.a(tls_securetransport.o)
  "_SSLCopyPeerTrust", referenced from:
      _tls_open in libavformat.a(tls_securetransport.o)
  "_SSLCreateContext", referenced from:
      _tls_open in libavformat.a(tls_securetransport.o)
  "_SSLHandshake", referenced from:
      _tls_open in libavformat.a(tls_securetransport.o)
  "_SSLRead", referenced from:
      _tls_read in libavformat.a(tls_securetransport.o)
  "_SSLSetCertificate", referenced from:
      _tls_open in libavformat.a(tls_securetransport.o)
  "_SSLSetConnection", referenced from:
      _tls_open in libavformat.a(tls_securetransport.o)
  "_SSLSetIOFuncs", referenced from:
      _tls_open in libavformat.a(tls_securetransport.o)
  "_SSLSetPeerDomainName", referenced from:
      _tls_open in libavformat.a(tls_securetransport.o)
  "_SSLSetSessionOption", referenced from:
      _tls_open in libavformat.a(tls_securetransport.o)
  "_SSLWrite", referenced from:
      _tls_write in libavformat.a(tls_securetransport.o)
  "_SecIdentityCreate", referenced from:
      _tls_open in libavformat.a(tls_securetransport.o)
  "_SecItemImport", referenced from:
      _import_pem in libavformat.a(tls_securetransport.o)
  "_SecTrustEvaluate", referenced from:
      _tls_open in libavformat.a(tls_securetransport.o)
  "_SecTrustSetAnchorCertificates", referenced from:
      _tls_open in libavformat.a(tls_securetransport.o)
ld: symbol(s) not found for architecture x86_64
```

2、缺少 VideoDecodeAcceleration.framework

```
Undefined symbols for architecture x86_64:
  "_VDADecoderCreate", referenced from:
      _ff_vda_create_decoder in libavcodec.a(vda_h264.o)
      _ff_vda_default_init in libavcodec.a(vda_h264.o)
  "_VDADecoderDecode", referenced from:
      _vda_old_h264_end_frame in libavcodec.a(vda_h264.o)
      _vda_h264_end_frame in libavcodec.a(vda_h264.o)
  "_VDADecoderDestroy", referenced from:
      _ff_vda_destroy_decoder in libavcodec.a(vda_h264.o)
  "_VDADecoderFlush", referenced from:
      _vda_old_h264_end_frame in libavcodec.a(vda_h264.o)
      _vda_h264_end_frame in libavcodec.a(vda_h264.o)
  "_kVDADecoderConfiguration_Height", referenced from:
      _ff_vda_create_decoder in libavcodec.a(vda_h264.o)
      _ff_vda_default_init in libavcodec.a(vda_h264.o)
  "_kVDADecoderConfiguration_SourceFormat", referenced from:
      _ff_vda_create_decoder in libavcodec.a(vda_h264.o)
      _ff_vda_default_init in libavcodec.a(vda_h264.o)
  "_kVDADecoderConfiguration_Width", referenced from:
      _ff_vda_create_decoder in libavcodec.a(vda_h264.o)
      _ff_vda_default_init in libavcodec.a(vda_h264.o)
  "_kVDADecoderConfiguration_avcCData", referenced from:
      _ff_vda_create_decoder in libavcodec.a(vda_h264.o)
      _ff_vda_default_init in libavcodec.a(vda_h264.o)
ld: symbol(s) not found for architecture x86_64
```

3、缺少  AudioToolbox.framework

```
Undefined symbols for architecture x86_64:
  "_AudioConverterDispose", referenced from:
      _ffat_close_decoder in libavcodec.a(audiotoolboxdec.o)
      _ffat_close_encoder in libavcodec.a(audiotoolboxenc.o)
  "_AudioConverterFillComplexBuffer", referenced from:
      _ffat_decode in libavcodec.a(audiotoolboxdec.o)
      _ffat_encode in libavcodec.a(audiotoolboxenc.o)
  "_AudioConverterGetProperty", referenced from:
      _ffat_create_decoder in libavcodec.a(audiotoolboxdec.o)
      _ffat_init_encoder in libavcodec.a(audiotoolboxenc.o)
  "_AudioConverterGetPropertyInfo", referenced from:
      _ffat_create_decoder in libavcodec.a(audiotoolboxdec.o)
      _ffat_init_encoder in libavcodec.a(audiotoolboxenc.o)
  "_AudioConverterNew", referenced from:
      _ffat_create_decoder in libavcodec.a(audiotoolboxdec.o)
      _ffat_init_encoder in libavcodec.a(audiotoolboxenc.o)
  "_AudioConverterReset", referenced from:
      _ffat_decode_flush in libavcodec.a(audiotoolboxdec.o)
      _ffat_encode_flush in libavcodec.a(audiotoolboxenc.o)
  "_AudioConverterSetProperty", referenced from:
      _ffat_create_decoder in libavcodec.a(audiotoolboxdec.o)
      _ffat_init_encoder in libavcodec.a(audiotoolboxenc.o)
  "_AudioFormatGetProperty", referenced from:
      _ffat_create_decoder in libavcodec.a(audiotoolboxdec.o)
  "_AudioFormatGetPropertyInfo", referenced from:
      _ffat_create_decoder in libavcodec.a(audiotoolboxdec.o)
ld: symbol(s) not found for architecture x86_64
```

4、缺少 CoreMedia.framework

```
Undefined symbols for architecture x86_64:
  "_CMBlockBufferCopyDataBytes", referenced from:
      _vtenc_frame in libavcodec.a(videotoolboxenc.o)
  "_CMBlockBufferCreateWithMemoryBlock", referenced from:
      _videotoolbox_common_end_frame in libavcodec.a(videotoolbox.o)
  "_CMSampleBufferCreate", referenced from:
      _videotoolbox_common_end_frame in libavcodec.a(videotoolbox.o)
  "_CMSampleBufferGetDataBuffer", referenced from:
      _vtenc_frame in libavcodec.a(videotoolboxenc.o)
  "_CMSampleBufferGetDecodeTimeStamp", referenced from:
      _vtenc_frame in libavcodec.a(videotoolboxenc.o)
  "_CMSampleBufferGetFormatDescription", referenced from:
      _vtenc_frame in libavcodec.a(videotoolboxenc.o)
      _vtenc_output_callback in libavcodec.a(videotoolboxenc.o)
  "_CMSampleBufferGetPresentationTimeStamp", referenced from:
      _vtenc_frame in libavcodec.a(videotoolboxenc.o)
  "_CMSampleBufferGetSampleAttachmentsArray", referenced from:
      _vtenc_frame in libavcodec.a(videotoolboxenc.o)
  "_CMSampleBufferGetTotalSampleSize", referenced from:
      _vtenc_frame in libavcodec.a(videotoolboxenc.o)
  "_CMTimeMake", referenced from:
      _vtenc_send_frame in libavcodec.a(videotoolboxenc.o)
  "_CMVideoFormatDescriptionCreate", referenced from:
      _av_videotoolbox_default_init2 in libavcodec.a(videotoolbox.o)
  "_CMVideoFormatDescriptionGetH264ParameterSetAtIndex", referenced from:
      _vtenc_frame in libavcodec.a(videotoolboxenc.o)
      _get_params_size in libavcodec.a(videotoolboxenc.o)
      _copy_param_sets in libavcodec.a(videotoolboxenc.o)
  "_kCMFormatDescriptionExtension_SampleDescriptionExtensionAtoms", referenced from:
      _av_videotoolbox_default_init2 in libavcodec.a(videotoolbox.o)
  "_kCMSampleAttachmentKey_NotSync", referenced from:
      _vtenc_frame in libavcodec.a(videotoolboxenc.o)
  "_kCMTimeIndefinite", referenced from:
      _vtenc_init in libavcodec.a(videotoolboxenc.o)
      _vtenc_frame in libavcodec.a(videotoolboxenc.o)
  "_kCMTimeInvalid", referenced from:
      _vtenc_send_frame in libavcodec.a(videotoolboxenc.o)
ld: symbol(s) not found for architecture x86_64
```

5、缺少 CoreFoundation.framework

```
Undefined symbols for architecture x86_64:
  "_CFArrayCreateMutableCopy", referenced from:
      _tls_open in libavformat.a(tls_securetransport.o)
  "_CFArrayGetCount", referenced from:
      _vtenc_frame in libavcodec.a(videotoolboxenc.o)
      _import_pem in libavformat.a(tls_securetransport.o)
  "_CFArrayGetValueAtIndex", referenced from:
      _vtenc_frame in libavcodec.a(videotoolboxenc.o)
      _tls_open in libavformat.a(tls_securetransport.o)
  "_CFArraySetValueAtIndex", referenced from:
      _tls_open in libavformat.a(tls_securetransport.o)
  "_CFBooleanGetValue", referenced from:
      _vtenc_init in libavcodec.a(videotoolboxenc.o)
      _vtenc_frame in libavcodec.a(videotoolboxenc.o)
  "_CFDataCreate", referenced from:
      _ff_videotoolbox_avcc_extradata_create in libavcodec.a(videotoolbox.o)
      _av_videotoolbox_default_init2 in libavcodec.a(videotoolbox.o)
      _ff_vda_create_decoder in libavcodec.a(vda_h264.o)
      _vda_old_h264_end_frame in libavcodec.a(vda_h264.o)
      _vda_h264_end_frame in libavcodec.a(vda_h264.o)
      _import_pem in libavformat.a(tls_securetransport.o)
  "_CFDictionaryCreate", referenced from:
      _vtenc_send_frame in libavcodec.a(videotoolboxenc.o)
  "_CFDictionaryCreateMutable", referenced from:
      _av_videotoolbox_default_init2 in libavcodec.a(videotoolbox.o)
      _ff_vda_create_decoder in libavcodec.a(vda_h264.o)
      _ff_vda_default_init in libavcodec.a(vda_h264.o)
      _vtenc_init in libavcodec.a(videotoolboxenc.o)
      _vtenc_create_encoder in libavcodec.a(videotoolboxenc.o)
      _vtenc_send_frame in libavcodec.a(videotoolboxenc.o)
  "_CFDictionaryGetValueIfPresent", referenced from:
      _vtenc_frame in libavcodec.a(videotoolboxenc.o)
  "_CFDictionarySetValue", referenced from:
      _av_videotoolbox_default_init2 in libavcodec.a(videotoolbox.o)
      _ff_vda_create_decoder in libavcodec.a(vda_h264.o)
      _ff_vda_default_init in libavcodec.a(vda_h264.o)
      _vtenc_init in libavcodec.a(videotoolboxenc.o)
      _vtenc_create_encoder in libavcodec.a(videotoolboxenc.o)
      _vtenc_send_frame in libavcodec.a(videotoolboxenc.o)
  "_CFNumberCreate", referenced from:
      _av_videotoolbox_default_init2 in libavcodec.a(videotoolbox.o)
      _ff_vda_create_decoder in libavcodec.a(vda_h264.o)
      _ff_vda_default_init in libavcodec.a(vda_h264.o)
      _vtenc_init in libavcodec.a(videotoolboxenc.o)
      _vtenc_create_encoder in libavcodec.a(videotoolboxenc.o)
  "_CFRelease", referenced from:
      _av_videotoolbox_default_init2 in libavcodec.a(videotoolbox.o)
      _av_videotoolbox_default_free in libavcodec.a(videotoolbox.o)
      _videotoolbox_common_end_frame in libavcodec.a(videotoolbox.o)
      _ff_vda_create_decoder in libavcodec.a(vda_h264.o)
      _vda_old_h264_end_frame in libavcodec.a(vda_h264.o)
      _ff_vda_default_init in libavcodec.a(vda_h264.o)
      _vda_h264_end_frame in libavcodec.a(vda_h264.o)
      ...
  "_CFRetain", referenced from:
      _vtenc_send_frame in libavcodec.a(videotoolboxenc.o)
      _vtenc_output_callback in libavcodec.a(videotoolboxenc.o)
      _tls_open in libavformat.a(tls_securetransport.o)
  "_CFStringCreateWithCString", referenced from:
      _import_pem in libavformat.a(tls_securetransport.o)
  "___CFConstantStringClassReference", referenced from:
      CFString in libavcodec.a(videotoolbox.o)
      CFString in libavcodec.a(videotoolbox.o)
      CFString in libavcodec.a(videotoolbox.o)
  "_kCFAllocatorDefault", referenced from:
      _ff_videotoolbox_avcc_extradata_create in libavcodec.a(videotoolbox.o)
      _av_videotoolbox_default_init2 in libavcodec.a(videotoolbox.o)
      _videotoolbox_common_end_frame in libavcodec.a(videotoolbox.o)
      _ff_vda_create_decoder in libavcodec.a(vda_h264.o)
      _vda_old_h264_end_frame in libavcodec.a(vda_h264.o)
      _ff_vda_default_init in libavcodec.a(vda_h264.o)
      _vda_h264_end_frame in libavcodec.a(vda_h264.o)
      ...
  "_kCFAllocatorNull", referenced from:
      _videotoolbox_common_end_frame in libavcodec.a(videotoolbox.o)
  "_kCFBooleanFalse", referenced from:
      _vtenc_create_encoder in libavcodec.a(videotoolboxenc.o)
  "_kCFBooleanTrue", referenced from:
      _av_videotoolbox_default_init2 in libavcodec.a(videotoolbox.o)
      _vtenc_init in libavcodec.a(videotoolboxenc.o)
      _vtenc_create_encoder in libavcodec.a(videotoolboxenc.o)
      _vtenc_send_frame in libavcodec.a(videotoolboxenc.o)
  "_kCFCopyStringDictionaryKeyCallBacks", referenced from:
      _vtenc_init in libavcodec.a(videotoolboxenc.o)
      _vtenc_create_encoder in libavcodec.a(videotoolboxenc.o)
      _vtenc_send_frame in libavcodec.a(videotoolboxenc.o)
  "_kCFCoreFoundationVersionNumber", referenced from:
      _vdadec_init in libavcodec.a(vda_h264_dec.o)
  "_kCFTypeDictionaryKeyCallBacks", referenced from:
      _av_videotoolbox_default_init2 in libavcodec.a(videotoolbox.o)
      _ff_vda_create_decoder in libavcodec.a(vda_h264.o)
      _ff_vda_default_init in libavcodec.a(vda_h264.o)
  "_kCFTypeDictionaryValueCallBacks", referenced from:
      _av_videotoolbox_default_init2 in libavcodec.a(videotoolbox.o)
      _ff_vda_create_decoder in libavcodec.a(vda_h264.o)
      _ff_vda_default_init in libavcodec.a(vda_h264.o)
      _vtenc_init in libavcodec.a(videotoolboxenc.o)
      _vtenc_create_encoder in libavcodec.a(videotoolboxenc.o)
      _vtenc_send_frame in libavcodec.a(videotoolboxenc.o)
ld: symbol(s) not found for architecture x86_64
```

6、缺少 CoreVideo.framework

```
Undefined symbols for architecture x86_64:
  "_CVBufferSetAttachments", referenced from:
      _vtenc_send_frame in libavcodec.a(videotoolboxenc.o)
  "_CVPixelBufferCreateWithPlanarBytes", referenced from:
      _vtenc_send_frame in libavcodec.a(videotoolboxenc.o)
  "_CVPixelBufferGetBaseAddress", referenced from:
      _vdadec_decode in libavcodec.a(vda_h264_dec.o)
  "_CVPixelBufferGetBaseAddressOfPlane", referenced from:
      _vdadec_decode in libavcodec.a(vda_h264_dec.o)
  "_CVPixelBufferGetBytesPerRow", referenced from:
      _vdadec_decode in libavcodec.a(vda_h264_dec.o)
  "_CVPixelBufferGetBytesPerRowOfPlane", referenced from:
      _vdadec_decode in libavcodec.a(vda_h264_dec.o)
  "_CVPixelBufferGetPixelFormatType", referenced from:
      _vda_decoder_callback in libavcodec.a(vda_h264.o)
  "_CVPixelBufferGetPlaneCount", referenced from:
      _vdadec_decode in libavcodec.a(vda_h264_dec.o)
  "_CVPixelBufferIsPlanar", referenced from:
      _vdadec_decode in libavcodec.a(vda_h264_dec.o)
  "_CVPixelBufferLockBaseAddress", referenced from:
      _vdadec_decode in libavcodec.a(vda_h264_dec.o)
  "_CVPixelBufferRelease", referenced from:
      _videotoolbox_buffer_release in libavcodec.a(videotoolbox.o)
      _ff_videotoolbox_uninit in libavcodec.a(videotoolbox.o)
      _videotoolbox_decoder_callback in libavcodec.a(videotoolbox.o)
      _release_buffer in libavcodec.a(vda_h264_dec.o)
      _vda_old_h264_end_frame in libavcodec.a(vda_h264.o)
      _ff_vda_output_callback in libavcodec.a(vda_h264.o)
      _vda_h264_release_buffer in libavcodec.a(vda_h264.o)
      ...
  "_CVPixelBufferRetain", referenced from:
      _videotoolbox_decoder_callback in libavcodec.a(videotoolbox.o)
      _vdadec_decode in libavcodec.a(vda_h264_dec.o)
      _vda_decoder_callback in libavcodec.a(vda_h264.o)
      _ff_vda_output_callback in libavcodec.a(vda_h264.o)
  "_CVPixelBufferUnlockBaseAddress", referenced from:
      _release_buffer in libavcodec.a(vda_h264_dec.o)
  "_kCVImageBufferColorPrimariesKey", referenced from:
      _vtenc_init in libavcodec.a(videotoolboxenc.o)
      _vtenc_send_frame in libavcodec.a(videotoolboxenc.o)
  "_kCVImageBufferColorPrimaries_ITU_R_2020", referenced from:
      _vtenc_init in libavcodec.a(videotoolboxenc.o)
  "_kCVImageBufferColorPrimaries_ITU_R_709_2", referenced from:
      _vtenc_init in libavcodec.a(videotoolboxenc.o)
  "_kCVImageBufferGammaLevelKey", referenced from:
      _vtenc_create_encoder in libavcodec.a(videotoolboxenc.o)
  "_kCVImageBufferPixelAspectRatioHorizontalSpacingKey", referenced from:
      _vtenc_create_encoder in libavcodec.a(videotoolboxenc.o)
  "_kCVImageBufferPixelAspectRatioVerticalSpacingKey", referenced from:
      _vtenc_create_encoder in libavcodec.a(videotoolboxenc.o)
  "_kCVImageBufferTransferFunctionKey", referenced from:
      _vtenc_init in libavcodec.a(videotoolboxenc.o)
      _vtenc_send_frame in libavcodec.a(videotoolboxenc.o)
  "_kCVImageBufferTransferFunction_ITU_R_2020", referenced from:
      _vtenc_init in libavcodec.a(videotoolboxenc.o)
  "_kCVImageBufferTransferFunction_ITU_R_709_2", referenced from:
      _vtenc_init in libavcodec.a(videotoolboxenc.o)
  "_kCVImageBufferTransferFunction_SMPTE_240M_1995", referenced from:
      _vtenc_init in libavcodec.a(videotoolboxenc.o)
  "_kCVImageBufferTransferFunction_UseGamma", referenced from:
      _vtenc_init in libavcodec.a(videotoolboxenc.o)
  "_kCVImageBufferYCbCrMatrixKey", referenced from:
      _vtenc_init in libavcodec.a(videotoolboxenc.o)
      _vtenc_send_frame in libavcodec.a(videotoolboxenc.o)
  "_kCVImageBufferYCbCrMatrix_ITU_R_2020", referenced from:
      _vtenc_init in libavcodec.a(videotoolboxenc.o)
  "_kCVImageBufferYCbCrMatrix_ITU_R_601_4", referenced from:
      _vtenc_init in libavcodec.a(videotoolboxenc.o)
  "_kCVImageBufferYCbCrMatrix_ITU_R_709_2", referenced from:
      _vtenc_init in libavcodec.a(videotoolboxenc.o)
  "_kCVImageBufferYCbCrMatrix_SMPTE_240M_1995", referenced from:
      _vtenc_init in libavcodec.a(videotoolboxenc.o)
  "_kCVPixelBufferHeightKey", referenced from:
      _av_videotoolbox_default_init2 in libavcodec.a(videotoolbox.o)
      _vtenc_init in libavcodec.a(videotoolboxenc.o)
  "_kCVPixelBufferIOSurfacePropertiesKey", referenced from:
      _av_videotoolbox_default_init2 in libavcodec.a(videotoolbox.o)
      _ff_vda_create_decoder in libavcodec.a(vda_h264.o)
      _ff_vda_default_init in libavcodec.a(vda_h264.o)
  "_kCVPixelBufferPixelFormatTypeKey", referenced from:
      _av_videotoolbox_default_init2 in libavcodec.a(videotoolbox.o)
      _ff_vda_create_decoder in libavcodec.a(vda_h264.o)
      _ff_vda_default_init in libavcodec.a(vda_h264.o)
      _vtenc_init in libavcodec.a(videotoolboxenc.o)
  "_kCVPixelBufferWidthKey", referenced from:
      _av_videotoolbox_default_init2 in libavcodec.a(videotoolbox.o)
      _vtenc_init in libavcodec.a(videotoolboxenc.o)
ld: symbol(s) not found for architecture x86_64
```

7、缺少 VideoToolbox.framework

```
Undefined symbols for architecture x86_64:
  "_VTCompressionSessionCompleteFrames", referenced from:
      _vtenc_init in libavcodec.a(videotoolboxenc.o)
      _vtenc_frame in libavcodec.a(videotoolboxenc.o)
  "_VTCompressionSessionCreate", referenced from:
      _vtenc_create_encoder in libavcodec.a(videotoolboxenc.o)
  "_VTCompressionSessionEncodeFrame", referenced from:
      _vtenc_send_frame in libavcodec.a(videotoolboxenc.o)
  "_VTCompressionSessionPrepareToEncodeFrames", referenced from:
      _vtenc_create_encoder in libavcodec.a(videotoolboxenc.o)
  "_VTDecompressionSessionCreate", referenced from:
      _av_videotoolbox_default_init2 in libavcodec.a(videotoolbox.o)
  "_VTDecompressionSessionDecodeFrame", referenced from:
      _videotoolbox_common_end_frame in libavcodec.a(videotoolbox.o)
  "_VTDecompressionSessionInvalidate", referenced from:
      _av_videotoolbox_default_free in libavcodec.a(videotoolbox.o)
  "_VTDecompressionSessionWaitForAsynchronousFrames", referenced from:
      _videotoolbox_common_end_frame in libavcodec.a(videotoolbox.o)
  "_VTSessionCopyProperty", referenced from:
      _vtenc_init in libavcodec.a(videotoolboxenc.o)
  "_VTSessionSetProperty", referenced from:
      _vtenc_create_encoder in libavcodec.a(videotoolboxenc.o)
  "_kVTCompressionPropertyKey_AllowFrameReordering", referenced from:
      _vtenc_init in libavcodec.a(videotoolboxenc.o)
      _vtenc_create_encoder in libavcodec.a(videotoolboxenc.o)
  "_kVTCompressionPropertyKey_AverageBitRate", referenced from:
      _vtenc_create_encoder in libavcodec.a(videotoolboxenc.o)
  "_kVTCompressionPropertyKey_ColorPrimaries", referenced from:
      _vtenc_create_encoder in libavcodec.a(videotoolboxenc.o)
  "_kVTCompressionPropertyKey_H264EntropyMode", referenced from:
      _vtenc_create_encoder in libavcodec.a(videotoolboxenc.o)
  "_kVTCompressionPropertyKey_MaxKeyFrameInterval", referenced from:
      _vtenc_create_encoder in libavcodec.a(videotoolboxenc.o)
  "_kVTCompressionPropertyKey_MoreFramesAfterEnd", referenced from:
      _vtenc_create_encoder in libavcodec.a(videotoolboxenc.o)
  "_kVTCompressionPropertyKey_MoreFramesBeforeStart", referenced from:
      _vtenc_create_encoder in libavcodec.a(videotoolboxenc.o)
  "_kVTCompressionPropertyKey_PixelAspectRatio", referenced from:
      _vtenc_create_encoder in libavcodec.a(videotoolboxenc.o)
  "_kVTCompressionPropertyKey_ProfileLevel", referenced from:
      _vtenc_create_encoder in libavcodec.a(videotoolboxenc.o)
  "_kVTCompressionPropertyKey_RealTime", referenced from:
      _vtenc_create_encoder in libavcodec.a(videotoolboxenc.o)
  "_kVTCompressionPropertyKey_TransferFunction", referenced from:
      _vtenc_create_encoder in libavcodec.a(videotoolboxenc.o)
  "_kVTCompressionPropertyKey_YCbCrMatrix", referenced from:
      _vtenc_create_encoder in libavcodec.a(videotoolboxenc.o)
  "_kVTEncodeFrameOptionKey_ForceKeyFrame", referenced from:
      _vtenc_send_frame in libavcodec.a(videotoolboxenc.o)
  "_kVTH264EntropyMode_CABAC", referenced from:
      _vtenc_create_encoder in libavcodec.a(videotoolboxenc.o)
  "_kVTH264EntropyMode_CAVLC", referenced from:
      _vtenc_create_encoder in libavcodec.a(videotoolboxenc.o)
  "_kVTProfileLevel_H264_Baseline_1_3", referenced from:
      _vtenc_init in libavcodec.a(videotoolboxenc.o)
  "_kVTProfileLevel_H264_Baseline_3_0", referenced from:
      _vtenc_init in libavcodec.a(videotoolboxenc.o)
  "_kVTProfileLevel_H264_Baseline_3_1", referenced from:
      _vtenc_init in libavcodec.a(videotoolboxenc.o)
  "_kVTProfileLevel_H264_Baseline_3_2", referenced from:
      _vtenc_init in libavcodec.a(videotoolboxenc.o)
  "_kVTProfileLevel_H264_Baseline_4_0", referenced from:
      _vtenc_init in libavcodec.a(videotoolboxenc.o)
  "_kVTProfileLevel_H264_Baseline_4_1", referenced from:
      _vtenc_init in libavcodec.a(videotoolboxenc.o)
  "_kVTProfileLevel_H264_Baseline_4_2", referenced from:
      _vtenc_init in libavcodec.a(videotoolboxenc.o)
  "_kVTProfileLevel_H264_Baseline_5_0", referenced from:
      _vtenc_init in libavcodec.a(videotoolboxenc.o)
  "_kVTProfileLevel_H264_Baseline_5_1", referenced from:
      _vtenc_init in libavcodec.a(videotoolboxenc.o)
  "_kVTProfileLevel_H264_Baseline_5_2", referenced from:
      _vtenc_init in libavcodec.a(videotoolboxenc.o)
  "_kVTProfileLevel_H264_Baseline_AutoLevel", referenced from:
      _vtenc_init in libavcodec.a(videotoolboxenc.o)
  "_kVTProfileLevel_H264_High_3_0", referenced from:
      _vtenc_init in libavcodec.a(videotoolboxenc.o)
  "_kVTProfileLevel_H264_High_3_1", referenced from:
      _vtenc_init in libavcodec.a(videotoolboxenc.o)
  "_kVTProfileLevel_H264_High_3_2", referenced from:
      _vtenc_init in libavcodec.a(videotoolboxenc.o)
  "_kVTProfileLevel_H264_High_4_0", referenced from:
      _vtenc_init in libavcodec.a(videotoolboxenc.o)
  "_kVTProfileLevel_H264_High_4_1", referenced from:
      _vtenc_init in libavcodec.a(videotoolboxenc.o)
  "_kVTProfileLevel_H264_High_4_2", referenced from:
      _vtenc_init in libavcodec.a(videotoolboxenc.o)
  "_kVTProfileLevel_H264_High_5_0", referenced from:
      _vtenc_init in libavcodec.a(videotoolboxenc.o)
  "_kVTProfileLevel_H264_High_5_1", referenced from:
      _vtenc_init in libavcodec.a(videotoolboxenc.o)
  "_kVTProfileLevel_H264_High_5_2", referenced from:
      _vtenc_init in libavcodec.a(videotoolboxenc.o)
  "_kVTProfileLevel_H264_High_AutoLevel", referenced from:
      _vtenc_init in libavcodec.a(videotoolboxenc.o)
  "_kVTProfileLevel_H264_Main_3_0", referenced from:
      _vtenc_init in libavcodec.a(videotoolboxenc.o)
  "_kVTProfileLevel_H264_Main_3_1", referenced from:
      _vtenc_init in libavcodec.a(videotoolboxenc.o)
  "_kVTProfileLevel_H264_Main_3_2", referenced from:
      _vtenc_init in libavcodec.a(videotoolboxenc.o)
  "_kVTProfileLevel_H264_Main_4_0", referenced from:
      _vtenc_init in libavcodec.a(videotoolboxenc.o)
  "_kVTProfileLevel_H264_Main_4_1", referenced from:
      _vtenc_init in libavcodec.a(videotoolboxenc.o)
  "_kVTProfileLevel_H264_Main_4_2", referenced from:
      _vtenc_init in libavcodec.a(videotoolboxenc.o)
  "_kVTProfileLevel_H264_Main_5_0", referenced from:
      _vtenc_init in libavcodec.a(videotoolboxenc.o)
  "_kVTProfileLevel_H264_Main_5_1", referenced from:
      _vtenc_init in libavcodec.a(videotoolboxenc.o)
  "_kVTProfileLevel_H264_Main_5_2", referenced from:
      _vtenc_init in libavcodec.a(videotoolboxenc.o)
  "_kVTProfileLevel_H264_Main_AutoLevel", referenced from:
      _vtenc_init in libavcodec.a(videotoolboxenc.o)
  "_kVTVideoEncoderSpecification_EnableHardwareAcceleratedVideoEncoder", referenced from:
      _vtenc_init in libavcodec.a(videotoolboxenc.o)
  "_kVTVideoEncoderSpecification_RequireHardwareAcceleratedVideoEncoder", referenced from:
      _vtenc_init in libavcodec.a(videotoolboxenc.o)
ld: symbol(s) not found for architecture x86_64
```

8、缺少 libz.tbd

```
Undefined symbols for architecture x86_64:
  "_compress", referenced from:
      _encode_strip in libavcodec.a(tiffenc.o)
  "_compress2", referenced from:
      _flashsv2_encode_frame in libavcodec.a(flashsv2enc.o)
      _flashsv_encode_frame in libavcodec.a(flashsvenc.o)
  "_deflate", referenced from:
      _encode_frame in libavcodec.a(pngenc.o)
      _flashsv_decode_frame in libavcodec.a(flashsv.o)
      _flashsv2_encode_frame in libavcodec.a(flashsv2enc.o)
      _encode_frame in libavcodec.a(lclenc.o)
      _encode_frame in libavcodec.a(zmbvenc.o)
  "_deflateBound", referenced from:
      _encode_png in libavcodec.a(pngenc.o)
      _encode_apng in libavcodec.a(pngenc.o)
      _flashsv_decode_frame in libavcodec.a(flashsv.o)
      _encode_frame in libavcodec.a(lclenc.o)
  "_deflateEnd", referenced from:
      _png_enc_close in libavcodec.a(pngenc.o)
      _flashsv_decode_frame in libavcodec.a(flashsv.o)
      _flashsv2_encode_frame in libavcodec.a(flashsv2enc.o)
      _flashsv_encode_end in libavcodec.a(flashsvenc.o)
      _encode_end in libavcodec.a(lclenc.o)
      _encode_end in libavcodec.a(zmbvenc.o)
  "_deflateInit2_", referenced from:
      _png_enc_init in libavcodec.a(pngenc.o)
  "_deflateInit_", referenced from:
      _flashsv_decode_frame in libavcodec.a(flashsv.o)
      _flashsv2_encode_frame in libavcodec.a(flashsv2enc.o)
      _encode_init in libavcodec.a(lclenc.o)
      _encode_init in libavcodec.a(zmbvenc.o)
  "_deflateReset", referenced from:
      _encode_frame in libavcodec.a(pngenc.o)
      _encode_frame in libavcodec.a(lclenc.o)
      _encode_frame in libavcodec.a(zmbvenc.o)
  "_inflate", referenced from:
      _matroska_decode_buffer in libavformat.a(matroskadec.o)
      _zlib_refill in libavformat.a(swfdec.o)
      _decode_frame_common in libavcodec.a(pngdec.o)
      _decode_text_chunk in libavcodec.a(pngdec.o)
      _flashsv_decode_frame in libavcodec.a(flashsv.o)
      _http_read_stream in libavformat.a(http.o)
      _zlib_decomp in libavcodec.a(lcldec.o)
      ...
  "_inflateEnd", referenced from:
      _matroska_decode_buffer in libavformat.a(matroskadec.o)
      _swf_read_close in libavformat.a(swfdec.o)
      _decode_frame_apng in libavcodec.a(pngdec.o)
      _decode_frame_png in libavcodec.a(pngdec.o)
      _decode_text_chunk in libavcodec.a(pngdec.o)
      _flashsv_decode_init in libavcodec.a(flashsv.o)
      _flashsv_decode_end in libavcodec.a(flashsv.o)
      ...
  "_inflateInit2_", referenced from:
      _http_read_header in libavformat.a(http.o)
  "_inflateInit_", referenced from:
      _matroska_decode_buffer in libavformat.a(matroskadec.o)
      _swf_read_header in libavformat.a(swfdec.o)
      _decode_frame_apng in libavcodec.a(pngdec.o)
      _decode_frame_png in libavcodec.a(pngdec.o)
      _decode_text_chunk in libavcodec.a(pngdec.o)
      _flashsv_decode_init in libavcodec.a(flashsv.o)
      _flashsv2_decode_init in libavcodec.a(flashsv.o)
      ...
  "_inflateReset", referenced from:
      _flashsv_decode_frame in libavcodec.a(flashsv.o)
      _zlib_decomp in libavcodec.a(lcldec.o)
      _decode_frame in libavcodec.a(tscc.o)
      _zerocodec_decode_frame in libavcodec.a(zerocodec.o)
      _decode_frame in libavcodec.a(zmbv.o)
  "_inflateSync", referenced from:
      _flashsv_decode_frame in libavcodec.a(flashsv.o)
  "_uncompress", referenced from:
      _id3v2_read_internal in libavformat.a(id3v2.o)
      _mov_read_cmov in libavformat.a(mov.o)
      _swf_read_packet in libavformat.a(swfdec.o)
      _decode_frame in libavcodec.a(cscd.o)
      _decode_frame in libavcodec.a(dxa.o)
      _decode_block in libavcodec.a(exr.o)
      _g2m_decode_frame in libavcodec.a(g2meet.o)
      ...
     (maybe you meant: _ff_snappy_peek_uncompressed_length, _ff_snappy_uncompress , _ff_lzf_uncompress )
  "_zlibCompileFlags", referenced from:
      _http_read_header in libavformat.a(http.o)
ld: symbol(s) not found for architecture x86_64
clang: error: linker command failed with exit code 1 (use -v to see invocation)
```

9、缺少 liblzma.tbd

```
Undefined symbols for architecture x86_64:
  "_lzma_code", referenced from:
      _decode_frame in libavcodec.a(tiff.o)
  "_lzma_end", referenced from:
      _decode_frame in libavcodec.a(tiff.o)
  "_lzma_stream_decoder", referenced from:
      _decode_frame in libavcodec.a(tiff.o)
ld: symbol(s) not found for architecture x86_64
clang: error: linker command failed with exit code 1 (use -v to see invocation)
```

10、缺少 libbz2.tbd

```
Undefined symbols for architecture x86_64:
  "_BZ2_bzDecompress", referenced from:
      _matroska_decode_buffer in libavformat.a(matroskadec.o)
  "_BZ2_bzDecompressEnd", referenced from:
      _matroska_decode_buffer in libavformat.a(matroskadec.o)
  "_BZ2_bzDecompressInit", referenced from:
      _matroska_decode_buffer in libavformat.a(matroskadec.o)
ld: symbol(s) not found for architecture x86_64
```

11、缺少 libiconv.tbd

```
Undefined symbols for architecture x86_64:
  "_iconv", referenced from:
      _avcodec_decode_subtitle2 in libavcodec.a(utils.o)
  "_iconv_close", referenced from:
      _avcodec_open2 in libavcodec.a(utils.o)
      _avcodec_decode_subtitle2 in libavcodec.a(utils.o)
  "_iconv_open", referenced from:
      _avcodec_open2 in libavcodec.a(utils.o)
      _avcodec_decode_subtitle2 in libavcodec.a(utils.o)
ld: symbol(s) not found for architecture x86_64
```

12、缺少 libz.tbd

```
Undefined symbols for architecture x86_64:
  "_compress", referenced from:
      _encode_strip in libavcodec.a(tiffenc.o)
  "_compress2", referenced from:
      _flashsv2_encode_frame in libavcodec.a(flashsv2enc.o)
      _flashsv_encode_frame in libavcodec.a(flashsvenc.o)
  "_deflate", referenced from:
      _encode_frame in libavcodec.a(pngenc.o)
      _flashsv_decode_frame in libavcodec.a(flashsv.o)
      _flashsv2_encode_frame in libavcodec.a(flashsv2enc.o)
      _encode_frame in libavcodec.a(lclenc.o)
      _encode_frame in libavcodec.a(zmbvenc.o)
  "_deflateBound", referenced from:
      _encode_png in libavcodec.a(pngenc.o)
      _encode_apng in libavcodec.a(pngenc.o)
      _flashsv_decode_frame in libavcodec.a(flashsv.o)
      _encode_frame in libavcodec.a(lclenc.o)
  "_deflateEnd", referenced from:
      _png_enc_close in libavcodec.a(pngenc.o)
      _flashsv_decode_frame in libavcodec.a(flashsv.o)
      _flashsv2_encode_frame in libavcodec.a(flashsv2enc.o)
      _flashsv_encode_end in libavcodec.a(flashsvenc.o)
      _encode_end in libavcodec.a(lclenc.o)
      _encode_end in libavcodec.a(zmbvenc.o)
  "_deflateInit2_", referenced from:
      _png_enc_init in libavcodec.a(pngenc.o)
  "_deflateInit_", referenced from:
      _flashsv_decode_frame in libavcodec.a(flashsv.o)
      _flashsv2_encode_frame in libavcodec.a(flashsv2enc.o)
      _encode_init in libavcodec.a(lclenc.o)
      _encode_init in libavcodec.a(zmbvenc.o)
  "_deflateReset", referenced from:
      _encode_frame in libavcodec.a(pngenc.o)
      _encode_frame in libavcodec.a(lclenc.o)
      _encode_frame in libavcodec.a(zmbvenc.o)
  "_inflate", referenced from:
      _matroska_decode_buffer in libavformat.a(matroskadec.o)
      _zlib_refill in libavformat.a(swfdec.o)
      _decode_frame_common in libavcodec.a(pngdec.o)
      _decode_text_chunk in libavcodec.a(pngdec.o)
      _flashsv_decode_frame in libavcodec.a(flashsv.o)
      _http_read_stream in libavformat.a(http.o)
      _zlib_decomp in libavcodec.a(lcldec.o)
      ...
  "_inflateEnd", referenced from:
      _matroska_decode_buffer in libavformat.a(matroskadec.o)
      _swf_read_close in libavformat.a(swfdec.o)
      _decode_frame_apng in libavcodec.a(pngdec.o)
      _decode_frame_png in libavcodec.a(pngdec.o)
      _decode_text_chunk in libavcodec.a(pngdec.o)
      _flashsv_decode_init in libavcodec.a(flashsv.o)
      _flashsv_decode_end in libavcodec.a(flashsv.o)
      ...
  "_inflateInit2_", referenced from:
      _http_read_header in libavformat.a(http.o)
  "_inflateInit_", referenced from:
      _matroska_decode_buffer in libavformat.a(matroskadec.o)
      _swf_read_header in libavformat.a(swfdec.o)
      _decode_frame_apng in libavcodec.a(pngdec.o)
      _decode_frame_png in libavcodec.a(pngdec.o)
      _decode_text_chunk in libavcodec.a(pngdec.o)
      _flashsv_decode_init in libavcodec.a(flashsv.o)
      _flashsv2_decode_init in libavcodec.a(flashsv.o)
      ...
  "_inflateReset", referenced from:
      _flashsv_decode_frame in libavcodec.a(flashsv.o)
      _zlib_decomp in libavcodec.a(lcldec.o)
      _decode_frame in libavcodec.a(tscc.o)
      _zerocodec_decode_frame in libavcodec.a(zerocodec.o)
      _decode_frame in libavcodec.a(zmbv.o)
  "_inflateSync", referenced from:
      _flashsv_decode_frame in libavcodec.a(flashsv.o)
  "_uncompress", referenced from:
      _id3v2_read_internal in libavformat.a(id3v2.o)
      _mov_read_cmov in libavformat.a(mov.o)
      _swf_read_packet in libavformat.a(swfdec.o)
      _decode_frame in libavcodec.a(cscd.o)
      _decode_frame in libavcodec.a(dxa.o)
      _decode_block in libavcodec.a(exr.o)
      _g2m_decode_frame in libavcodec.a(g2meet.o)
      ...
     (maybe you meant: _ff_snappy_peek_uncompressed_length, _ff_snappy_uncompress , _ff_lzf_uncompress )
  "_zlibCompileFlags", referenced from:
      _http_read_header in libavformat.a(http.o)
ld: symbol(s) not found for architecture x86_64
```