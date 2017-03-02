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
                    tipConfig: {
                        bodyStyle: helperStyle // <-- customized style
                    }
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
    alias: 'plugin.certegra-formhelper',

    /**
     * @cfg {String} helperText
     * displays text supplied by the plugin
     */
    helperText: null,

    /**
     * @cfg {Object} tipConfig
     * holds configs passed to the helper
     */
    tipConfig: {},

    /**
     * @cfg {String} align
     * customized alignment of the helper.
     */
    align: null,

    /**
     * @cfg {Number} width
     * default width of the helper
     */
    width: 200,

    /**
     * @method init
     * @param {Ext.form.field.Field} field - form field
     */
    init: function (field) {
        var me = this;

        me.resizeCount = 0; // textarea field resize counter

        if (!me.helperText) {
            return;
        }

        // create helper and apply styles
        if (!me.helper) {
            me.helper = me.createHelper();
        }

        me.helper.setHtml(me.helperText);
        // set text for the helper
        me.setCmp(field);

        // listeners
        field.on({
            'blur': function (field) {
                me.helper.hide();
            },

            'focus': function (field) {
                me.showHelper(field);
            }
        });

        // handle textarea field (textareafield can be set to auto grow).
        // textarea resize is called multiple times during the load, boxready is a hack to hide the helper on initial load.
        if (field.xtype === 'textareafield') {
            field.on({
                'resize': function (field) {
                    if (me.resizeCount >= 1) {
                        me.showHelper(field);
                    }
                    me.resizeCount++;
                },

                'boxready': function (field) {
                    me.helper.hide();
                }
            });
        }
    },

    /**
     * sets helper text and initializes the helper
     * @param {String} helperText - helper text
     * @param {Ext.form.field.Field} - field to tie the helper to
     */
    setHelperText: function (helperText, field) {
        var me = this;
        me.helperText = helperText;
        me.init(field);
    },

    /**
     * displays helper
     * @param {Ext.form.field.Field} field - form field
     */
    showHelper: function (field) {
        var me = this,
            fieldWidth = field.bodyEl.getWidth() || field.getWidth();

        // fields with triggers
        if (field.isXType('numberfield') || field.isXType('combobox')) {
            fieldWidth = field.bodyEl.getWidth(); // get entire field width with the trigger (if any)
        }

        // field width must be greater than the default
        // minimum width (for checkboxes, radio buttons etc)
        if (fieldWidth >= me.width) {
            me.helper.setWidth(fieldWidth);
        }

        // show helper with offsets and align to a customized or a default value of bottom left
        me.helper.showBy(field.bodyEl);
    },

    /**
     * creates helper
     */
    createHelper: function () {
        var me = this,
            cfg;

        cfg = Ext.apply({
            html: me.helperText || 'This is to hover below the text box',
            defaultAlign: 'tl-bl',
            visible: false,
            anchor: true,
            bodyPadding: 5,
            alwaysOnTop: true,
            autoHide: false,
            closable: true,
            header: false,
        }, me.tipConfig);

        return Ext.create('Ext.tip.ToolTip', cfg);
    },

    /**
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