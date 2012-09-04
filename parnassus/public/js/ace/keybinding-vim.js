define("ace/keyboard/vim",["require","exports","module","ace/keyboard/vim/commands","ace/keyboard/vim/maps/util","ace/lib/useragent"],function(a,b,c){var d=a("./vim/commands"),e=d.coreCommands,f=a("./vim/maps/util"),g=a("../lib/useragent"),h={i:{command:e.start},I:{command:e.startBeginning},a:{command:e.append},A:{command:e.appendEnd},"ctrl-f":{command:"gotopagedown"},"ctrl-b":{command:"gotopageup"}};b.handler={handleMacRepeat:function(a,b,c){if(b==-1)a.inputChar=c,a.lastEvent="input";else if(a.inputChar&&a.$lastHash==b&&a.$lastKey==c){if(a.lastEvent=="input")a.lastEvent="input1";else if(a.lastEvent=="input1")return!0}else a.$lastHash=b,a.$lastKey=c,a.lastEvent="keypress"},handleKeyboard:function(a,b,c,f,i){if(b!=0&&(c==""||c=="\0"))return null;b==1&&(c="ctrl-"+c);if(a.state=="start"){g.isMac&&this.handleMacRepeat(a,b,c)&&(b=-1,c=a.inputChar);if(b==-1||b==1)return d.inputBuffer.idle&&h[c]?h[c]:{command:{exec:function(a){d.inputBuffer.push(a,c)}}};if(c.length==1&&(b==0||b==4))return{command:"null",passEvent:!0};if(c=="esc"&&b==0)return{command:e.stop}}else{if(c=="esc"||c=="ctrl-[")return a.state="start",{command:e.stop};if(c=="ctrl-w")return{command:"removewordleft"}}},attach:function(a){a.on("click",b.onCursorMove),f.currentMode!=="insert"&&d.coreCommands.stop.exec(a),a.$vimModeHandler=this},detach:function(a){a.removeListener("click",b.onCursorMove),f.noMode(a),f.currentMode="normal"},actions:d.actions,getStatusText:function(){return f.currentMode=="insert"?"INSERT":f.onVisualMode?(f.onVisualLineMode?"VISUAL LINE ":"VISUAL ")+d.inputBuffer.status:d.inputBuffer.status}},b.onCursorMove=function(a){d.onCursorMove(a.editor,a),b.onCursorMove.scheduled=!1}}),define("ace/keyboard/vim/commands",["require","exports","module","ace/keyboard/vim/maps/util","ace/keyboard/vim/maps/motions","ace/keyboard/vim/maps/operators","ace/keyboard/vim/maps/aliases","ace/keyboard/vim/registers"],function(a,b,c){function r(a){q.previous={action:{action:{fn:a}}}}"never use strict";var d=a("./maps/util"),e=a("./maps/motions"),f=a("./maps/operators"),g=a("./maps/aliases"),h=a("./registers"),i=1,j=2,k=3,l=4,m=8,n=function(b,c,d){while(0<c--)b.apply(this,d)},o=function(a){var b=a.renderer,c=b.$cursorLayer.getPixelPosition(),d=c.top,e=m*b.layerConfig.lineHeight;2*e>b.$size.scrollerHeight&&(e=b.$size.scrollerHeight/2),b.scrollTop>d-e&&b.session.setScrollTop(d-e),b.scrollTop+b.$size.scrollerHeight<d+e+b.lineHeight&&b.session.setScrollTop(d+e+b.lineHeight-b.$size.scrollerHeight)},p=b.actions={z:{param:!0,fn:function(a,b,c,d){switch(d){case"z":a.alignCursor(null,.5);break;case"t":a.alignCursor(null,0);break;case"b":a.alignCursor(null,1)}}},r:{param:!0,fn:function(a,b,c,d){d&&d.length&&(n(function(){a.insert(d)},c||1),a.navigateLeft())}},R:{fn:function(a,b,c,e){d.insertMode(a),a.setOverwrite(!0)}},"~":{fn:function(a,b,c){n(function(){var b=a.selection.getRange();b.isEmpty()&&b.end.column++;var c=a.session.getTextRange(b),d=c.toUpperCase();d==c?a.navigateRight():a.session.replace(b,d)},c||1)}},"*":{fn:function(a,b,c,d){a.selection.selectWord(),a.findNext(),o(a);var e=a.selection.getRange();a.selection.setSelectionRange(e,!0)}},"#":{fn:function(a,b,c,d){a.selection.selectWord(),a.findPrevious(),o(a);var e=a.selection.getRange();a.selection.setSelectionRange(e,!0)}},n:{fn:function(a,b,c,d){var e=a.getLastSearchOptions();e.backwards=!1,a.selection.moveCursorRight(),a.selection.clearSelection(),a.findNext(e),o(a);var f=a.selection.getRange();f.end.row=f.start.row,f.end.column=f.start.column,a.selection.setSelectionRange(f,!0)}},N:{fn:function(a,b,c,d){var e=a.getLastSearchOptions();e.backwards=!0,a.findPrevious(e),o(a);var f=a.selection.getRange();f.end.row=f.start.row,f.end.column=f.start.column,a.selection.setSelectionRange(f,!0)}},v:{fn:function(a,b,c,e){a.selection.selectRight(),d.visualMode(a,!1)},acceptsMotion:!0},V:{fn:function(a,b,c,e){var f=a.getCursorPosition().row;a.selection.clearSelection(),a.selection.moveCursorTo(f,0),a.selection.selectLineEnd(),a.selection.visualLineStart=f,d.visualMode(a,!0)},acceptsMotion:!0},Y:{fn:function(a,b,c,e){d.copyLine(a)}},p:{fn:function(a,b,c,d){var e=h._default;a.setOverwrite(!1);if(e.isLine){var f=a.getCursorPosition(),g=e.text.split("\n");a.session.getDocument().insertLines(f.row+1,g),a.moveCursorTo(f.row+1,0)}else a.navigateRight(),a.insert(e.text),a.navigateLeft();a.setOverwrite(!0),a.selection.clearSelection()}},P:{fn:function(a,b,c,d){var e=h._default;a.setOverwrite(!1);if(e.isLine){var f=a.getCursorPosition(),g=e.text.split("\n");a.session.getDocument().insertLines(f.row,g),a.moveCursorTo(f.row,0)}else a.insert(e.text);a.setOverwrite(!0),a.selection.clearSelection()}},J:{fn:function(a,b,c,d){var e=a.session;b=a.getSelectionRange();var f={row:b.start.row,column:b.start.column};c=c||b.end.row-b.start.row;var g=Math.min(f.row+(c||1),e.getLength()-1);b.start.column=e.getLine(f.row).length,b.end.column=e.getLine(g).length,b.end.row=g;var h="";for(var i=f.row;i<g;i++){var j=e.getLine(i+1);h+=" "+/^\s*(.*)$/.exec(j)[1]||""}e.replace(b,h),a.moveCursorTo(f.row,f.column)}},u:{fn:function(a,b,c,d){c=parseInt(c||1,10);for(var e=0;e<c;e++)a.undo();a.selection.clearSelection()}},"ctrl-r":{fn:function(a,b,c,d){c=parseInt(c||1,10);for(var e=0;e<c;e++)a.redo();a.selection.clearSelection()}},":":{fn:function(a,b,c,d){}},"/":{fn:function(a,b,c,d){}},"?":{fn:function(a,b,c,d){}},".":{fn:function(a,b,c,e){d.onInsertReplaySequence=q.lastInsertCommands;var f=q.previous;f&&q.exec(a,f.action,f.param)}}},q=b.inputBuffer={accepting:[i,j,k,l],currentCmd:null,currentCount:"",status:"",operator:null,motion:null,lastInsertCommands:[],push:function(a,b,c){this.idle=!1;var d=this.waitingForParam;if(d)this.exec(a,d,b);else if(b==="0"&&!this.currentCount.length||!b.match(/^\d+$/)||!this.isAccepting(i))if(!this.operator&&this.isAccepting(j)&&f[b])this.operator={"char":b,count:this.getCount()},this.currentCmd=j,this.accepting=[i,k,l],this.exec(a,{operator:this.operator});else if(e[b]&&this.isAccepting(k)){this.currentCmd=k;var h={operator:this.operator,motion:{"char":b,count:this.getCount()}};e[b].param?this.waitForParam(h):this.exec(a,h)}else if(g[b]&&this.isAccepting(k))g[b].operator.count=this.getCount(),this.exec(a,g[b]);else if(p[b]&&this.isAccepting(l)){var m={action:{fn:p[b].fn,count:this.getCount()}};p[b].param?this.waitForParam(m):this.exec(a,m),p[b].acceptsMotion&&(this.idle=!1)}else this.operator?this.exec(a,{operator:this.operator},b):this.reset();else this.currentCount+=b,this.currentCmd=i,this.accepting=[i,j,k,l];if(this.waitingForParam||this.motion||this.operator)this.status+=b;else if(this.currentCount)this.status=this.currentCount;else{if(!this.status)return;this.status=""}a._emit("changeStatus")},waitForParam:function(a){this.waitingForParam=a},getCount:function(){var a=this.currentCount;return this.currentCount="",a&&parseInt(a,10)},exec:function(a,b,c){var g=b.motion,h=b.operator,i=b.action;c||(c=b.param),h&&(this.previous={action:b,param:c});if(h&&!a.selection.isEmpty()){f[h.char].selFn&&(f[h.char].selFn(a,a.getSelectionRange(),h.count,c),this.reset());return}if(!g&&!i&&h&&c)f[h.char].fn(a,null,h.count,c),this.reset();else if(g){var j=function(b){b&&typeof b=="function"&&(g.count&&!k.handlesCount?n(b,g.count,[a,null,g.count,c]):b(a,null,g.count,c))},k=e[g.char],l=k.sel;h?l&&n(function(){j(k.sel),f[h.char].fn(a,a.getSelectionRange(),h.count,c)},h.count||1):(d.onVisualMode||d.onVisualLineMode)&&l?j(k.sel):j(k.nav),this.reset()}else i&&(i.fn(a,a.getSelectionRange(),i.count,c),this.reset());s(a)},isAccepting:function(a){return this.accepting.indexOf(a)!==-1},reset:function(){this.operator=null,this.motion=null,this.currentCount="",this.status="",this.accepting=[i,j,k,l],this.idle=!0,this.waitingForParam=null}};b.coreCommands={start:{exec:function t(a){d.insertMode(a),r(t)}},startBeginning:{exec:function u(a){a.navigateLineStart(),d.insertMode(a),r(u)}},stop:{exec:function(b){q.reset(),d.onVisualMode=!1,d.onVisualLineMode=!1,q.lastInsertCommands=d.normalMode(b)}},append:{exec:function v(a){var b=a.getCursorPosition(),c=a.session.getLine(b.row).length;c&&a.navigateRight(),d.insertMode(a),r(v)}},appendEnd:{exec:function w(a){a.navigateLineEnd(),d.insertMode(a),r(w)}}};var s=b.onCursorMove=function(a,b){if(d.currentMode==="insert"||s.running)return;if(!a.selection.isEmpty()){s.running=!0;if(d.onVisualLineMode){var c=a.selection.visualLineStart,e=a.getCursorPosition().row;if(c<=e){var f=a.session.getLine(e);a.selection.clearSelection(),a.selection.moveCursorTo(c,0),a.selection.selectTo(e,f.length)}else{var f=a.session.getLine(c);a.selection.clearSelection(),a.selection.moveCursorTo(c,f.length),a.selection.selectTo(e,0)}}s.running=!1;return}b&&(d.onVisualLineMode||d.onVisualMode)&&(a.selection.clearSelection(),d.normalMode(a)),s.running=!0;var g=a.getCursorPosition(),h=a.session.getLine(g.row).length;h&&g.column===h&&a.navigateLeft(),s.running=!1}}),define("ace/keyboard/vim/maps/util",["require","exports","module","ace/keyboard/vim/registers","ace/lib/dom"],function(a,b,c){var d=a("../registers"),e=a("../../../lib/dom");e.importCssString(".insert-mode. ace_cursor{    border-left: 2px solid #333333;}.ace_dark.insert-mode .ace_cursor{    border-left: 2px solid #eeeeee;}.normal-mode .ace_cursor{    border: 0!important;    background-color: red;    opacity: 0.5;}","vimMode"),c.exports={onVisualMode:!1,onVisualLineMode:!1,currentMode:"normal",noMode:function(a){a.unsetStyle("insert-mode"),a.unsetStyle("normal-mode"),a.commands.recording&&a.commands.toggleRecording(a),a.setOverwrite(!1)},insertMode:function(a){this.currentMode="insert",a.setStyle("insert-mode"),a.unsetStyle("normal-mode"),a.setOverwrite(!1),a.keyBinding.$data.buffer="",a.keyBinding.$data.state="insertMode",this.onVisualMode=!1,this.onVisualLineMode=!1,this.onInsertReplaySequence?(a.commands.macro=this.onInsertReplaySequence,a.commands.replay(a),this.onInsertReplaySequence=null,this.normalMode(a)):(a._emit("changeStatus"),a.commands.recording||a.commands.toggleRecording(a))},normalMode:function(a){this.currentMode="normal",a.unsetStyle("insert-mode"),a.setStyle("normal-mode"),a.clearSelection();var b;return a.getOverwrite()||(b=a.getCursorPosition(),b.column>0&&a.navigateLeft()),a.setOverwrite(!0),a.keyBinding.$data.buffer="",a.keyBinding.$data.state="start",this.onVisualMode=!1,this.onVisualLineMode=!1,a._emit("changeStatus"),a.commands.recording?(a.commands.toggleRecording(a),a.commands.macro):[]},visualMode:function(a,b){if(this.onVisualLineMode&&b||this.onVisualMode&&!b){this.normalMode(a);return}a.setStyle("insert-mode"),a.unsetStyle("normal-mode"),a._emit("changeStatus"),b?this.onVisualLineMode=!0:(this.onVisualMode=!0,this.onVisualLineMode=!1)},getRightNthChar:function(a,b,c,d){var e=a.getSession().getLine(b.row),f=e.substr(b.column+1).split(c);return d<f.length?f.slice(0,d).join(c).length:null},getLeftNthChar:function(a,b,c,d){var e=a.getSession().getLine(b.row),f=e.substr(0,b.column).split(c);return d<f.length?f.slice(-1*d).join(c).length:null},toRealChar:function(a){return a.length===1?a:/^shift-./.test(a)?a[a.length-1].toUpperCase():""},copyLine:function(a){var b=a.getCursorPosition();a.selection.clearSelection(),a.moveCursorTo(b.row,b.column),a.selection.selectLine(),d._default.isLine=!0,d._default.text=a.getCopyText().replace(/\n$/,""),a.selection.clearSelection(),a.moveCursorTo(b.row,b.column)}}}),define("ace/keyboard/vim/registers",["require","exports","module"],function(a,b,c){"never use strict",c.exports={_default:{text:"",isLine:!1}}}),"use strict",define("ace/keyboard/vim/maps/motions",["require","exports","module","ace/keyboard/vim/maps/util","ace/search","ace/range"],function(a,b,c){function f(a,b){if(b=="extend")var c=!0;else var d=b;this.nav=function(b){var c=a(b);if(!c)return;if(!c.end)var e=c;else if(d)var e=c.start;else var e=c.end;b.clearSelection(),b.moveCursorTo(e.row,e.column)},this.sel=function(b){var e=a(b);if(!e)return;if(c)return b.selection.setSelectionRange(e);if(!e.end)var f=e;else if(d)var f=e.start;else var f=e.end;b.selection.selectTo(f.row,f.column)}}function m(a,b,c){return l.$options.needle=b,l.$options.backwards=c==-1,l.find(a.session)}var d=a("./util"),e=function(a,b){var c=a.renderer.getScrollTopRow(),d=a.getCursorPosition().row,e=d-c;b&&b.call(a),a.renderer.scrollToRow(a.getCursorPosition().row-e)},g=/[\s.\/\\()\"'-:,.;<>~!@#$%^&*|+=\[\]{}`~?]/,h=/[.\/\\()\"'-:,.;<>~!@#$%^&*|+=\[\]{}`~?]/,i=/\s/,j=function(a,b){var c=a.selection;this.range=c.getRange(),b=b||c.selectionLead,this.row=b.row,this.col=b.column;var d=a.session.getLine(this.row),e=a.session.getLength();this.ch=d[this.col]||"\n",this.skippedLines=0,this.next=function(){return this.ch=d[++this.col]||this.handleNewLine(1),this.ch},this.prev=function(){return this.ch=d[--this.col]||this.handleNewLine(-1),this.ch},this.peek=function(b){var c=d[this.col+b];return c?c:b==-1?"\n":this.col==d.length-1?"\n":a.session.getLine(this.row+1)[0]||"\n"},this.handleNewLine=function(b){if(b==1)return this.col==d.length?"\n":this.row==e-1?"":(this.col=0,this.row++,d=a.session.getLine(this.row),this.skippedLines++,d[0]||"\n");if(b==-1)return this.row==0?"":(this.row--,d=a.session.getLine(this.row),this.col=d.length,this.skippedLines--,"\n")},this.debug=function(){console.log(d.substring(0,this.col)+"|"+this.ch+"'"+this.col+"'"+d.substr(this.col+1))}},k=a("ace/search").Search,l=new k,n=a("ace/range").Range;c.exports={w:new f(function(a){var b=new j(a);if(b.ch&&h.test(b.ch))while(b.ch&&h.test(b.ch))b.next();else while(b.ch&&!g.test(b.ch))b.next();while(b.ch&&i.test(b.ch)&&b.skippedLines<2)b.next();return b.skippedLines==2&&b.prev(),{column:b.col,row:b.row}}),W:new f(function(a){var b=new j(a);while(b.ch&&(!i.test(b.ch)||!!i.test(b.peek(1)))&&b.skippedLines<2)b.next();return b.skippedLines==2?b.prev():b.next(),{column:b.col,row:b.row}}),b:new f(function(a){var b=new j(a);b.prev();while(b.ch&&i.test(b.ch)&&b.skippedLines>-2)b.prev();if(b.ch&&h.test(b.ch))while(b.ch&&h.test(b.ch))b.prev();else while(b.ch&&!g.test(b.ch))b.prev();return b.ch&&b.next(),{column:b.col,row:b.row}}),B:new f(function(a){var b=new j(a);b.prev();while(b.ch&&(!!i.test(b.ch)||!i.test(b.peek(-1)))&&b.skippedLines>-2)b.prev();return b.skippedLines==-2&&b.next(),{column:b.col,row:b.row}},!0),e:new f(function(a){var b=new j(a);b.next();while(b.ch&&i.test(b.ch))b.next();if(b.ch&&h.test(b.ch))while(b.ch&&h.test(b.ch))b.next();else while(b.ch&&!g.test(b.ch))b.next();return b.ch&&b.prev(),{column:b.col,row:b.row}}),E:new f(function(a){var b=new j(a);b.next();while(b.ch&&(!!i.test(b.ch)||!i.test(b.peek(1))))b.next();return{column:b.col,row:b.row}}),l:{nav:function(a){a.navigateRight()},sel:function(a){var b=a.getCursorPosition(),c=b.column,d=a.session.getLine(b.row).length;d&&c!==d&&a.selection.selectRight()}},h:{nav:function(a){var b=a.getCursorPosition();b.column>0&&a.navigateLeft()},sel:function(a){var b=a.getCursorPosition();b.column>0&&a.selection.selectLeft()}},k:{nav:function(a){a.navigateUp()},sel:function(a){a.selection.selectUp()}},j:{nav:function(a){a.navigateDown()},sel:function(a){a.selection.selectDown()}},i:{param:!0,sel:function(a,b,c,d){switch(d){case"w":a.selection.selectWord();break;case"W":a.selection.selectAWord();break;case"(":case"{":case"[":var e=a.getCursorPosition(),f=a.session.$findClosingBracket(d,e,/paren/);if(!f)return;var g=a.session.$findOpeningBracket(a.session.$brackets[d],e,/paren/);if(!g)return;g.column++,a.selection.setSelectionRange(n.fromPoints(g,f));break;case"'":case'"':case"/":var f=m(a,d,1);if(!f)return;var g=m(a,d,-1);if(!g)return;a.selection.setSelectionRange(n.fromPoints(g.end,f.start))}}},a:{param:!0,sel:function(a,b,c,d){switch(d){case"w":a.selection.selectAWord();break;case"W":a.selection.selectAWord();break;case"(":case"{":case"[":var e=a.getCursorPosition(),f=a.session.$findClosingBracket(d,e,/paren/);if(!f)return;var g=a.session.$findOpeningBracket(a.session.$brackets[d],e,/paren/);if(!g)return;f.column++,a.selection.setSelectionRange(n.fromPoints(g,f));break;case"'":case'"':case"/":var f=m(a,d,1);if(!f)return;var g=m(a,d,-1);if(!g)return;f.column++,a.selection.setSelectionRange(n.fromPoints(g.start,f.end))}}},f:{param:!0,handlesCount:!0,nav:function(a,b,c,e){var f=a,g=f.getCursorPosition(),h=d.getRightNthChar(a,g,e,c||1);typeof h=="number"&&(f.selection.clearSelection(),f.moveCursorTo(g.row,h+g.column+1))},sel:function(a,b,c,e){var f=a,g=f.getCursorPosition(),h=d.getRightNthChar(a,g,e,c||1);typeof h=="number"&&f.moveCursorTo(g.row,h+g.column+1)}},F:{param:!0,handlesCount:!0,nav:function(a,b,c,e){var f=a,g=f.getCursorPosition(),h=d.getLeftNthChar(a,g,e,c||1);typeof h=="number"&&(f.selection.clearSelection(),f.moveCursorTo(g.row,g.column-h-1))},sel:function(a,b,c,e){var f=a,g=f.getCursorPosition(),h=d.getLeftNthChar(a,g,e,c||1);typeof h=="number"&&f.moveCursorTo(g.row,g.column-h-1)}},t:{param:!0,handlesCount:!0,nav:function(a,b,c,e){var f=a,g=f.getCursorPosition(),h=d.getRightNthChar(a,g,e,c||1);typeof h=="number"&&(f.selection.clearSelection(),f.moveCursorTo(g.row,h+g.column))},sel:function(a,b,c,e){var f=a,g=f.getCursorPosition(),h=d.getRightNthChar(a,g,e,c||1);typeof h=="number"&&f.moveCursorTo(g.row,h+g.column)}},T:{param:!0,handlesCount:!0,nav:function(a,b,c,e){var f=a,g=f.getCursorPosition(),h=d.getLeftNthChar(a,g,e,c||1);typeof h=="number"&&(f.selection.clearSelection(),f.moveCursorTo(g.row,-h+g.column))},sel:function(a,b,c,e){var f=a,g=f.getCursorPosition(),h=d.getLeftNthChar(a,g,e,c||1);typeof h=="number"&&f.moveCursorTo(g.row,-h+g.column)}},"^":{nav:function(a){a.navigateLineStart()},sel:function(a){a.selection.selectLineStart()}},$:{nav:function(a){a.navigateLineEnd()},sel:function(a){a.selection.selectLineEnd()}},0:new f(function(a){return{row:a.selection.lead.row,column:0}}),G:{nav:function(a,b,c,d){!c&&c!==0&&(c=a.session.getLength()),a.gotoLine(c)},sel:function(a,b,c,d){!c&&c!==0&&(c=a.session.getLength()),a.selection.selectTo(c,0)}},g:{param:!0,nav:function(a,b,c,d){switch(d){case"m":console.log("Middle line");break;case"e":console.log("End of prev word");break;case"g":a.gotoLine(c||0);case"u":a.gotoLine(c||0);case"U":a.gotoLine(c||0)}},sel:function(a,b,c,d){switch(d){case"m":console.log("Middle line");break;case"e":console.log("End of prev word");break;case"g":a.selection.selectTo(c||0,0)}}},o:{nav:function(a,b,c,e){c=c||1;var f="";while(0<c--)f+="\n";f.length&&(a.navigateLineEnd(),a.insert(f),d.insertMode(a))}},O:{nav:function(a,b,c,e){var f=a.getCursorPosition().row;c=c||1;var g="";while(0<c--)g+="\n";g.length&&(f>0?(a.navigateUp(),a.navigateLineEnd(),a.insert(g)):(a.session.insert({row:0,column:0},g),a.navigateUp()),d.insertMode(a))}},"%":new f(function(a){var b=/[\[\]{}()]/g,c=a.getCursorPosition(),d=a.session.getLine(c.row)[c.column];if(!b.test(d)){var e=m(a,b);if(!e)return;c=e.start}var f=a.session.findMatchingBracket({row:c.row,column:c.column+1});return f}),"ctrl-d":{nav:function(a,b,c,d){a.selection.clearSelection(),e(a,a.gotoPageDown)},sel:function(a,b,c,d){e(a,a.selectPageDown)}},"ctrl-u":{nav:function(a,b,c,d){a.selection.clearSelection(),e(a,a.gotoPageUp)},sel:function(a,b,c,d){e(a,a.selectPageUp)}}},c.exports.backspace=c.exports.left=c.exports.h,c.exports.right=c.exports.l,c.exports.up=c.exports.k,c.exports.down=c.exports.j,c.exports.pagedown=c.exports["ctrl-d"],c.exports.pageup=c.exports["ctrl-u"]}),define("ace/keyboard/vim/maps/operators",["require","exports","module","ace/keyboard/vim/maps/util","ace/keyboard/vim/registers"],function(a,b,c){"never use strict";var d=a("./util"),e=a("../registers");c.exports={d:{selFn:function(a,b,c,f){e._default.text=a.getCopyText(),e._default.isLine=d.onVisualLineMode,d.onVisualLineMode?a.removeLines():a.session.remove(b),d.normalMode(a)},fn:function(a,b,c,d){c=c||1;switch(d){case"d":e._default.text="",e._default.isLine=!0;for(var f=0;f<c;f++){a.selection.selectLine(),e._default.text+=a.getCopyText();var g=a.getSelectionRange();if(!g.isMultiLine()){lastLineReached=!0;var h=g.start.row-1,i=a.session.getLine(h).length;g.setStart(h,i),a.session.remove(g),a.selection.clearSelection();break}a.session.remove(g),a.selection.clearSelection()}e._default.text=e._default.text.replace(/\n$/,"");break;default:b&&(a.selection.setSelectionRange(b),e._default.text=a.getCopyText(),e._default.isLine=!1,a.session.remove(b),a.selection.clearSelection())}}},c:{selFn:function(a,b,c,e){a.session.remove(b),d.insertMode(a)},fn:function(a,b,c,e){c=c||1;switch(e){case"c":for(var f=0;f<c;f++)a.removeLines(),d.insertMode(a);break;default:b&&(a.session.remove(b),d.insertMode(a))}}},y:{selFn:function(a,b,c,f){e._default.text=a.getCopyText(),e._default.isLine=d.onVisualLineMode,a.selection.clearSelection(),d.normalMode(a)},fn:function(a,b,c,d){c=c||1;switch(d){case"y":var f=a.getCursorPosition();a.selection.selectLine();for(var g=0;g<c-1;g++)a.selection.moveCursorDown();e._default.text=a.getCopyText().replace(/\n$/,""),a.selection.clearSelection(),e._default.isLine=!0,a.moveCursorToPosition(f);break;default:if(b){var f=a.getCursorPosition();a.selection.setSelectionRange(b),e._default.text=a.getCopyText(),e._default.isLine=!1,a.selection.clearSelection(),a.moveCursorTo(f.row,f.column)}}}},">":{selFn:function(a,b,c,e){c=c||1;for(var f=0;f<c;f++)a.indent();d.normalMode(a)},fn:function(a,b,c,d){c=parseInt(c||1,10);switch(d){case">":var e=a.getCursorPosition();a.selection.selectLine();for(var f=0;f<c-1;f++)a.selection.moveCursorDown();a.indent(),a.selection.clearSelection(),a.moveCursorToPosition(e),a.navigateLineEnd(),a.navigateLineStart()}}},"<":{selFn:function(a,b,c,e){c=c||1;for(var f=0;f<c;f++)a.blockOutdent();d.normalMode(a)},fn:function(a,b,c,d){c=c||1;switch(d){case"<":var e=a.getCursorPosition();a.selection.selectLine();for(var f=0;f<c-1;f++)a.selection.moveCursorDown();a.blockOutdent(),a.selection.clearSelection(),a.moveCursorToPosition(e),a.navigateLineEnd(),a.navigateLineStart()}}}}}),"use strict",define("ace/keyboard/vim/maps/aliases",["require","exports","module"],function(a,b,c){c.exports={x:{operator:{"char":"d",count:1},motion:{"char":"l",count:1}},X:{operator:{"char":"d",count:1},motion:{"char":"h",count:1}},D:{operator:{"char":"d",count:1},motion:{"char":"$",count:1}},C:{operator:{"char":"c",count:1},motion:{"char":"$",count:1}},s:{operator:{"char":"c",count:1},motion:{"char":"l",count:1}},S:{operator:{"char":"c",count:1},param:"c"}}})