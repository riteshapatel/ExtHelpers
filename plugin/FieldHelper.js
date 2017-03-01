/**
 * This plugin displays a customized tip below a form field. This
 * tip can be used for displaying mandatory field requirements.
 *
 * @class ExtHelpers.plugin.FieldHelper
 * @extend Ext.plugin.Abstract
 *
 * @author Ritesh Patel
 * @email ritesh.patel@sencha.com

 * Sample Usage: 
    // customized style
    var helperStyle = {
        backgroundColor: '#FFC7C1',
        border: '1px solid #404040',
        borderRadius: '3px',
        color: '#404040'    
    }
    // form
    Ext.create('Ext.form.Panel', {
        defaults: {
            anchor: '50%'
        },
        bodyPadding: 5,
        items: [
            // customized style and default alignment
            {
                xtype: 'textfield',
                emptyText: 'Enter first name',
                fieldLabel: 'First Name',
                plugins: [{
                    ptype: 'fieldhelper',
                    helperText: 'This field will only accept a-z or A-Z characters',
                    helperStyle: helperStyle // <-- customized style
                }]
            },
            // default style and customized alignment (b, bl, br, tl, tr, bl-br etc...)
            {
                xtype: 'textareafield',
                grow: true,
                name: 'message',
                fieldLabel: 'Message',
                anchor: '100%',
                plugins: [{
                    ptype: 'fieldhelper',
                    helperText: 'Text area field helper...',
                    align: 'bl' // <-- customized alignment
                }]
            }

        ]
    });
 */
Ext.define('ExtHelpers.plugin.FieldHelper', {
    extend: 'Ext.plugin.Abstract',
    alias: 'plugin.fieldhelper',

    /**
     * @cfg {String} helperText
     * displays text supplied by the plugin
     */
    helperText: null,

    /**
     * @cfg {Object} helperStyle
     * default style for the helper panel
     */
    helperStyle: {
        backgroundColor: '#404040',
        border: '1px solid #CCC',
        borderRadius: '3px',
        color: 'white'
    },

    /**
     * @cfg {String} divStyle
     * adjusts panel with the size of helper text
     */
    divStyle: 'word-wrap: break-word; height:auto',

    /**
     * @cfg {String} align
     * customized alignment of the helper panel
     */
    align: null,

    /**
     * @cfg {Number} width
     * default width of the helper panel
     */
    width: 200,

    /**
     * @method init
     * @param {Ext.form.field.Field} field - form field
     */
    init: function (field) {
        var me = this;
        me.panelZIndex = -1;

        me.resizeCount = 0;
        if (!me.helperText) {
            return;
        }

        // create helper panel and apply styles
        if (!me.helper) {
            me.helper = me.createHelper();

            if (me.helperStyle) {
                me.helper.setBodyStyle(me.helperStyle);
            }
        }
        // set text for the helper panel
        me.helper.setHtml('<div style=' + me.divStyle + '>' + me.helperText + '</div>');
        me.setCmp(field);

        // listeners
        field.on({
            scope: me,
            'blur': function (field) {
                me.helper.hide();
            },

            'focus': function (field) {
                me.displayHelper(field);
            }
        });

        if (field.xtype === 'textareafield') {
            field.on({
                scope: me,
                'resize': function (field) {
                    if (me.resizeCount > 1) me.displayHelper(field, {});
                    me.resizeCount++;
                },
                'boxready': function (field) {
                    me.helper.hide();
                }
            })
        }
    },

    /**
     * @method
     * displays helper panel
     * @param {Ext.form.field.Field} field - form field
     * @param {Object} event - event object
     */
    displayHelper: function (field) {
        var me = this,
            fieldWidth = field.inputEl.getWidth() || field.getWidth();

        // fields with triggers
        if (field.isXType('numberfield') || field.isXType('combobox')) {
            fieldWidth = field.bodyEl.getWidth(); // get field width including trigger (if any)
        }

        // field width must be greater than the default
        // minimum width (for checkboxes, radio buttons etc)
        if (fieldWidth >= me.width) {
            me.helper.setWidth(fieldWidth);
        }

        // show helper with offsets and align to a customized or a default value of bottom left
        me.helper.showBy(field);
    },
    /**
     * @method
     * creates helper panel
     */
    createHelper: function () {
        var me = this;
        return Ext.create('Ext.tip.ToolTip', {
            html: '<div style=' + me.divStyle + '>This is to hover below the text box</div>',
            defaultAlign: 'b',
            visible: false,
            anchor: true,
            name: 'helpContainer',
            bodyPadding: 5,
            alwaysOnTop: true,
            bodyStyle: me.helperStyle,
            autoHide: false,
            closable: true,
            header: false
        });
    },

    /**
     * @method
     * destroy resources
     */
    destroy: function () {
        var me = this;
        if (me.helper) {
            me.helper.destroy();
        }
        me.callParent(arguments);
    }
})