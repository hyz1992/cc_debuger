'use strict';const e=require('./css-vars-CPgzHstM.cjs'),t=(_0x441422,_0xddd8d5)=>{if(!e['isClient'])return!0x1;const _0x359b2b={'undefined':'overflow','true':'overflow-y','false':'overflow-x'}[String(_0xddd8d5)],_0x2978ae=e['getStyle'](_0x441422,_0x359b2b);return['scroll','auto','overlay']['some'](_0x1b702c=>_0x2978ae['includes'](_0x1b702c));};let o;exports['getScrollBarWidth']=_0x568cc6=>{var _0x40cae1;if(!e['isClient'])return 0x0;if(void 0x0!==o)return o;const _0x4b6c2e=document['createElement']('div');_0x4b6c2e['className']=_0x568cc6+'-scrollbar__wrap',_0x4b6c2e['style']['visibility']='hidden',_0x4b6c2e['style']['width']='100px',_0x4b6c2e['style']['position']='absolute',_0x4b6c2e['style']['top']='-9999px',document['body']['appendChild'](_0x4b6c2e);const _0x4afc15=_0x4b6c2e['offsetWidth'];_0x4b6c2e['style']['overflow']='scroll';const _0x4dceae=document['createElement']('div');_0x4dceae['style']['width']='100%',_0x4b6c2e['appendChild'](_0x4dceae);const _0x315b42=_0x4dceae['offsetWidth'];return null==(_0x40cae1=_0x4b6c2e['parentNode'])||_0x40cae1['removeChild'](_0x4b6c2e),o=_0x4afc15-_0x315b42,o;},exports['getScrollContainer']=(_0x2b4a50,_0x39a605)=>{if(!e['isClient'])return;let _0x2cda96=_0x2b4a50;for(;_0x2cda96;){if([window,document,document['documentElement']]['includes'](_0x2cda96))return window;if(t(_0x2cda96,_0x39a605))return _0x2cda96;_0x2cda96=_0x2cda96['parentNode'];}return _0x2cda96;},exports['scrollIntoView']=function(_0x311052,_0x15f37f){if(!e['isClient'])return;if(!_0x15f37f)return void(_0x311052['scrollTop']=0x0);const _0x60494=[];let _0x3e6e31=_0x15f37f['offsetParent'];for(;null!==_0x3e6e31&&_0x311052!==_0x3e6e31&&_0x311052['contains'](_0x3e6e31);)_0x60494['push'](_0x3e6e31),_0x3e6e31=_0x3e6e31['offsetParent'];const _0x2cd61b=_0x15f37f['offsetTop']+_0x60494['reduce']((_0x2ea067,_0x3b08c0)=>_0x2ea067+_0x3b08c0['offsetTop'],0x0),_0x11554d=_0x2cd61b+_0x15f37f['offsetHeight'],_0x2563c5=_0x311052['scrollTop'],_0x47f388=_0x2563c5+_0x311052['clientHeight'];_0x2cd61b<_0x2563c5?_0x311052['scrollTop']=_0x2cd61b:_0x11554d>_0x47f388&&(_0x311052['scrollTop']=_0x11554d-_0x311052['clientHeight']);};