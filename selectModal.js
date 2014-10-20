(function ( $ ) {
    var selectModal_incrementId = 1;
    
    $.fn.selectModal = function( options ) {
        
        // Defaults
        var settings = $.extend(true, {
            modalIdPrefix: "bs_selectmodal_",
            multi: false,
            required: false,
            button: {
                class: 'btn btn-primary btn-sm',
                icon: 'glyphicon glyphicon-search',
                text: '',
            },
            modal: {
                size: '', //sm, lg
                header: true,
                title : 'Select',
                footer: true,
                dismissText : 'Ok',
            },
            option: {
                class: 'bs-selectmodal-option',
                class_selected: 'bs-selectmodal-option-selected',
                checked: 'glyphicon glyphicon-check',
                unchecked: 'glyphicon glyphicon-unchecked',
            },
            optgroup: {
                class: 'bs-selectmodal-optgroup',
            },
        }, options );
        

        //Templates
        var _modalTemplate = '<div class="modal fade" id="{idModal}" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">' +
                                 '<div class="modal-dialog {modalsize}">' +
                                     '<div class="modal-content">' +
                                         '{header}' +
                                         '<div class="modal-body">{content}</div>' +
                                         '{footer}' +
                                     '</div>' +
                                 '</div>' + 
                             '</div>';
        
        var _modalHeaderTemplate = '<div class="modal-header"><h4 class="modal-title">{modaltitle}</h4></div>';
        
        var _modalFooterTemplate =  '<div class="modal-footer">' + 
                                         '<button type="button" class="btn btn-primary" data-dismiss="modal">{dismissText}</button>' +
                                    '</div>';
        

        //Private functions
        var _createModal = function(select, idModal){
            
            myModal = _modalTemplate.replace('{idModal}', idModal);
            
            if(settings.modal.size != ''){
                myModal = myModal.replace('{modalsize}', 'modal-' + settings.modal.size);
            }
            else{
                myModal = myModal.replace('{modalsize}', '');
            }
            
            if(settings.modal.header){
                myModal = myModal.replace('{header}', _modalHeaderTemplate);
                myModal = myModal.replace('{modaltitle}', settings.modal.title);
            }
            
            if(settings.modal.footer){
                myModal = myModal.replace('{footer}', _modalFooterTemplate);
                myModal = myModal.replace('{dismissText}', settings.modal.dismissText);
            }
            
            myModal = myModal.replace('{content}', _generateModalContent(select));
            
            $('body').append(myModal);
        }
        
        var _generateModalContent = function(select){
            
            $content = $(document.createElement('div'));
            
            if ($(select).find('optgroup').length > 0){
                $(select).find('optgroup').each(function(){
                    _appendOptgroup($content, this);
                });
            }
            else{
                $(select).find('option').each(function(){
                    _appendOption($content, this);
                });
            }
            
            return $content.html();
        }
        
        var _appendOption = function($element, option){
            $option = $(document.createElement('span')).addClass($(option).is(':selected')?settings.option.class + ' ' + settings.option.class_selected : settings.option.class)
                                                       .attr('data-svalue', $(option).val())
                                                       .append($(document.createElement('i'))
                                                       .addClass($(option).is(':selected')?settings.option.checked : settings.option.unchecked))
                                                       .append(' ' + $(option).text());
            $element.append($option);
        }
        
        var _appendOptgroup = function($element, opt){
            $optgroup = $(document.createElement('div')).addClass(settings.optgroup.class);
            
            $(opt).find('option').each(function(){
                _appendOption($optgroup, this);
            });
            
            $element.append($optgroup);
        }
        
        var _hideSelect = function(select, idModal){
            $(select).attr('data-selectModal', idModal);
            $(select).hide();
        }
        
        var _generateButton = function(select, idModal){
            $btn = $(document.createElement('button')).attr({'data-toggle' : 'modal' ,'data-target': '#'+idModal}).addClass(settings.button.class);
            $btn.append($(document.createElement('i')).addClass(settings.button.icon));
            $btn.append(settings.button.text);
            
            $(select).after($btn);
        }
        
        var _generateId = function(){
            idModal = settings.modalIdPrefix.concat(selectModal_incrementId);
            selectModal_incrementId++;
            return idModal;
        }

        var _clickOptionEvent = function($span, select){

            $(select).find('option:selected').removeAttr('selected');

            if(!$span.hasClass(settings.option.class_selected)){
                _seleccionarOpcion($span, select);
            }
            else if(!settings.required){
                _deseleccionarOpcion($span, select);
            }

            $span.closest('.modal-body').find('.' + settings.option.class_selected).not($span)
                                        .each(function() {
                                            _deseleccionarOpcion($(this), idModal);
                                        });;
        }
        
        var _clickOptionMultiEvent = function($span, select){

            if(!$span.hasClass(settings.option.class_selected)){
                _seleccionarOpcion($span, select);
            }
            else if(!settings.required){
                _deseleccionarOpcion($span, select);
            }
        }

        var _seleccionarOpcion = function($span, select){
            $span.addClass(settings.option.class_selected)
                 .find('i')
                 .removeClass(settings.option.unchecked)
                 .addClass(settings.option.checked);

            console.log($(select).find('option[value="'+ $span.attr('data-svalue') +'"]'));
            $(select).find('option[value="'+ $span.attr('data-svalue') +'"]').attr('selected','selected');
        }

        var _deseleccionarOpcion = function($span, select){
            $span.removeClass(settings.option.class_selected)
                 .find('i')
                 .removeClass(settings.option.checked)
                 .addClass(settings.option.unchecked);
            
            $(select).find('option[value="'+ $span.attr('data-svalue') +'"]').removeAttr('selected');
        }

        var _bindEvents = function(select, idModal){

            var clickFn;
            if(settings.multi){
                clickFn = _clickOptionMultiEvent;
            }
            else{
                clickFn = _clickOptionEvent;
            }


            $('#'+idModal).find('.'+settings.option.class).click(function() {
                clickFn($(this), select);
            });
        }
        
        //Main
        return this.each(function() {
            idModal = _generateId();
            
            _hideSelect(this, idModal);
            _generateButton(this, idModal);
            
            _createModal(this, idModal);
            _bindEvents(this, idModal);
        });
    }
}( jQuery ));