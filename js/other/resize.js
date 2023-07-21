var scripts=document.getElementsByTagName("script"),sourceOfWorker=scripts[scripts.length-1].src;function Resize(i,t,e,h,s,r,l,n){this.widthOriginal=Math.abs(parseInt(i)||0),this.heightOriginal=Math.abs(parseInt(t)||0),this.targetWidth=Math.abs(parseInt(e)||0),this.targetHeight=Math.abs(parseInt(h)||0),this.colorChannels=s?4:3,this.interpolationPass=!!r,this.useWebWorker=!!l,this.resizeCallback="function"==typeof n?n:function(i){},this.targetWidthMultipliedByChannels=this.targetWidth*this.colorChannels,this.originalWidthMultipliedByChannels=this.widthOriginal*this.colorChannels,this.originalHeightMultipliedByChannels=this.heightOriginal*this.colorChannels,this.widthPassResultSize=this.targetWidthMultipliedByChannels*this.heightOriginal,this.finalResultSize=this.targetWidthMultipliedByChannels*this.targetHeight,this.initialize()}Resize.prototype.initialize=function(){if(this.widthOriginal>0&&this.heightOriginal>0&&this.targetWidth>0&&this.targetHeight>0)this.useWebWorker&&(this.useWebWorker=this.widthOriginal!=this.targetWidth||this.heightOriginal!=this.targetHeight,this.useWebWorker&&this.configureWorker()),this.useWebWorker||this.configurePasses();else throw Error("Invalid settings specified for the resizer.")},Resize.prototype.configureWorker=function(){try{var i=this;this.worker=new Worker(sourceOfWorker.substring(0,sourceOfWorker.length-3)+"Worker.js"),this.worker.onmessage=function(t){i.heightBuffer=t.data,i.resizeCallback(i.heightBuffer)},this.worker.postMessage(["setup",this.widthOriginal,this.heightOriginal,this.targetWidth,this.targetHeight,this.colorChannels,this.interpolationPass])}catch(t){this.useWebWorker=!1}},Resize.prototype.configurePasses=function(){this.widthOriginal==this.targetWidth?this.resizeWidth=this.bypassResizer:(this.ratioWeightWidthPass=this.widthOriginal/this.targetWidth,this.ratioWeightWidthPass<1&&this.interpolationPass?(this.initializeFirstPassBuffers(!0),this.resizeWidth=4==this.colorChannels?this.resizeWidthInterpolatedRGBA:this.resizeWidthInterpolatedRGB):(this.initializeFirstPassBuffers(!1),this.resizeWidth=4==this.colorChannels?this.resizeWidthRGBA:this.resizeWidthRGB)),this.heightOriginal==this.targetHeight?this.resizeHeight=this.bypassResizer:(this.ratioWeightHeightPass=this.heightOriginal/this.targetHeight,this.ratioWeightHeightPass<1&&this.interpolationPass?(this.initializeSecondPassBuffers(!0),this.resizeHeight=this.resizeHeightInterpolated):(this.initializeSecondPassBuffers(!1),this.resizeHeight=4==this.colorChannels?this.resizeHeightRGBA:this.resizeHeightRGB))},Resize.prototype.resizeWidthRGB=function(i){var t=this.ratioWeightWidthPass,e=1/t,h=0,s=0,r=0,l=0,n=0,a=0,o=0,d=this.originalWidthMultipliedByChannels-2,g=this.targetWidthMultipliedByChannels-2,u=this.outputWidthWorkBench,f=this.widthBuffer;do{for(n=0;n<this.originalHeightMultipliedByChannels;)u[n++]=0,u[n++]=0,u[n++]=0;h=t;do if(h>=(s=1+r-l)){for(n=0,a=r;n<this.originalHeightMultipliedByChannels;a+=d)u[n++]+=i[a++]*s,u[n++]+=i[a++]*s,u[n++]+=i[a]*s;l=r+=3,h-=s}else{for(n=0,a=r;n<this.originalHeightMultipliedByChannels;a+=d)u[n++]+=i[a++]*h,u[n++]+=i[a++]*h,u[n++]+=i[a]*h;l+=h;break}while(h>0&&r<this.originalWidthMultipliedByChannels);for(n=0,a=o;n<this.originalHeightMultipliedByChannels;a+=g)f[a++]=u[n++]*e,f[a++]=u[n++]*e,f[a]=u[n++]*e;o+=3}while(o<this.targetWidthMultipliedByChannels);return f},Resize.prototype.resizeWidthInterpolatedRGB=function(i){for(var t=this.ratioWeightWidthPass,e=0,h=0,s=0,r=0,l=0,n=this.widthBuffer,a=0;e<1/3;a+=3,e+=t)for(h=a,s=0;h<this.widthPassResultSize;s+=this.originalWidthMultipliedByChannels,h+=this.targetWidthMultipliedByChannels)n[h]=i[s],n[h+1]=i[s+1],n[h+2]=i[s+2];e-=1/3;for(var o=this.widthOriginal-1;e<o;a+=3,e+=t)for(r=1-(l=e%1),h=a,s=3*Math.floor(e);h<this.widthPassResultSize;s+=this.originalWidthMultipliedByChannels,h+=this.targetWidthMultipliedByChannels)n[h]=i[s]*r+i[s+3]*l,n[h+1]=i[s+1]*r+i[s+4]*l,n[h+2]=i[s+2]*r+i[s+5]*l;for(o=this.originalWidthMultipliedByChannels-3;a<this.targetWidthMultipliedByChannels;a+=3)for(h=a,s=o;h<this.widthPassResultSize;s+=this.originalWidthMultipliedByChannels,h+=this.targetWidthMultipliedByChannels)n[h]=i[s],n[h+1]=i[s+1],n[h+2]=i[s+2];return n},Resize.prototype.resizeWidthRGBA=function(i){var t=this.ratioWeightWidthPass,e=1/t,h=0,s=0,r=0,l=0,n=0,a=0,o=0,d=this.originalWidthMultipliedByChannels-3,g=this.targetWidthMultipliedByChannels-3,u=this.outputWidthWorkBench,f=this.widthBuffer;do{for(n=0;n<this.originalHeightMultipliedByChannels;)u[n++]=0,u[n++]=0,u[n++]=0,u[n++]=0;h=t;do if(h>=(s=1+r-l)){for(n=0,a=r;n<this.originalHeightMultipliedByChannels;a+=d)u[n++]+=i[a++]*s,u[n++]+=i[a++]*s,u[n++]+=i[a++]*s,u[n++]+=i[a]*s;l=r+=4,h-=s}else{for(n=0,a=r;n<this.originalHeightMultipliedByChannels;a+=d)u[n++]+=i[a++]*h,u[n++]+=i[a++]*h,u[n++]+=i[a++]*h,u[n++]+=i[a]*h;l+=h;break}while(h>0&&r<this.originalWidthMultipliedByChannels);for(n=0,a=o;n<this.originalHeightMultipliedByChannels;a+=g)f[a++]=u[n++]*e,f[a++]=u[n++]*e,f[a++]=u[n++]*e,f[a]=u[n++]*e;o+=4}while(o<this.targetWidthMultipliedByChannels);return f},Resize.prototype.resizeWidthInterpolatedRGBA=function(i){for(var t=this.ratioWeightWidthPass,e=0,h=0,s=0,r=0,l=0,n=this.widthBuffer,a=0;e<1/3;a+=4,e+=t)for(h=a,s=0;h<this.widthPassResultSize;s+=this.originalWidthMultipliedByChannels,h+=this.targetWidthMultipliedByChannels)n[h]=i[s],n[h+1]=i[s+1],n[h+2]=i[s+2],n[h+3]=i[s+3];e-=1/3;for(var o=this.widthOriginal-1;e<o;a+=4,e+=t)for(r=1-(l=e%1),h=a,s=4*Math.floor(e);h<this.widthPassResultSize;s+=this.originalWidthMultipliedByChannels,h+=this.targetWidthMultipliedByChannels)n[h]=i[s]*r+i[s+4]*l,n[h+1]=i[s+1]*r+i[s+5]*l,n[h+2]=i[s+2]*r+i[s+6]*l,n[h+3]=i[s+3]*r+i[s+7]*l;for(o=this.originalWidthMultipliedByChannels-4;a<this.targetWidthMultipliedByChannels;a+=4)for(h=a,s=o;h<this.widthPassResultSize;s+=this.originalWidthMultipliedByChannels,h+=this.targetWidthMultipliedByChannels)n[h]=i[s],n[h+1]=i[s+1],n[h+2]=i[s+2],n[h+3]=i[s+3];return n},Resize.prototype.resizeHeightRGB=function(i){var t=this.ratioWeightHeightPass,e=1/t,h=0,s=0,r=0,l=0,n=0,a=0,o=this.outputHeightWorkBench,d=this.heightBuffer;do{for(n=0;n<this.targetWidthMultipliedByChannels;)o[n++]=0,o[n++]=0,o[n++]=0;h=t;do if(h>=(s=1+r-l)){for(n=0;n<this.targetWidthMultipliedByChannels;)o[n++]+=i[r++]*s,o[n++]+=i[r++]*s,o[n++]+=i[r++]*s;l=r,h-=s}else{for(n=0,s=r;n<this.targetWidthMultipliedByChannels;)o[n++]+=i[s++]*h,o[n++]+=i[s++]*h,o[n++]+=i[s++]*h;l+=h;break}while(h>0&&r<this.widthPassResultSize);for(n=0;n<this.targetWidthMultipliedByChannels;)d[a++]=Math.round(o[n++]*e),d[a++]=Math.round(o[n++]*e),d[a++]=Math.round(o[n++]*e)}while(a<this.finalResultSize);return d},Resize.prototype.resizeHeightInterpolated=function(i){for(var t=this.ratioWeightHeightPass,e=0,h=0,s=0,r=0,l=0,n=0,a=0,o=this.heightBuffer;e<1/3;e+=t)for(s=0;s<this.targetWidthMultipliedByChannels;)o[h++]=Math.round(i[s++]);e-=1/3;for(var d=this.heightOriginal-1;e<d;e+=t)for(s=0,n=1-(a=e%1),l=(r=Math.floor(e)*this.targetWidthMultipliedByChannels)+this.targetWidthMultipliedByChannels;s<this.targetWidthMultipliedByChannels;++s)o[h++]=Math.round(i[r++]*n+i[l++]*a);for(;h<this.finalResultSize;)for(s=0,r=d*this.targetWidthMultipliedByChannels;s<this.targetWidthMultipliedByChannels;++s)o[h++]=Math.round(i[r++]);return o},Resize.prototype.resizeHeightRGBA=function(i){var t=this.ratioWeightHeightPass,e=1/t,h=0,s=0,r=0,l=0,n=0,a=0,o=this.outputHeightWorkBench,d=this.heightBuffer;do{for(n=0;n<this.targetWidthMultipliedByChannels;)o[n++]=0,o[n++]=0,o[n++]=0,o[n++]=0;h=t;do if(h>=(s=1+r-l)){for(n=0;n<this.targetWidthMultipliedByChannels;)o[n++]+=i[r++]*s,o[n++]+=i[r++]*s,o[n++]+=i[r++]*s,o[n++]+=i[r++]*s;l=r,h-=s}else{for(n=0,s=r;n<this.targetWidthMultipliedByChannels;)o[n++]+=i[s++]*h,o[n++]+=i[s++]*h,o[n++]+=i[s++]*h,o[n++]+=i[s++]*h;l+=h;break}while(h>0&&r<this.widthPassResultSize);for(n=0;n<this.targetWidthMultipliedByChannels;)d[a++]=Math.round(o[n++]*e),d[a++]=Math.round(o[n++]*e),d[a++]=Math.round(o[n++]*e),d[a++]=Math.round(o[n++]*e)}while(a<this.finalResultSize);return d},Resize.prototype.resize=function(i){this.useWebWorker?this.worker.postMessage(["resize",i]):this.resizeCallback(this.resizeHeight(this.resizeWidth(i)))},Resize.prototype.bypassResizer=function(i){return i},Resize.prototype.initializeFirstPassBuffers=function(i){this.widthBuffer=this.generateFloatBuffer(this.widthPassResultSize),i||(this.outputWidthWorkBench=this.generateFloatBuffer(this.originalHeightMultipliedByChannels))},Resize.prototype.initializeSecondPassBuffers=function(i){this.heightBuffer=this.generateUint8Buffer(this.finalResultSize),i||(this.outputHeightWorkBench=this.generateFloatBuffer(this.targetWidthMultipliedByChannels))},Resize.prototype.generateFloatBuffer=function(i){try{return new Float32Array(i)}catch(t){return[]}},Resize.prototype.generateUint8Buffer=function(i){try{return new Uint8Array(i)}catch(t){return[]}};