#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Base URL for the API
BASE_URL="http://localhost:5000/api"

# Function to print colored output
print_status() {
    local status=$1
    local message=$2
    local response=$3
    local http_status=$4

    if ! [[ "$http_status" =~ ^[0-9]+$ ]] || [ "$http_status" -lt 200 ] || [ "$http_status" -ge 300 ]; then
        echo -e "${RED}✗ $message${NC}"
        echo -e "${RED}Invalid or error HTTP Status: $http_status${NC}"
        echo -e "${RED}Response: $response${NC}"
        return 1
    fi

    if ! echo "$response" | jq -e '.' >/dev/null 2>&1; then
        echo -e "${RED}✗ $message${NC}"
        echo -e "${RED}Invalid JSON response:${NC}"
        echo "$response"
        return 1
    fi

    if echo "$response" | jq -e '.error' >/dev/null 2>&1; then
        echo -e "${RED}✗ $message${NC}"
        echo -e "${RED}Error: $(echo "$response" | jq -r '.error')${NC}"
        return 1
    fi

    if ! echo "$response" | jq -e '.success == true' >/dev/null 2>&1; then
        echo -e "${RED}✗ $message${NC}"
        echo -e "${RED}Error: $(echo "$response" | jq -r '.message // "Request failed"')${NC}"
        return 1
    fi

    echo -e "${GREEN}✓ $message${NC}"
    return 0
}

print_response() {
    local title=$1
    local response=$2
    echo -e "\n${BLUE}=== $title Response ===${NC}"

    if formatted_json=$(echo "$response" | jq -e '.' 2>/dev/null); then
        echo "$formatted_json" | jq --color-output '.'
    else
        echo -e "${YELLOW}Raw response (not valid JSON):${NC}"
        echo -e "${YELLOW}---BEGIN RESPONSE---${NC}"
        echo "$response"
        echo -e "${YELLOW}---END RESPONSE---${NC}"
    fi
    echo
}

make_request() {
    local method=$1
    local endpoint=$2
    local data=$3
    local auth_token=$4

    if [ -n "$auth_token" ]; then
        curl -s -w "\n%{http_code}" -X $method \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $auth_token" \
        -d "$data" \
        "${BASE_URL}${endpoint}"
    else
        curl -s -w "\n%{http_code}" -X $method \
        -H "Content-Type: application/json" \
        -d "$data" \
        "${BASE_URL}${endpoint}"
    fi
}

verify_mongo() {
    local collection=$1
    local query=$2
    echo -e "\n${BLUE}=== MongoDB $collection Collection ===${NC}"
    mongosh --quiet --eval "db.getSiblingDB('delivery_app').$collection.find($query).pretty()"
    echo
}

echo -e "${YELLOW}Starting integration tests...${NC}"
echo "Waiting for server to start..."
sleep 5

# Test 1: Create Customer
echo -e "\n${YELLOW}=== Test 1: Creating Customer ===${NC}"
CUSTOMER_PHONE="+919783757303"
response=$(make_request "POST" "/auth/send-otp" "{\"phoneNumber\": \"$CUSTOMER_PHONE\"}")
RESPONSE=$(echo "$response" | sed '$d')
HTTP_STATUS=$(echo "$response" | tail -n1)

print_response "Send OTP" "$RESPONSE"
print_status $? "Send OTP Request" "$RESPONSE" "$HTTP_STATUS" || exit 1
sleep 2

response=$(make_request "POST" "/auth/verify-otp" "{\"phoneNumber\": \"$CUSTOMER_PHONE\", \"otp\": \"123456\", \"name\": \"Test Customer\"}")
RESPONSE=$(echo "$response" | sed '$d')
HTTP_STATUS=$(echo "$response" | tail -n1)

print_response "Customer Auth" "$RESPONSE"
CUSTOMER_TOKEN=$(echo "$RESPONSE" | jq -r '.data.token')
print_status $? "Customer Creation" "$RESPONSE" "$HTTP_STATUS" || exit 1
verify_mongo "users" "{phone: \"$CUSTOMER_PHONE\"}"

# Test 2: Create Admin User
echo -e "\n${YELLOW}=== Test 2: Creating Admin User ===${NC}"
ADMIN_PHONE="+916299425371"
response=$(make_request "POST" "/auth/send-otp" "{\"phoneNumber\": \"$ADMIN_PHONE\"}")
RESPONSE=$(echo "$response" | sed '$d')
HTTP_STATUS=$(echo "$response" | tail -n1)

print_response "Send OTP" "$RESPONSE"
print_status $? "Send OTP Request" "$RESPONSE" "$HTTP_STATUS" || exit 1
sleep 2

response=$(make_request "POST" "/auth/verify-otp" "{\"phoneNumber\": \"$ADMIN_PHONE\", \"otp\": \"123456\", \"name\": \"Test Admin\", \"role\": \"admin\"}")
RESPONSE=$(echo "$response" | sed '$d')
HTTP_STATUS=$(echo "$response" | tail -n1)

print_response "Admin Auth" "$RESPONSE"
ADMIN_TOKEN=$(echo "$RESPONSE" | jq -r '.data.token')
print_status $? "Admin Creation" "$RESPONSE" "$HTTP_STATUS" || exit 1
verify_mongo "users" "{phone: \"$ADMIN_PHONE\"}"

# Test 4: Populate Restaurants
echo -e "\n${YELLOW}=== Test 4: Populating Restaurants and Menu Items ===${NC}"
response=$(make_request "POST" "/dummy/populate" "{}" "$ADMIN_TOKEN")
RESPONSE=$(echo "$response" | sed '$d')
HTTP_STATUS=$(echo "$response" | tail -n1)

print_response "Population" "$RESPONSE"
print_status $? "Restaurant Population" "$RESPONSE" "$HTTP_STATUS" || exit 1
verify_mongo "restaurants" "{}"

# Test 5: Get Restaurant List
echo -e "\n${YELLOW}=== Test 5: Getting Restaurant List ===${NC}"
response=$(make_request "GET" "/restaurants" "{}" "$CUSTOMER_TOKEN")
RESPONSE=$(echo "$response" | sed '$d')
HTTP_STATUS=$(echo "$response" | tail -n1)

print_response "Restaurants" "$RESPONSE"
RESTAURANT_ID=$(echo "$RESPONSE" | jq -r '.data[0]._id')
if [ "$RESTAURANT_ID" = "null" ] || [ -z "$RESTAURANT_ID" ]; then
    echo -e "${RED}Failed to get restaurant ID from response${NC}"
    exit 1
fi
print_status $? "Get Restaurants" "$RESPONSE" "$HTTP_STATUS" || exit 1

# Test 6: Get Menu Items
echo -e "\n${YELLOW}=== Test 6: Getting Menu Items ===${NC}"
response=$(make_request "GET" "/restaurants/$RESTAURANT_ID/menu" "{}" "$CUSTOMER_TOKEN")
RESPONSE=$(echo "$response" | sed '$d')
HTTP_STATUS=$(echo "$response" | tail -n1)

print_response "Menu Items" "$RESPONSE"
MENU_ITEM_ID=$(echo "$RESPONSE" | jq -r '.data[0]._id')
if [ "$MENU_ITEM_ID" = "null" ] || [ -z "$MENU_ITEM_ID" ]; then
    echo -e "${RED}Failed to get menu item ID from response${NC}"
    exit 1
fi
print_status $? "Get Menu Items" "$RESPONSE" "$HTTP_STATUS" || exit 1
verify_mongo "menuitems" "{restaurant: ObjectId('$RESTAURANT_ID')}"

# Test 7: Create Order
echo -e "\n${YELLOW}=== Test 7: Creating Order ===${NC}"
ORDER_DATA="{
    \"restaurantId\": \"$RESTAURANT_ID\",
    \"items\": [{
        \"menuItem\": \"$MENU_ITEM_ID\",
        \"quantity\": 2
    }],
    \"deliveryAddress\": {
        \"street\": \"123 Test St\",
        \"city\": \"Test City\",
        \"state\": \"Test State\",
        \"zipCode\": \"12345\"
    }
}"
response=$(make_request "POST" "/orders" "$ORDER_DATA" "$CUSTOMER_TOKEN")
RESPONSE=$(echo "$response" | sed '$d')
HTTP_STATUS=$(echo "$response" | tail -n1)

print_response "Create Order" "$RESPONSE"
ORDER_ID=$(echo "$RESPONSE" | jq -r '.data._id')
if [ "$ORDER_ID" = "null" ] || [ -z "$ORDER_ID" ]; then
    echo -e "${RED}Failed to get order ID from response${NC}"
    exit 1
fi
print_status $? "Create Order" "$RESPONSE" "$HTTP_STATUS" || exit 1
verify_mongo "orders" "{_id: ObjectId('$ORDER_ID')}"

# Test 8: Update Order Status
echo -e "\n${YELLOW}=== Test 8: Updating Order Status ===${NC}"
response=$(make_request "PUT" "/orders/$ORDER_ID/status" "{\"status\": \"confirmed\"}" "$ADMIN_TOKEN")
RESPONSE=$(echo "$response" | sed '$d')
HTTP_STATUS=$(echo "$response" | tail -n1)

print_response "Update Order" "$RESPONSE"
print_status $? "Update Order Status" "$RESPONSE" "$HTTP_STATUS" || exit 1
verify_mongo "orders" "{_id: ObjectId('$ORDER_ID')}"

# Test 9: Get User Orders
echo -e "\n${YELLOW}=== Test 9: Getting User Orders ===${NC}"
response=$(make_request "GET" "/orders/user/orders" "{}" "$CUSTOMER_TOKEN")
RESPONSE=$(echo "$response" | sed '$d')
HTTP_STATUS=$(echo "$response" | tail -n1)

print_response "User Orders" "$RESPONSE"
print_status $? "Get User Orders" "$RESPONSE" "$HTTP_STATUS" || exit 1

# Test 10: Get Order Details
echo -e "\n${YELLOW}=== Test 10: Getting Order Details ===${NC}"
response=$(make_request "GET" "/orders/$ORDER_ID" "{}" "$CUSTOMER_TOKEN")
RESPONSE=$(echo "$response" | sed '$d')
HTTP_STATUS=$(echo "$response" | tail -n1)

print_response "Order Details" "$RESPONSE"
print_status $? "Get Order Details" "$RESPONSE" "$HTTP_STATUS" || exit 1

echo -e "\n${YELLOW}Integration tests completed!${NC}"

echo -e "\n${YELLOW}=== Final Database State ===${NC}"
echo -e "${BLUE}Users Collection:${NC}"
verify_mongo "users" "{}"
echo -e "${BLUE}Restaurants Collection:${NC}"
verify_mongo "restaurants" "{}"
echo -e "${BLUE}Menu Items Collection:${NC}"
verify_mongo "menuitems" "{}"
echo -e "${BLUE}Orders Collection:${NC}"
verify_mongo "orders" "{}"