#!/usr/bin/env ruby
require 'xcodeproj'

# --- Đọc tham số truyền vào từ CLI ---
project_path = 'ios/LivoProfessionalsApp.xcodeproj'
default_target_name = ARGV[0] || 'LivoProfessionalsApp'
targets_arg = ARGV[1] || ''

# Parse chuỗi targets dạng "name:suffix,name:suffix"
targets = targets_arg.split(',').map do |str|
  name, suffix = str.split(':', 2)
  { name: name.strip, bundle_id_suffix: suffix ? suffix.strip : '' }
end.reject { |t| t[:name].empty? }

puts "[with_multi_target] Nhận default_target_name: #{default_target_name}"
puts "[with_multi_target] Nhận targets: #{targets.inspect}"

# --- Mở project ---
project = Xcodeproj::Project.open(project_path)
puts "[with_multi_target] Đã mở project: #{project_path}"

default_target = project.targets.find { |t| t.name == default_target_name }
raise "[with_multi_target] Không tìm thấy target mặc định '#{default_target_name}'" unless default_target

existing_target_names = project.targets.map(&:name)

targets.each do |cfg|
  new_name = cfg[:name]
  bundle_id_suffix = cfg[:bundle_id_suffix]

  if existing_target_names.include?(new_name)
    puts "[with_multi_target] Target '#{new_name}' đã tồn tại, bỏ qua."
    next
  end

  puts "[with_multi_target] Đang clone target '#{default_target_name}' -> '#{new_name}'"
  new_target = project.duplicate_target(default_target, new_name)

  # Sửa bundleId cho tất cả build config của target mới
  new_target.build_configurations.each do |config|
    bundle_id = config.build_settings['PRODUCT_BUNDLE_IDENTIFIER']
    if bundle_id
      new_bundle_id = bundle_id + bundle_id_suffix
      puts "[with_multi_target]   BuildConfig: #{config.name}, bundleId: #{bundle_id} -> #{new_bundle_id}"
      config.build_settings['PRODUCT_BUNDLE_IDENTIFIER'] = new_bundle_id
    end
  end
end

project.save
puts "[with_multi_target] Đã ghi lại Xcode project!"
