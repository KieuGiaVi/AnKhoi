import 'package:flutter_test/flutter_test.dart';
import 'package:hcare_plus/main.dart';

void main() {
  testWidgets('HCareApp renders successfully', (WidgetTester tester) async {
    await tester.pumpWidget(const HCareApp());

    expect(find.text('Ứng dụng Bệnh nhân HCare+'), findsOneWidget);
  });
}
