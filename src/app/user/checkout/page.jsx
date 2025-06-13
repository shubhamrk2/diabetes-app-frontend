"use client"

import { useState } from "react"
import axios from "axios"
import { useCart } from "@/context/CartContext"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  CreditCard,
  Smartphone,
  Truck,
  MapPin,
  User,
  Mail,
  Phone,
  ShoppingCart,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react"

const CheckoutPage = () => {
  const { cartItems, clearCart, getCartTotal } = useCart()
  const { user, token } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const [userInfo, setUserInfo] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
  })

  const [paymentMethod, setPaymentMethod] = useState("cod")
  const [upiId, setUpiId] = useState("")

  const api = axios.create({
    baseURL: "http://localhost:5000/api",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
  })

  const paymentMethods = [
    {
      id: "cod",
      name: "Cash on Delivery",
      description: "Pay when your order arrives",
      icon: Truck,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
    {
      id: "upi",
      name: "UPI Payment",
      description: "Pay instantly using UPI",
      icon: Smartphone,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    {
      id: "card",
      name: "Credit/Debit Card",
      description: "Pay securely with your card",
      icon: CreditCard,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
    },
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setUserInfo((prev) => ({ ...prev, [name]: value }))
  }

  const validateForm = () => {
    if (!userInfo.name || !userInfo.address || !userInfo.phone || !userInfo.email) {
      return { isValid: false, message: "Please fill in all shipping information fields!" }
    }

    if (!user?._id) {
      return { isValid: false, message: "Please login to checkout" }
    }

    if (!cartItems || cartItems.length === 0) {
      return { isValid: false, message: "Your cart is empty" }
    }

    if (paymentMethod === "upi" && !upiId) {
      return { isValid: false, message: "Please enter your UPI ID" }
    }

    const total = Number.parseFloat(getCartTotal())
    if (isNaN(total) || total <= 0) {
      return { isValid: false, message: "Invalid total price" }
    }

    return { isValid: true }
  }

  const handleCheckout = async () => {
    const validation = validateForm()

    if (!validation.isValid) {
      alert(validation.message)
      if (validation.message === "Please login to checkout") {
        router.push("/login")
      }
      return
    }

    setLoading(true)
    const total = Number.parseFloat(getCartTotal())

    try {
      if (paymentMethod === "upi") {
        // Create Razorpay order
        const { data: razorpayOrder } = await api.post("/razorpay/create-order", {
          amount: total,
        })

        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          name: "Diabetes Health Hub",
          description: "Payment for your order",
          order_id: razorpayOrder.orderId,
          handler: async function (response) {
            try {
              // Verify payment
              await api.post("/razorpay/verify-payment", {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              })

              // Create order
              const orderPayload = {
                userId: user._id,
                items: cartItems.map((item) => ({
                  itemId: item.productId,
                  itemType: item.type === "Equipment" ? "Equipment" : "Food",
                  quantity: Math.max(1, Number.parseInt(item.quantity) || 1),
                })),
                totalPrice: total,
                shippingInfo: {
                  name: userInfo.name.trim(),
                  address: userInfo.address.trim(),
                  phone: userInfo.phone.trim(),
                  email: userInfo.email.trim(),
                },
                paymentMethod: {
                  type: "upi",
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  status: "completed",
                },
                status: "Processing",
              }

              await api.post("/orders/add", orderPayload)
              alert("Payment successful! Order placed.")
              await clearCart()
              router.push("/user/order")
            } catch (error) {
              console.error("Payment verification failed:", error)
              alert("Payment verification failed. Please contact support.")
            }
          },
          prefill: {
            name: userInfo.name,
            email: userInfo.email,
            contact: userInfo.phone,
          },
          theme: {
            color: "#10B981",
          },
        }

        const razorpayInstance = new window.Razorpay(options)
        razorpayInstance.open()
      } else {
        // Handle COD or other payment methods
        const orderPayload = {
          userId: user._id,
          items: cartItems.map((item) => ({
            itemId: item.productId,
            itemType: item.type === "Equipment" ? "Equipment" : "Food",
            quantity: Math.max(1, Number.parseInt(item.quantity) || 1),
          })),
          totalPrice: total,
          shippingInfo: {
            name: userInfo.name.trim(),
            address: userInfo.address.trim(),
            phone: userInfo.phone.trim(),
            email: userInfo.email.trim(),
          },
          paymentMethod: {
            type: paymentMethod,
            status: paymentMethod === "cod" ? "pending" : "completed",
          },
          status: "Pending",
        }

        await api.post("/orders/add", orderPayload)
        alert("Order placed successfully!")
        await clearCart()
        router.push("/user/order")
      }
    } catch (error) {
      console.error("Checkout failed:", error)
      const errorMessage = error.response?.data?.message || error.message || "Failed to place order"
      alert(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const isFormValid =
    userInfo.name &&
    userInfo.address &&
    userInfo.phone &&
    userInfo.email &&
    (paymentMethod !== "upi" || upiId) &&
    cartItems.length > 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Secure Checkout
          </h1>
          <p className="text-gray-600">Complete your order in just a few steps</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Information */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  Shipping Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={userInfo.name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      className="rounded-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={userInfo.phone}
                      onChange={handleInputChange}
                      placeholder="Enter your phone number"
                      className="rounded-lg"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={userInfo.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email address"
                    className="rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Delivery Address
                  </Label>
                  <Input
                    id="address"
                    name="address"
                    value={userInfo.address}
                    onChange={handleInputChange}
                    placeholder="Enter your complete address"
                    className="rounded-lg"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Payment Methods */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <CreditCard className="h-5 w-5 text-green-600" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
                  {paymentMethods.map((method) => {
                    const IconComponent = method.icon
                    return (
                      <div key={method.id} className="relative">
                        <div
                          className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 ${
                            paymentMethod === method.id
                              ? `${method.borderColor} ${method.bgColor}`
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <RadioGroupItem value={method.id} id={method.id} />
                            <div className={`p-2 rounded-lg ${method.bgColor}`}>
                              <IconComponent className={`h-5 w-5 ${method.color}`} />
                            </div>
                            <div className="flex-1">
                              <Label htmlFor={method.id} className="font-medium cursor-pointer">
                                {method.name}
                              </Label>
                              <p className="text-sm text-gray-600">{method.description}</p>
                            </div>
                            {paymentMethod === method.id && <CheckCircle className="h-5 w-5 text-green-600" />}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </RadioGroup>

                {/* UPI ID Input */}
                {paymentMethod === "upi" && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <Label htmlFor="upiId" className="flex items-center gap-2 mb-2">
                      <Smartphone className="h-4 w-4" />
                      UPI ID
                    </Label>
                    <Input
                      id="upiId"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="yourname@paytm / yourname@gpay"
                      className="rounded-lg"
                    />
                    <p className="text-xs text-blue-600 mt-1">
                      Enter your UPI ID (e.g., yourname@paytm, yourname@gpay)
                    </p>
                  </div>
                )}

                {/* Card Payment Note */}
                {paymentMethod === "card" && (
                  <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="flex items-center gap-2 text-purple-700">
                      <AlertCircle className="h-4 w-4" />
                      <span className="text-sm font-medium">Card payment will be processed securely</span>
                    </div>
                    <p className="text-xs text-purple-600 mt-1">You will be redirected to a secure payment gateway</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Order Summary */}
          <div className="space-y-6">
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <ShoppingCart className="h-5 w-5 text-green-600" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartItems.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Your cart is empty</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {cartItems.map((item) => (
                        <div
                          key={item.productId}
                          className="flex justify-between items-start p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{item.name}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {item.type}
                              </Badge>
                              <span className="text-xs text-gray-600">Qty: {item.quantity}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Subtotal</span>
                        <span>₹{getCartTotal()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Shipping</span>
                        <span className="text-green-600">Free</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Tax</span>
                        <span>₹0.00</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span className="text-green-600">₹{getCartTotal()}</span>
                      </div>
                    </div>

                    <Button
                      onClick={handleCheckout}
                      disabled={!isFormValid || loading}
                      className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white rounded-lg py-3 text-lg font-semibold transition-all duration-300"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-5 w-5 mr-2" />
                          Complete Order
                        </>
                      )}
                    </Button>

                    {paymentMethod === "cod" && (
                      <div className="text-center">
                        <p className="text-xs text-gray-600">
                          💰 You will pay ₹{getCartTotal()} when your order arrives
                        </p>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>

            {/* Security Badge */}
            <Card className="shadow-lg border-0 bg-gradient-to-r from-green-50 to-blue-50">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="font-semibold text-green-700">Secure Checkout</span>
                </div>
                <p className="text-xs text-gray-600">Your payment information is encrypted and secure</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage
