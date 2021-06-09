const { body } = require('express-validator')
const Cart=require('../models/cart')

exports.addItemToCart=(req,res)=>{
    Cart.findOne({user:req.user._id})
    .exec((err,cart)=>{
        if(err){
            return res.status(400).send(err)
        }
        if(cart){
            const product=req.body.cartItems.product
            const item=cart.cartItems.find( c => c.product == product) //find is javascript function
            let condition,update;
            if(item){
                condition={user:req.user._id,"cartItems.product":product}
                update={
                    "$set":{
                        "cartItems.$":{
                             ...req.body.cartItems,
                             quantity:item.quantity+req.body.cartItems.quantity
                        }
                    }
                }

            }else{
                condition={user:req.user._id}
                update={
                    "$push":{
                        "cartItems":req.body.cartItems
                    }
                }
            }

            Cart.findOneAndUpdate(condition,update).exec((err,cart)=>{
                if(err) return res.status(400).send(err)
                if(cart){
                    return res.status(200).send(cart)
                }
            })                
            
        } 

        if(!cart){
            const cart=new Cart({
                user:req.user._id,
                cartItems:[req.body.cartItems]
            })
            cart.save((err,cart)=>{
                if(err) return res.status(400).send(err)
                if(cart) return res.status(400).send(cart)
            })
        }
    
    })
}